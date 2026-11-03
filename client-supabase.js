(function(){
'use strict';
const $=id=>document.getElementById(id);
const labels=[['shoulder','Ombro'],['chest','Peito'],['bicepsLeft','Bíceps esquerdo'],['bicepsRight','Bíceps direito'],['forearmLeft','Antebraço esquerdo'],['forearmRight','Antebraço direito'],['abdomen','Abdômen'],['hip','Quadril'],['thighLeft','Coxa esquerda'],['thighRight','Coxa direita'],['calfLeft','Panturrilha esquerda'],['calfRight','Panturrilha direita']];
let db=null,activeClient=null,activePlan={days:[]},selectedDay=null;
function status(message,error=false){$('feedback').textContent=message;$('feedback').className='portal-feedback'+(error?' error':'');}
function check(result){if(result.error)throw result.error;return result.data;}
function error(err){status(err.message||String(err),true);}
function validConfig(){
  const config=window.MEU_TREINO_SUPABASE||{};
  return /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url||'')&&typeof config.publishableKey==='string'&&config.publishableKey.length>15;
}
function view(mode){$('login').hidden=mode!=='login';$('portalContent').hidden=mode!=='content';$('logout').hidden=mode!=='content';$('setup').hidden=mode!=='setup';}
function localDate(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return '';
  const a=value.split('-');return a[2]+'/'+a[1]+'/'+a[0];
}
function renderMeasures(record){
  const mount=$('measureGrid');mount.replaceChildren();
  $('measurementDate').textContent=record?.measurement_date?'Registradas em '+localDate(record.measurement_date):'Sem data de avaliação';
  const values=record?.values_cm||{};
  labels.forEach(([key,text])=>{
    const row=document.createElement('div');row.className='measure-row';
    const dt=document.createElement('dt');dt.textContent=text;
    const dd=document.createElement('dd');const n=Number(values[key]);
    if(values[key]!==undefined&&values[key]!==null&&Number.isFinite(n)&&n>0&&n<=300)dd.textContent=n.toLocaleString('pt-BR',{maximumFractionDigits:2})+' cm';
    else{dd.textContent='Não informado';dd.className='empty';}
    row.append(dt,dd);mount.appendChild(row);
  });
}
function element(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;}
function renderDays(){
  const selector=$('daySelector');selector.replaceChildren();
  const days=Array.isArray(activePlan.days)?activePlan.days:[];
  if(!days.length){$('dayDetails').replaceChildren(element('p','empty-message','Nenhum treino publicado pelo seu professor.'));return;}
  if(!days.some(d=>d.id===selectedDay))selectedDay=days[0].id;
  days.forEach((d,i)=>{
    const button=element('button','day-button'+(d.id===selectedDay?' active':''),d.title||('Treino '+(i+1)));
    button.type='button';button.setAttribute('aria-pressed',String(d.id===selectedDay));
    button.addEventListener('click',()=>{selectedDay=d.id;renderDays();});selector.appendChild(button);
  });
  const day=days.find(d=>d.id===selectedDay)||days[0];
  const root=$('dayDetails');root.replaceChildren();
  const header=element('section','day-header');
  header.appendChild(element('small','schedule',day.weekday||'Sessão personalizada'));
  header.appendChild(element('h3',null,day.title||'Treino'));
  if(day.description)header.appendChild(element('p',null,day.description));
  root.appendChild(header);
  const exercises=Array.isArray(day.exercises)?day.exercises:[];
  if(!exercises.length){root.appendChild(element('p','empty-message','Seu professor ainda não adicionou exercícios.'));return;}
  exercises.forEach((ex,i)=>{
    const details=element('details','portal-exercise');
    const summary=element('summary');
    summary.appendChild(element('span','number',String(i+1).padStart(2,'0')));
    const main=element('span','title-group');
    main.appendChild(element('strong',null,ex.name||'Exercício'));
    main.appendChild(element('small',null,[ex.dose,ex.rest?'Descanso: '+ex.rest:''].filter(Boolean).join(' · ')));
    summary.appendChild(main);summary.appendChild(element('span',null,'⌄'));details.appendChild(summary);
    const body=element('div','exercise-detail');
    if(ex.description)body.appendChild(element('p',null,ex.description));
    const id=typeof ex.videoId==='string'?ex.videoId:'';
    const clip=window.MeuTreinoVideos?.clips?.[id];
    // Exibe somente vídeos previamente hospedados no próprio site, sem links arbitrários.
    if(clip&&typeof clip.url==='string'&&/^\.\/assets\/videos\/[a-z0-9_-]+\.mp4$/i.test(clip.url)){
      const video=document.createElement('video');video.controls=true;video.preload='none';video.playsInline=true;video.src=clip.url;
      if(typeof clip.poster==='string'&&/^\.\/assets\/(videos|images)\/[a-z0-9_-]+\.webp$/i.test(clip.poster))video.poster=clip.poster;
      video.setAttribute('aria-label','Demonstração de '+(ex.name||'exercício'));
      body.appendChild(video);body.appendChild(element('p','media-caption','Demonstração de referência. Siga as orientações do seu professor.'));
    }
    details.appendChild(body);root.appendChild(details);
  });
}
async function loadSiteNotice(){
  const n=check(await db.from('site_announcements').select('enabled,title,message').eq('id',1).maybeSingle());
  const visible=n?.enabled===true&&typeof n.message==='string'&&!!n.message.trim();
  $('notice').hidden=!visible;
  if(visible){$('noticeTitle').textContent=n.title||'Aviso';$('noticeText').textContent=n.message;}
}
async function loadClient(user){
  const linked=check(await db.rpc('claim_treino_client'));
  if(!linked){view('login');status('Sua conta está autenticada, mas ainda não possui um cadastro liberado pelo professor. Confirme seu e-mail e peça ao professor para usar o mesmo endereço.',true);return;}
  const client=check(await db.from('clients').select('id,full_name,email').eq('id',linked).maybeSingle());
  if(!client){view('login');status('Cadastro não encontrado. Entre em contato com seu professor.',true);return;}
  activeClient=client;
  const [m,p,n]=await Promise.all([
    db.from('client_measurements').select('measurement_date,values_cm').eq('client_id',client.id).maybeSingle(),
    db.from('client_plans').select('plan').eq('client_id',client.id).maybeSingle(),
    db.from('site_announcements').select('enabled,title,message').eq('id',1).maybeSingle()
  ]);
  renderMeasures(check(m));
  activePlan=check(p)?.plan||{days:[]};
  selectedDay=null;renderDays();
  const notice=check(n);const visible=notice?.enabled===true&&!!notice.message?.trim();
  $('notice').hidden=!visible;
  if(visible){$('noticeTitle').textContent=notice.title||'Aviso';$('noticeText').textContent=notice.message;}
  $('clientName').textContent=client.full_name;
  $('pageTitle').textContent='Bem-vindo ao seu treino.';
  view('content');status('Suas informações estão sincronizadas com o professor.');
}
async function initialize(){
  const cfg=window.MEU_TREINO_SUPABASE||{};
  if(!validConfig()||!window.supabase){view('setup');status('A integração com o Supabase precisa ser ativada pelo administrador.',true);return;}
  db=window.supabase.createClient(cfg.url,cfg.publishableKey);
  try{const user=check(await db.auth.getUser()).user;if(user)await loadClient(user);else{view('login');status('Faça login para visualizar suas informações.');}}
  catch(err){view('login');error(err);}
}
$('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();if(!db)return;
  try{
    status('Entrando na sua conta...');
    const result=check(await db.auth.signInWithPassword({email:$('email').value.trim().toLowerCase(),password:$('password').value}));
    $('password').value='';await loadClient(result.user);
  }catch(err){error(err);}
});
$('signUp').addEventListener('click',async()=>{
  if(!db)return;const email=$('email').value.trim().toLowerCase(),password=$('password').value;
  if(!email||password.length<8){status('Informe e-mail e senha com pelo menos 8 caracteres antes de criar a conta.',true);return;}
  try{const result=check(await db.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}}));
    $('password').value='';
    if(!result.session){status('Conta solicitada. Confirme o e-mail enviado pelo Supabase e depois entre.');return;}
    await loadClient(result.user);
  }catch(err){error(err);}
});
$('resetPassword').addEventListener('click',async()=>{
  if(!db)return;const email=$('email').value.trim();
  if(!email){status('Informe seu e-mail para redefinir a senha.',true);return;}
  try{check(await db.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname}));status('Se o e-mail existir, as instruções de recuperação serão enviadas.');}
  catch(err){error(err);}
});
$('logout').addEventListener('click',async()=>{
  if(!db)return;
  try{await db.auth.signOut();activeClient=null;activePlan={days:[]};view('login');status('Você saiu da sua conta.');}
  catch(err){error(err);}
});
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  const name=button.dataset.view;
  $('measurementsView').hidden=name!=='measurements';$('plansView').hidden=name!=='plans';
  document.querySelectorAll('[data-view]').forEach(b=>{const active=b.dataset.view===name;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
}));
initialize();
})();