(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  let db=null,approvedClient=null,mounted=false,recoveryMode=false,saveTimer=null,saveQueue=Promise.resolve();
  function show(mode){
    const names=['login','signupFormSection','pendingSection','resetForm','setup'];
    const target={login:'login',signup:'signupFormSection',pending:'pendingSection',reset:'resetForm',setup:'setup'}[mode];
    names.forEach(id=>$(id).hidden=id!==target);
    $('authShell').hidden=mode==='content';
    $('clientPortal').hidden=mode!=='content';
    $('logout').hidden=!db||mode==='login'||mode==='signup'||mode==='reset'||mode==='setup';
    const backup=document.querySelector('.backup-menu');
    if(backup)backup.hidden=mode!=='content';
  }
  function notice(message,problem=false){
    $('feedback').textContent=message;
    $('feedback').className='portal-feedback'+(problem?' error':'');
  }
  function check(result){if(result.error)throw result.error;return result.data;}
  function errorMessage(error){
    const message=error&&error.message?error.message:String(error);
    return /email rate limit exceeded/i.test(message)?'Limite de e-mails atingido. Tente novamente mais tarde. Verifique o SMTP no Supabase.':
      /invalid login credentials/i.test(message)?'E-mail ou senha incorretos.':
      /email not confirmed/i.test(message)?'Confirme o e-mail recebido antes de entrar.':message;
  }
  function err(error){notice(errorMessage(error),true);}
  function configValid(config){
    return /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url||'')&&typeof config.publishableKey==='string'&&config.publishableKey.length>15;
  }
  function stepArray(description){
    return typeof description==='string'?description.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,18):[];
  }
  function createCustomPlan(plan,reference){
    const refDays=reference?.plans||{},refIndex={};
    for(const [key,p] of Object.entries(refDays)){
      [...(p.mobility||[]).map(x=>({...x,category:'mobility'})),
       ...(p.exercises||[]).map(x=>({...x,category:'exercise'})),
       ...(p.cardio?[{...p.cardio,id:'cardio'+key,category:'cardio'}]:[])]
        .forEach(ex=>{refIndex[ex.id]=ex;});
    }
    const map={};
    for(const day of Array.isArray(plan?.days)?plan.days.slice(0,15):[]){
      if(!day||!day.id)continue;
      const key=String(day.id).slice(0,60);
      const ref=refDays[key]||{};
      const mapped={
        title:String(day.title||ref.title||'Treino').slice(0,130),
        subtitle:String(day.description||ref.subtitle||'Treino preparado pelo professor.').slice(0,2000),
        duration:String(day.duration||ref.duration||'Sessão personalizada').slice(0,80),
        interval:String(day.weekday||ref.interval||'Conforme orientação').slice(0,100),
        recover:String(day.recover||ref.recover||'').slice(0,150),
        mobility:[],exercises:[],cardio:null
      };
      for(const ex of Array.isArray(day.exercises)?day.exercises.slice(0,40):[]){
        if(!ex||!ex.id)continue;
        const mediaId=String(ex.videoId||ex.id).slice(0,65);
        const base=refIndex[mediaId]||refIndex[ex.id]||{};
        const category=['mobility','exercise','cardio'].includes(ex.category)?ex.category:base.category||'exercise';
        const steps=stepArray(ex.description);
        const x={
          id:String(ex.id).slice(0,70),
          name:String(ex.name||base.name||'Exercício').slice(0,130),
          dose:String(ex.dose||base.dose||'').slice(0,100),
          rest:String(ex.rest||base.rest||'').slice(0,70),
          videoId:mediaId,
          muscle:String(ex.muscle||base.muscle||'').slice(0,170),
          hotel:String(ex.hotel||base.hotel||'').slice(0,350),
          cue:String(ex.cue||base.cue||'').slice(0,450),
          suggestion:String(ex.description||base.suggestion||'').slice(0,2000),
          steps:steps.length?steps:base.steps||[],
          kind:base.kind||'',
          caution:base.caution===true,
          unit:ex.unit||base.unit||(/\b\d+\s*(?:s|segundos)\b/i.test(String(ex.dose||''))?'seconds':'')
        };
        if(category==='mobility')mapped.mobility.push(x);
        else if(category==='cardio'&&!mapped.cardio)mapped.cardio=x;
        else mapped.exercises.push(x);
      }
      map[key]=mapped;
    }
    return map;
  }
  function loadScript(url){
    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=url;script.onload=resolve;script.onerror=()=>reject(Error('Não foi possível carregar os recursos do site.'));
      document.body.appendChild(script);
    });
  }
  function syncProgress(clientId){
    return function(payload){
      if(!approvedClient||approvedClient.id!==clientId)return;
      const snapshot=JSON.parse(JSON.stringify(payload));
      clearTimeout(saveTimer);
      saveTimer=setTimeout(()=>{
        saveQueue=saveQueue.then(async()=>{
          const response=await db.from('client_progress').upsert({
            client_id:clientId,progress:snapshot,updated_at:new Date().toISOString()
          });
          if(response.error)console.warn('Progresso salvo no navegador; sincronização indisponível.',response.error.message);
        }).catch(err=>console.warn('Sincronização indisponível:',err.message));
      },700);
    };
  }
  async function mountLegacy(client,measure,record,announcement,progress){
    if(mounted){show('content');return;}
    const response=await fetch('./data/site-content.json',{cache:'no-store'});
    const original=response.ok?await response.json():{plans:{}};
    const parsed=createCustomPlan(record?.plan||{days:[]},original);
    window.MeuTreinoCustomPlan=parsed;
    window.MeuTreinoPlanKeys=Object.keys(parsed);
    window.MeuTreinoStorageSuffix=client.auth_user_id||client.id;
    window.MeuTreinoInitialProgress=progress?.progress||null;
    window.MeuTreinoSaveProgress=syncProgress(client.id);
    window.MeuTreinoContentReady=Promise.resolve({schemaVersion:1,site:{
      eyebrow:'ACOMPANHAMENTO PESSOAL',
      evaluationTitle:'Medições corporais',
      evaluationLead:'Medidas registradas pelo seu professor, disponíveis somente para você.',
      trainingTitle:'Seu treino. Seu ritmo.',
      trainingLead:'Abra os exercícios, veja o movimento e registre a evolução de cada série.',
      footer:'Meu Treino · Seu plano de 8 semanas',
      measurements:{date:measure?.measurement_date||'',values:measure?.values_cm||{}},
      announcement:{enabled:announcement?.enabled===true,title:announcement?.title||'',message:announcement?.message||''}
    }});
    // Sequência original: estado do plano, fichas em vídeo, progresso, cronômetro e backup.
    await loadScript('./app.js?v=legacy-3.0');
    await loadScript('./treinos.js?v=legacy-3.0');
    await loadScript('./experience.js?v=legacy-3.0');
    await loadScript('./legacy-catalog.js?v=legacy-3.0');
    mounted=true;
    show('content');
    $('logout').hidden=false;
  }
  async function loadClient(user){
    if(!user){show('login');notice('Entre para visualizar seu plano.');return;}
    const claimed=check(await db.rpc('register_treino_client'));
    if(!claimed){show('login');notice('Confirme seu e-mail antes de solicitar aprovação. Depois faça login novamente.',true);return;}
    const client=check(await db.from('clients').select('id,full_name,email,auth_user_id,approval_status').eq('id',claimed).maybeSingle());
    if(!client){show('login');notice('Não foi possível localizar seu cadastro.',true);return;}
    if(client.approval_status!=='approved'){
      approvedClient=null;show('pending');$('logout').hidden=false;
      notice('Cadastro recebido! Aguarde a aprovação do professor.');
      return;
    }
    approvedClient=client;notice('Carregando seu treino completo...');
    const results=await Promise.all([
      db.from('client_measurements').select('measurement_date,values_cm').eq('client_id',client.id).maybeSingle(),
      db.from('client_plans').select('plan').eq('client_id',client.id).maybeSingle(),
      db.from('site_announcements').select('enabled,title,message').eq('id',1).maybeSingle(),
      db.from('client_progress').select('progress').eq('client_id',client.id).maybeSingle()
    ]);
    const [measure,plan,announcement,progress]=results.map(check);
    await mountLegacy(client,measure,plan,announcement,progress);
  }
  async function initialize(){
    const cfg=window.MEU_TREINO_SUPABASE||{};
    if(!configValid(cfg)||!window.supabase){show('setup');notice('O Supabase ainda não está configurado.',true);return;}
    db=window.supabase.createClient(cfg.url,cfg.publishableKey);
    db.auth.onAuthStateChange(event=>{
      if(event==='PASSWORD_RECOVERY'){
        recoveryMode=true;show('reset');notice('Escolha sua nova senha.');
      }
    });
    try{
      const {user}=check(await db.auth.getUser());
      if(recoveryMode)return;
      if(user)await loadClient(user);
      else{show('login');notice('Entre ou crie sua conta para acompanhar seus treinos.');}
    }catch(e){show('login');err(e);}
  }
  $('loginForm').addEventListener('submit',async e=>{
    e.preventDefault();if(!db)return;
    try{
      notice('Entrando...');
      const {user}=check(await db.auth.signInWithPassword({
        email:$('email').value.trim().toLowerCase(),password:$('password').value
      }));
      $('password').value='';
      await loadClient(user);
    }catch(e){err(e);}
  });
  $('signUp').addEventListener('click',()=>{
    $('signupEmail').value=$('email').value.trim();
    $('signupName').value='';$('signupPassword').value='';
    show('signup');notice('Preencha seus dados para solicitar acesso.');
  });
  $('backToLogin').addEventListener('click',()=>{show('login');notice('Entre com sua conta.');});
  $('signupForm').addEventListener('submit',async e=>{
    e.preventDefault();if(!db)return;
    const full_name=$('signupName').value.trim(),email=$('signupEmail').value.trim().toLowerCase();
    const password=$('signupPassword').value;
    if(full_name.length<2||password.length<8){notice('Informe seu nome e uma senha de pelo menos 8 caracteres.',true);return;}
    try{
      const data=check(await db.auth.signUp({
        email,password,options:{emailRedirectTo:location.origin+location.pathname,data:{full_name}}
      }));
      $('signupPassword').value='';
      if(!data.session){
        show('login');$('email').value=email;
        notice('Cadastro enviado! Confirme o e-mail recebido e entre para acompanhar a aprovação.');
      }else await loadClient(data.user);
    }catch(e){err(e);}
  });
  $('refreshApproval').addEventListener('click',async()=>{
    if(!db)return;
    try{
      notice('Verificando aprovação...');
      const {user}=check(await db.auth.getUser());
      if(user)await loadClient(user);
      else{show('login');notice('Entre novamente para acompanhar a aprovação.');}
    }catch(e){err(e);}
  });
  $('resetPassword').addEventListener('click',async()=>{
    if(!db)return;
    const email=$('email').value.trim();
    if(!email){notice('Digite seu e-mail primeiro.',true);return;}
    try{
      check(await db.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname}));
      notice('Se o e-mail existir, enviaremos as instruções de recuperação.');
    }catch(e){err(e);}
  });
  $('newPasswordForm').addEventListener('submit',async e=>{
    e.preventDefault();if(!db)return;
    const password=$('newPassword').value;
    if(password.length<8){notice('A senha precisa ter pelo menos 8 caracteres.',true);return;}
    try{
      check(await db.auth.updateUser({password}));
      await db.auth.signOut();
      location.reload();
    }catch(e){err(e);}
  });
  $('logout').addEventListener('click',async()=>{
    if(!db)return;
    try{await db.auth.signOut();location.reload();}catch(e){err(e);}
  });
  initialize();
})();