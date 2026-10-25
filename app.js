
(function(){
  'use strict';

  // A avaliação é independente dos treinos. A chave antiga permanece intacta.
  var storageKey='meu-treino-v2';
  var oldStorageKey='meu-treino-antropometria-v1';
  var selectedKey='meu-treino-semana-selecionada-v1';
  var activeTabKey='meu-treino-aba-v2';
  var groups=[
    {name:'Informações básicas',icon:'◌',items:[['idade','Idade','anos'],['peso','Peso','kg'],['altura','Altura','cm']]},
    {name:'Tronco',icon:'▣',items:[['cintura','Cintura','cm'],['abdomen','Abdômen','cm'],['quadril','Quadril','cm'],['busto','Busto','cm'],['torax','Tórax','cm']]},
    {name:'Braços',icon:'⌁',items:[['bracoRelaxado','Braço relaxado','cm'],['bracoIsometria','Braço em isometria','cm']]},
    {name:'Pernas',icon:'◇',items:[['coxa','Coxa','cm'],['panturrilha','Panturrilha','cm']]}
  ];
  var allIds=groups.flatMap(function(group){return group.items.map(function(item){return item[0];});});
  var el=function(id){return document.getElementById(id);};
  var emptyAssessment=function(){return {date:'',values:{}};};
  var emptyData=function(){return {version:2,evaluation:emptyAssessment(),weeks:Array.from({length:8},function(){return {}; }),legacyWeeklyMeasures:[]};};
  var toastTimer;
  function toast(message){
    var node=el('toast');node.textContent=message;node.classList.add('visible');
    clearTimeout(toastTimer);toastTimer=setTimeout(function(){node.classList.remove('visible');},3000);
  }
  function isValidEntry(str){return str===''||(/^\d{1,4}([.,]\d{0,2})?$/.test(str)&&Number(str.replace(',','.'))>=0);}
  function hasValue(str){return typeof str==='string'&&str.trim()!==''&&Number.isFinite(Number(str.replace(',','.')))&&Number(str.replace(',','.'))>0;}
  function normalizeAssessment(item){
    var values={};
    allIds.forEach(function(id){
      var val=item&&item.values&&item.values[id];
      if(typeof val==='string'||typeof val==='number'){
        var str=String(val).trim();
        if(isValidEntry(str))values[id]=str;
      }
    });
    var date=(item&&typeof item.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(item.date))?item.date:'';
    return {date:date,values:values};
  }
  function normalizeData(raw){
    if(!raw||typeof raw!=='object')throw new Error('Backup não reconhecido');
    if(raw.version===2&&raw.evaluation&&Array.isArray(raw.weeks)&&raw.weeks.length===8){
      // Mantém dados futuros de treinos e eventuais históricos importados.
      return {version:2,evaluation:normalizeAssessment(raw.evaluation),
        weeks:raw.weeks.map(function(week){return week&&typeof week==='object'&&!Array.isArray(week)?week:{};}),
        legacyWeeklyMeasures:Array.isArray(raw.legacyWeeklyMeasures)?raw.legacyWeeklyMeasures.slice(0,7).map(normalizeAssessment):[]};
    }
    if(Array.isArray(raw.weeks)&&raw.weeks.length===8){
      // Formato anterior: move medidas da semana 1 para Avaliação inicial.
      // Preserva registros antigos das semanas 2 a 8 no backup, sem exibi-los nos treinos.
      return {version:2,evaluation:normalizeAssessment(raw.weeks[0]),
        weeks:Array.from({length:8},function(){return {};}),
        legacyWeeklyMeasures:raw.weeks.slice(1).map(normalizeAssessment)};
    }
    throw new Error('Estrutura inválida');
  }
  function escapeHtml(str){return String(str).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];});}
  function countFields(item){return allIds.filter(function(id){return hasValue(item.values[id]);}).length;}

  var data=emptyData(), migrated=false, loadError=false;
  var activeWeek=1, activeTab='evaluation';
  try{
    var saved=localStorage.getItem(storageKey), old=localStorage.getItem(oldStorageKey);
    if(saved)data=normalizeData(JSON.parse(saved));
    else if(old){data=normalizeData(JSON.parse(old));migrated=true;}
    // A new device starts blank. Existing records from /treino/ share this origin.
    activeWeek=Number(localStorage.getItem(selectedKey))||1;
    if(!Number.isInteger(activeWeek)||activeWeek<1||activeWeek>8)activeWeek=1;
    activeTab=localStorage.getItem(activeTabKey)==='training'?'training':'evaluation';
  }catch(err){loadError=true;data=emptyData();}
  function persist(){
    try{
      localStorage.setItem(storageKey,JSON.stringify(data));
      localStorage.setItem(selectedKey,String(activeWeek));
      localStorage.setItem(activeTabKey,activeTab);
      window.dispatchEvent(new CustomEvent('meutreino:saved')); 
      return true;
    }catch(err){el('saveStatusText').textContent='Falha ao salvar. Exporte um backup.';toast('Armazenamento indisponível neste navegador.');return false;}
  }
  function renderWeekNav(){
    var html='';
    for(var index=0;index<8;index++){
      var number=index+1;
      var done=(data.weeks[index]&&data.weeks[index].training)||{};
      var sessions=['A','B','C','D'].filter(function(k){return done[k]&&done[k].complete;}).length;
      html+='<button type="button" class="week-button'+(number===activeWeek?' active':'')+(sessions===4?' complete':'')+'" data-week="'+number+'" aria-label="Semana '+number+(sessions===4?', concluída':'')+'" aria-pressed="'+(number===activeWeek)+'"><small>SEM</small><b>'+String(number).padStart(2,'0')+'</b><span class="wk-mark"></span></button>';
    }
    el('weekList').innerHTML=html;
    el('navCaption').textContent='Semana '+activeWeek+' de 8';
  }
  function renderAssessment(){
    el('measureDate').value=data.evaluation.date;
    var html='';
    groups.forEach(function(group){
      html+='<section class="form-group" aria-label="'+escapeHtml(group.name)+'"><h3 class="group-title"><span class="group-icon" aria-hidden="true">'+group.icon+'</span>'+escapeHtml(group.name)+'</h3><div class="fields">';
      group.items.forEach(function(item){
        var id=item[0],label=item[1],unit=item[2],val=data.evaluation.values[id]||'';
        html+='<div class="field"><label for="f_'+id+'">'+escapeHtml(label)+'</label><div class="entry"><input id="f_'+id+'" data-id="'+id+'" type="text" inputmode="decimal" autocomplete="off" placeholder="0,0" value="'+escapeHtml(val)+'" maxlength="7" aria-label="'+escapeHtml(label)+' em '+unit+'"><span class="unit">'+unit+'</span></div></div>';
      });
      html+='</div></section>';
    });
    el('measureFields').innerHTML=html;
    el('saveStatusText').textContent='Os dados são salvos automaticamente neste navegador.';
    updateProgress();
  }
  function measurement(id){
    var raw=data.evaluation.values[id];
    if(typeof raw!=='string'||!hasValue(raw))return null;
    var number=Number(raw.replace(',','.'));
    return Number.isFinite(number)&&number>0?number:null;
  }
  function resultNumber(id,helpId,value,decimals,missingHelp){
    if(value===null||!Number.isFinite(value)||value<=0){
      el(id).textContent='—';
      el(helpId).textContent=missingHelp;
      return;
    }
    el(id).textContent=value.toLocaleString('pt-BR',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
    el(helpId).textContent='';
  }
  function updateIndicators(){
    var weight=measurement('peso'),heightCm=measurement('altura');
    var waist=measurement('cintura'),hip=measurement('quadril');
    // Altura é informada em centímetros, e IMC requer metros.
    var bmi=weight!==null&&heightCm!==null?weight/Math.pow(heightCm/100,2):null;
    var waistHeight=waist!==null&&heightCm!==null?waist/heightCm:null;
    var waistHip=waist!==null&&hip!==null?waist/hip:null;
    resultNumber('indicatorBmi','indicatorBmiHelp',bmi,1,'Informe peso e altura.');
    resultNumber('indicatorWaistHeight','indicatorWaistHeightHelp',waistHeight,2,'Informe cintura e altura.');
    resultNumber('indicatorWaistHip','indicatorWaistHipHelp',waistHip,2,'Informe cintura e quadril.');
    el('indicatorBmiStatus').innerHTML=statusMarkup(classifyBmi(bmi));
    el('indicatorWaistHeightStatus').innerHTML=statusMarkup(classifyWaistHeight(waistHeight));
    el('indicatorWaistHipStatus').innerHTML=statusMarkup(waistHip===null?status('A medir','neutral'):status('Acompanhar','neutral'));
    renderBodyFigures(bmi);
  }

  function silhouetteSvg(category){
    // Ilustrações padronizadas: mesma pose, rosto, escala, tom e roupa. Não são retratos.
    var builds=[
      {chest:23,waist:17,hip:21,arm:10,leg:13},
      {chest:25,waist:20,hip:24,arm:11,leg:15},
      {chest:27,waist:26,hip:29,arm:13,leg:17},
      {chest:31,waist:34,hip:36,arm:16,leg:20},
      {chest:35,waist:42,hip:43,arm:19,leg:22}
    ];
    var p=builds[category],left=70-p.chest,right=70+p.chest;
    var torso='M 58 60 Q '+(left-8)+' 60 '+left+' 80 Q '+(70-p.waist)+' 113 '+(70-p.waist)+' 131 Q '+(70-p.hip)+' 145 '+(70-p.hip)+' 155 L '+(70+p.hip)+' 155 Q '+(70+p.hip)+' 145 '+(70+p.waist)+' 131 Q '+(70+p.waist)+' 113 '+right+' 80 Q '+(right+8)+' 60 82 60 Z';
    var shorts='M '+(70-p.hip)+' 140 Q 70 145 '+(70+p.hip)+' 140 L '+(70+p.hip-3)+' 169 L 73 169 L 70 157 L 67 169 L '+(70-p.hip+3)+' 169 Z';
    return '<svg viewBox="0 0 140 245" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustração padronizada de corpo adulto na faixa de IMC '+(category+1)+'">'
      +'<defs><linearGradient id="skin'+category+'" x1="0" x2="1"><stop offset="0" stop-color="#cf926b"/><stop offset=".45" stop-color="#efbb93"/><stop offset="1" stop-color="#e3a881"/></linearGradient></defs>'
      +'<ellipse cx="70" cy="239" rx="36" ry="3" fill="#dae5dc"/>'
      +'<path d="M '+(70-p.hip/2)+' 156 Q '+(62-p.leg/5)+' 197 56 229 M '+(70+p.hip/2)+' 156 Q '+(78+p.leg/5)+' 197 84 229" fill="none" stroke="#d9a17d" stroke-width="'+p.leg+'" stroke-linecap="round"/>'
      +'<path d="M '+(left+1)+' 74 Q 29 99 31 124 L 28 160 M '+(right-1)+' 74 Q 111 99 109 124 L 112 160" fill="none" stroke="#d9a17d" stroke-width="'+p.arm+'" stroke-linecap="round"/>'
      +'<path d="'+torso+'" fill="url(#skin'+category+')" stroke="#c68f70" stroke-width=".7"/>'
      +'<path d="M 70 63 L 70 142 M '+(70-p.chest/2)+' 91 Q 59 99 69 99 M '+(70+p.chest/2)+' 91 Q 81 99 71 99" stroke="#b67a5d" stroke-width=".8" fill="none" opacity=".2"/>'
      +'<circle cx="70" cy="129" r="1.6" fill="#ba8868" opacity=".65"/>'
      +'<rect x="64" y="45" width="12" height="21" rx="5" fill="#e6ad86"/>'
      +'<ellipse cx="70" cy="32" rx="17" ry="21" fill="#e6b28d" stroke="#c18b6d" stroke-width=".7"/>'
      +'<path d="M 53 30 Q 51 11 65 11 Q 83 6 87 22 L 86 29 Q 78 19 70 22 Q 59 23 53 30" fill="#403831"/>'
      +'<path d="M 60 35 L 64 35 M 76 35 L 80 35 M 67 45 Q 70 47 73 45" stroke="#795542" stroke-width="1.15" stroke-linecap="round" fill="none"/>'
      +'<path d="'+shorts+'" fill="#344a50" stroke="#273940" stroke-width=".6"/>'
      +'<path d="M 70 144 L 70 158" stroke="#617276" stroke-width="1" opacity=".6"/>'
      +'<path d="M 53 230 Q 46 230 43 236 L 58 237 M 87 230 Q 94 230 97 236 L 82 237" fill="none" stroke="#d9a17d" stroke-width="'+Math.max(5,p.leg/2)+'" stroke-linecap="round"/>'
      +'</svg>';
  }
  function renderBodyFigures(bmi){
    var profiles=[
      {label:'Abaixo do peso',range:'IMC menor que 18,5'},
      {label:'Faixa de referência',range:'IMC de 18,5 a 24,9'},
      {label:'Sobrepeso',range:'IMC de 25 a 29,9'},
      {label:'Obesidade grau I',range:'IMC de 30 a 34,9'},
      {label:'Obesidade grau II/III',range:'IMC a partir de 35'}
    ];
    var selected=bmi===null||!Number.isFinite(bmi)||bmi<=0?-1:bmi<18.5?0:bmi<25?1:bmi<30?2:bmi<35?3:4;
    el('bodiesGrid').innerHTML=profiles.map(function(profile,index){
      var chosen=index===selected;
      return '<article class="body-figure-card'+(chosen?' is-active':'')+'"'+(chosen?' aria-current="true"':'')+'>'
        +silhouetteSvg(index)
        +'<strong>'+escapeHtml(profile.label)+'</strong>'
        +'<small>'+escapeHtml(profile.range)+'</small>'
        +'<span class="body-current">Faixa calculada ✓</span></article>';
    }).join('');
    el('bodiesResult').textContent=selected<0
      ?'Informe peso e altura na avaliação inicial para identificar a faixa do IMC.'
      :'IMC '+ptNumber(bmi,1)+' · '+profiles[selected].label;
  }
  function status(label,tone){return {label:label,tone:tone};}
  function classifyBmi(value){
    if(value===null||!Number.isFinite(value)||value<=0)return status('A calcular','neutral');
    if(value<18.5)return status('Atenção · baixo peso','attention');
    if(value<25)return status('Normal','normal');
    if(value<30)return status('Atenção · sobrepeso','attention');
    return status('Atenção · obesidade','alert');
  }
  function classifyWaistHeight(value){
    if(value===null||!Number.isFinite(value)||value<=0)return status('A calcular','neutral');
    if(value<0.4)return status('Abaixo da faixa','neutral');
    if(value<0.5)return status('Bom','good');
    if(value<0.6)return status('Atenção','attention');
    return status('Alerta','alert');
  }
  function statusMarkup(item){return '<span class="status-badge '+escapeHtml(item.tone)+'">'+escapeHtml(item.label)+'</span>';}
  function ptNumber(value,decimals){return value.toLocaleString('pt-BR',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});}
  function updateComparison(){
    var height=measurement('altura'),weight=measurement('peso');
    var waist=measurement('cintura'),hip=measurement('quadril');
    var refs={
      idade:'Sem meta',
      peso:'Meta individual',
      altura:'Sem meta',
      cintura:height!==null?'Abaixo de '+ptNumber(height/2,1)+' cm':'Abaixo de metade da altura',
      abdomen:'Comparar evolução',
      quadril:'Comparar evolução',
      busto:'Comparar evolução',
      torax:'Comparar evolução',
      bracoRelaxado:'Comparar evolução',
      bracoIsometria:'Comparar evolução',
      coxa:'Comparar evolução',
      panturrilha:'Comparar evolução'
    };
    var rows=groups.flatMap(function(group){return group.items;}).map(function(item){
      var value=measurement(item[0]);
      var state=value===null?status('A medir','neutral'):item[0]==='cintura'&&height!==null?classifyWaistHeight(value/height):status('Acompanhar','neutral');
      return {name:item[1],current:value===null?'A medir':ptNumber(value,item[0]==='idade'?0:1)+' '+item[2],reference:refs[item[0]]||'Avaliar individualmente',state:state};
    });
    rows=rows.concat([
      {name:'IMC',current:weight!==null&&height!==null?ptNumber(weight/Math.pow(height/100,2),1)+' kg/m²':'A calcular',reference:'18,5 a 24,9 kg/m²',state:classifyBmi(weight!==null&&height!==null?weight/Math.pow(height/100,2):null)},
      {name:'Cintura / altura',current:waist!==null&&height!==null?ptNumber(waist/height,2):'A calcular',reference:'Preferível abaixo de 0,50',state:classifyWaistHeight(waist!==null&&height!==null?waist/height:null)},
      {name:'Cintura / quadril',current:waist!==null&&hip!==null?ptNumber(waist/hip,2):'A calcular',reference:'Meta individual',state:status(waist!==null&&hip!==null?'Acompanhar':'A calcular','neutral')}
    ]);
    el('comparisonRows').innerHTML=rows.map(function(row,index){
      var missing=row.current==='A medir'||row.current==='A calcular';
      return '<tr'+(index>=allIds.length?' class="calculated-row"':'')+'><th scope="row">'+escapeHtml(row.name)+'</th><td class="compare-current'+(missing?' not-measured':'')+'">'+escapeHtml(row.current)+'</td><td class="status-cell">'+statusMarkup(row.state)+'</td><td>'+escapeHtml(row.reference)+'</td></tr>';
    }).join('');
    el('comparisonDate').textContent=data.evaluation.date?'Avaliação inicial · '+data.evaluation.date.split('-').reverse().join('/'):'Avaliação inicial · sem data';
  }
  function updateProgress(){
    var filled=countFields(data.evaluation);
    el('filledLabel').textContent=filled+' de '+allIds.length+' campos preenchidos';
    el('filledCircle').textContent=filled+'/'+allIds.length;
    el('weeksCompleted').textContent=String(filled);
    el('overallBar').style.width=(filled/allIds.length*100)+'%';
    el('overallProgress').setAttribute('aria-valuenow',String(filled));
    updateIndicators();
    updateComparison();
  }
  function selectWeek(number){
    if(!Number.isInteger(number)||number<1||number>8)return;
    activeWeek=number;
    renderWeekNav();persist();
    if(window.MeuTreinoTreinos)window.MeuTreinoTreinos.render();
  }
  function selectTab(name,save){
    activeTab=name==='training'?'training':'evaluation';
    var training=activeTab==='training';
    el('evaluationTab').hidden=training;
    el('trainingTab').hidden=!training;
    el('tabEvaluation').classList.toggle('active',!training);
    el('tabTraining').classList.toggle('active',training);
    el('tabEvaluation').setAttribute('aria-selected',String(!training));
    el('tabTraining').setAttribute('aria-selected',String(training));
    el('tabEvaluation').tabIndex=training?-1:0;
    el('tabTraining').tabIndex=training?0:-1;
    el('pageTitle').textContent=training?'Seu treino. Seu ritmo.':'Seu ponto de partida.';
    el('pageLead').textContent=training?'Abra o exercício, veja o movimento e registre sua evolução.':'Uma avaliação inicial. Oito semanas de evolução.';
    document.querySelectorAll('video.loop-video').forEach(function(v){if(!training)v.pause();});
    window.dispatchEvent(new CustomEvent('meutreino:tab',{detail:activeTab}));
    if(save!==false)persist();
    if(training&&window.MeuTreinoTreinos)window.MeuTreinoTreinos.render();
  }

  el('tabEvaluation').addEventListener('click',function(){selectTab('evaluation');});
  el('tabTraining').addEventListener('click',function(){selectTab('training');});
  document.querySelector('[role=tablist]').addEventListener('keydown',function(e){if(['ArrowLeft','ArrowRight','Home','End'].indexOf(e.key)===-1)return;e.preventDefault();var t=e.key==='Home'?'evaluation':e.key==='End'?'training':activeTab==='training'?'evaluation':'training';selectTab(t);el(t==='training'?'tabTraining':'tabEvaluation').focus();});
  el('weekList').addEventListener('click',function(event){
    var button=event.target.closest('[data-week]');
    if(button)selectWeek(Number(button.dataset.week));
  });
  el('measureFields').addEventListener('input',function(event){
    var input=event.target.closest('[data-id]');if(!input)return;
    var value=input.value.trim().replace(/\s+/g,'');
    if(!isValidEntry(value)){input.value=data.evaluation.values[input.dataset.id]||'';return;}
    data.evaluation.values[input.dataset.id]=value;
    if(persist())el('saveStatusText').textContent='Alterações salvas automaticamente.';
    updateProgress();
  });
  el('measureDate').addEventListener('change',function(event){
    data.evaluation.date=event.target.value;
    if(persist())el('saveStatusText').textContent='Data salva automaticamente.';
    updateComparison();
  });
  el('measureForm').addEventListener('submit',function(event){
    event.preventDefault();
    if(persist()){el('saveStatusText').textContent='Medidas salvas com sucesso.';toast('Avaliação inicial salva!');}
  });
  el('nextWeek').addEventListener('click',function(){selectTab('training');});
  el('clearWeek').addEventListener('click',function(){
    if(countFields(data.evaluation)===0&&!data.evaluation.date){toast('A avaliação inicial já está vazia.');return;}
    if(!confirm('Limpar todas as medidas e a data da avaliação inicial? Esta ação não pode ser desfeita.'))return;
    data.evaluation=emptyAssessment();persist();renderAssessment();toast('Avaliação inicial limpa.');
  });
  window.MeuTreinoBridge={getData:function(){return data;},getWeek:function(){return activeWeek;},save:persist,toast:toast,refreshWeeks:renderWeekNav,
    exportData:function(){return JSON.parse(JSON.stringify(data));},
    restore:function(raw){var next=normalizeData(raw),previous=data;data=next;if(!persist()){data=previous;throw new Error('Falha ao salvar backup');}renderAssessment();renderWeekNav();if(window.MeuTreinoTreinos)window.MeuTreinoTreinos.render();},
    selectTab:selectTab};
  renderAssessment();selectWeek(activeWeek);selectTab(activeTab,false);
  if(migrated)persist();
  if(loadError)setTimeout(function(){toast('Não foi possível carregar os dados anteriores.');},350);
})();
