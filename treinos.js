(function(){
  'use strict';
  var bridge=window.MeuTreinoBridge;
  var mount=document.getElementById('trainingMount');
  if(!bridge||!mount)return;
  var dayChoice='A';
  try{var remembered=localStorage.getItem('meu-treino-sessao-v2');if(/^[ABCD]$/.test(remembered))dayChoice=remembered;}catch(e){}
  var plans={
    A:{
      title:'Peito + costas + braços',
      subtitle:'Força e hipertrofia com exercícios de empurrar e puxar.',
      duration:'60–70 min',interval:'Segunda-feira',recover:'72 h até o próximo superior',
      mobility:[
        {id:'mA1',name:'Aquecimento dos ombros com elástico',dose:'1 × 8 movimentos suaves',kind:'mobility',steps:['Segure o elástico com as mãos mais afastadas que os ombros.','Eleve lentamente os braços à frente e acima da cabeça, sem dor.','Se houver mobilidade confortável, leve a faixa para trás da cabeça; depois retorne. Nunca force a amplitude.']},
        {id:'mA2',name:'Rotação torácica sentado',dose:'1 × 8 por lado',kind:'rotate',steps:['Sente-se com os pés apoiados e cruze os braços no peito.','Gire suavemente a parte superior do tronco, mantendo a pelve estável.','Retorne ao centro e alterne os lados sem forçar a lombar.']},
        {id:'mA3',name:'Deslizamento dos braços na parede',dose:'1 × 8–10',kind:'raise',steps:['Fique de frente para uma parede com antebraços apoiados.','Deslize-os para cima até onde os ombros permitirem confortavelmente.','Desça devagar, evitando arquear a lombar.']}
      ],
      exercises:[
        {id:'a1',name:'Chest press reto na máquina (deitado)',dose:'3 × 8–12',rest:'90–120 s',muscle:'Peito · tríceps · deltoide anterior',kind:'press',hotel:'Supino reto com halteres em banco estável, se disponível.',steps:['Deite-se no banco da máquina com pés firmes no apoio ou no chão e segure as alças à altura do peito.','Empurre as alças para cima e à frente, sem travar os cotovelos.','Retorne devagar à posição inicial sem tirar as costas do apoio.'],cue:'Use a máquina de supino reto deitado mostrada no vídeo. Se a academia tiver apenas chest press sentado, ajuste a prescrição e a demonstração; não use o vídeo como modelo de máquina diferente.'},
        {id:'a2',name:'Remada com apoio peitoral',dose:'3 × 8–12',rest:'90–120 s',muscle:'Costas · bíceps',kind:'row',hotel:'Remada unilateral com halter e mão apoiada no banco.',steps:['Ajuste o apoio de peito e mantenha a coluna estável.','Puxe os cotovelos para trás sem levantar o tronco.','Retorne até estender os braços de modo confortável.'],cue:'Alterne com o chest press somente se a técnica não piorar.'},
        {id:'a3',name:'Supino inclinado na máquina',dose:'2 × 10–12',rest:'75–90 s',muscle:'Peito superior · tríceps',kind:'press',hotel:'Supino inclinado com halteres, com banco estável.',steps:['Ajuste o banco e mantenha as costas apoiadas.','Empurre as alças para cima e à frente em trajetória confortável.','Volte devagar, sem forçar os ombros.']},
        {id:'a4',name:'Puxada frontal na polia',dose:'3 × 10–12',rest:'75–90 s',muscle:'Dorsais · bíceps',kind:'pull',hotel:'Polia alta do hotel, se disponível; caso contrário, registrar não realizado.',steps:['Segure a barra com pegada confortável e peito aberto.','Puxe a barra em direção à parte superior do peito.','Retorne devagar, sem jogar o tronco para trás.'],cue:'Não puxar atrás da nuca.'},
        {id:'a5',name:'Elevação lateral sentada',dose:'2 × 12–15',rest:'60 s',muscle:'Deltoide lateral',kind:'raise',hotel:'Halteres leves, sentado.',steps:['Sente-se com tronco apoiado e braços ao lado do corpo.','Eleve os braços para os lados até uma amplitude confortável.','Desça devagar, sem balançar.']},
        {id:'a6',name:'Tríceps na polia com corda',dose:'2 × 10–15',rest:'60 s',muscle:'Tríceps',kind:'press',hotel:'Extensão de tríceps com halter leve apoiado, se houver segurança.',steps:['Mantenha os cotovelos próximos ao tronco.','Estenda os cotovelos para empurrar a corda para baixo.','Retorne controladamente sem abrir os cotovelos.']},
        {id:'a7',name:'Rosca bíceps sentada',dose:'2 × 10–15',rest:'60 s',muscle:'Bíceps',kind:'curl',hotel:'Rosca sentada com halteres.',steps:['Sente-se com a coluna apoiada e braços ao lado do corpo.','Flexione os cotovelos sem impulsionar com o tronco.','Desça lentamente, mantendo os punhos neutros.']}
      ],
      cardio:{name:'Bicicleta ergométrica',dose:'5–8 min · leve',suggestion:'Ajuste o selim e pedale com resistência leve, somente se os joelhos tolerarem. Pare se houver dor crescente.',kind:'cardio'}
    },
    B:{
      title:'Inferiores + cardio',
      subtitle:'Quadríceps, posteriores, glúteos e panturrilhas com controle da dor.',
      duration:'55–70 min',interval:'Terça-feira',recover:'Até sábado para o próximo treino inferior',
      mobility:[
        {id:'mB1',name:'Flexão e extensão dos tornozelos sentado',dose:'1 × 12–15 por lado',kind:'ankle',steps:['Sente-se com as pernas em posição confortável.','Aponte os dedos dos pés para a frente e depois leve-os para cima.','Repita sem forçar os joelhos.']},
        {id:'mB4',name:'Alongamento de panturrilha sentado',dose:'1 × 20–30 s por lado',kind:'ankle',steps:['Sente-se e estenda uma perna até onde for confortável, apoiando o calcanhar.','Traga a ponta do pé suavemente na direção do corpo até sentir alongar a panturrilha.','Mantenha sem movimentos bruscos e troque de lado, sem dor no joelho.']},
        {id:'mB5',name:'Alongamento de posterior de coxa',dose:'1 × 20–30 s por lado',kind:'hip',steps:['Em pé, apoie as mãos numa superfície firme para equilíbrio.','Deixe uma perna à frente com o calcanhar apoiado e incline levemente o quadril para trás.','Mantenha as costas alinhadas e a amplitude confortável; troque de lado.']}
      ],
      exercises:[
        {id:'b1',name:'Abdução de quadril na máquina',dose:'2 × 12–15',rest:'60–90 s',muscle:'Glúteo médio · estabilizadores do quadril',kind:'hip',hotel:'Abdução sentada com miniband, somente se houver e for confortável.',steps:['Ajuste o banco e apoie as costas sem forçar os joelhos.','Afaste as pernas lentamente em amplitude indolor.','Retorne devagar, sem deixar o peso bater.'],cue:'Não utilizar a máquina se a posição sentada ou o apoio nos joelhos causar dor.',caution:true},
        {id:'b7',name:'Quadríceps isométrico no leg press',dose:'3 × 8 · sustentar 3–5 s',rest:'75–90 s',muscle:'Quadríceps · isometria no leg press',kind:'isometric',hotel:'Somente realizar se houver leg press adequado e avaliação da amplitude.',steps:['Ajuste o banco e posicione os pés no centro da plataforma, em largura confortável.','Em uma posição com flexão leve e confortável dos joelhos, faça pressão suave na plataforma sem deslocá-la.','Sustente por 3–5 segundos, relaxe e repita; nunca trave ou force a extensão do joelho.'],cue:'Isometria, não leg press dinâmico. Iniciar com resistência mínima somente após avaliação da tolerância à carga.',caution:true},
        {id:'b8',name:'Mesa flexora',dose:'2 × 12',rest:'75–90 s',muscle:'Posteriores de coxa',kind:'knee',hotel:'Executar apenas se houver mesa flexora com regulagem adequada e sem dor.',steps:['Deite-se de barriga para baixo na mesa flexora e alinhe os joelhos com o eixo da máquina.','Flexione os joelhos lentamente, aproximando o apoio dos tornozelos dos glúteos na amplitude confortável.','Retorne sem soltar o peso ou forçar a extensão final do joelho.'],cue:'Carga mínima e amplitude adaptada se não houver dor ou bloqueio. Não realizar até avaliação se houver limitação importante da flexão.',caution:true},
        {id:'b9',name:'Glúteos isométricos unilaterais',dose:'3 × 10 por lado · sustentar 3–5 s',rest:'45–60 s',muscle:'Glúteo máximo · isometria unilateral',kind:'isometric',hotel:'Contração unilateral sentada em cadeira firme.',steps:['Sente-se com os dois pés apoiados e a coluna confortável.','Contraia um glúteo de cada vez, sem deslocar o tronco nem forçar os joelhos.','Segure 3–5 segundos, solte e repita 10 vezes antes de trocar de lado.'],cue:'Sem elevar ou torcer a pelve. Respire normalmente. Volume por lado.',caution:true},
        {id:'b10',name:'Extensão de joelho com caneleira + isometria',dose:'2 × 8 (provisório) + segurar 3–5 s',rest:'60–90 s',muscle:'Quadríceps · extensão terminal',kind:'knee',hotel:'Somente se houver apoio estável e liberação para caneleira.',steps:['Sentado, apoie a parte posterior distal da coxa com suporte protegido por toalha; não pressione o oco atrás do joelho.','Com caneleira muito leve ou sem carga, estenda suavemente o joelho apenas até a amplitude indolor e retorne.','Após as repetições, mantenha uma contração isométrica suave por 3–5 segundos e relaxe.'],cue:'O halter sob a parte posterior deve servir apenas como apoio protegido e estável, nunca comprimir a dobra do joelho. Confirmar montagem presencial. 2×8 é provisório porque o volume não foi informado.',caution:true},
        {id:'b11',name:'Panturrilha sentado',dose:'3 × 10',rest:'60 s',muscle:'Panturrilhas · sóleo',kind:'ankle',hotel:'Elevação de calcanhar sentado com os pés apoiados e sem carga.',steps:['Sente-se com os joelhos numa posição confortável e a planta dos pés apoiada.','Eleve suavemente os calcanhares mantendo a ponta dos pés em contato com o chão.','Desça devagar sem provocar dor no joelho.'],cue:'Comece com carga mínima ou sem carga; ajuste se houver desconforto articular.',caution:true}
      ],
      cardio:{name:'Bicicleta ergométrica',dose:'8–12 min · leve',suggestion:'Selim ajustado e baixa resistência. Pedalar apenas se não aumentar a dor nos joelhos ou provocar travamento.',kind:'cardio'}
    },
    C:{
      title:'Costas + peito + braços',
      subtitle:'Segundo estímulo para peito e costas.',
      duration:'60–70 min',interval:'Quinta-feira',recover:'~72 h depois do treino A',
      mobility:[
        {id:'mC1',name:'Rotação torácica sentado',dose:'1 × 8 por lado',kind:'rotate',steps:['Sente-se e cruze os braços em frente ao peito.','Gire o tronco lentamente para um lado sem deslocar o quadril.','Retorne ao centro e repita para o outro lado.']},
        {id:'mC2',name:'Wall slides (braços na parede)',dose:'1 × 8–10',kind:'raise',steps:['Apoie os antebraços em uma parede.','Deslize para cima até uma amplitude livre de dor.','Retorne lentamente sem compensar na lombar.']},
        {id:'mC3',name:'Mobilidade escapular sentado',dose:'1 × 8–10',kind:'row',steps:['Sente-se ereto com os pés apoiados.','Eleve os braços de forma confortável, sem forçar os ombros.','Abaixe suavemente os ombros, aproxime as escápulas e relaxe.']}
      ],
      exercises:[
        {id:'c1',name:'Supino inclinado na máquina',dose:'3 × 8–12',rest:'90–120 s',muscle:'Peito · tríceps',kind:'press',hotel:'Supino inclinado com halteres e banco estável.',steps:['Ajuste o encosto para apoiar completamente as costas.','Empurre as alças na direção indicada pela máquina.','Retorne com controle sem descer além do conforto.']},
        {id:'c2',name:'Remada sentada com apoio',dose:'3 × 8–12',rest:'90–120 s',muscle:'Costas · bíceps',kind:'row',hotel:'Remada apoiada unilateral com halter.',steps:['Sente-se com peito apoiado ou tronco estabilizado.','Puxe as alças sem inclinar o corpo para trás.','Estenda os braços devagar e repita.']},
        {id:'c3',name:'Crucifixo no peck deck',dose:'2 × 12–15',rest:'60–90 s',muscle:'Peitoral',kind:'fly',hotel:'Crucifixo com halteres leves e amplitude curta, se orientado.',steps:['Ajuste o banco na altura adequada dos ombros.','Aproxime as alças à frente do peito em movimento controlado.','Abra os braços até uma amplitude confortável.']},
        {id:'c4',name:'Puxada alta na polia',dose:'2 × 10–12',rest:'75–90 s',muscle:'Dorsais · bíceps',kind:'pull',hotel:'Polia alta, se disponível.',steps:['Segure a barra com pegada confortável.','Puxe para a parte superior do peito, sem inclinar excessivamente o tronco.','Devolva a barra de forma lenta.']},
        {id:'c5',name:'Remada para deltoide posterior na polia',dose:'2 × 12–15',rest:'60 s',muscle:'Deltoide posterior · escápulas',kind:'row',hotel:'Remada para deltoide posterior com elástico, se tiver bom controle.',steps:['Posicione a corda na polia alta, como na demonstração, e afaste-se até criar uma leve tensão.','Mantenha as costas alinhadas e puxe a corda em direção ao peito alto, abrindo os cotovelos.','Retorne lentamente, sem arredondar as costas.']},
        {id:'c6',name:'Rosca bíceps unilateral na polia',dose:'2 × 10–15 por braço',rest:'60 s',muscle:'Bíceps',kind:'curl',hotel:'Rosca unilateral com halter, se a polia não estiver disponível.',steps:['Ajuste a polia baixa e fique em pé de frente para ela, segurando um pegador com a palma voltada para cima.','Mantenha o cotovelo próximo ao tronco e flexione lentamente em direção ao ombro.','Retorne com controle, complete as séries e repita no outro braço.']},
        {id:'c7',name:'Tríceps na polia com corda',dose:'2 × 10–15',rest:'60 s',muscle:'Tríceps',kind:'press',hotel:'Extensão de tríceps com halter leve e apoio adequado.',steps:['Mantenha os cotovelos ao lado do tronco.','Estenda os cotovelos para abaixar a corda.','Retorne lentamente sem movimentar os ombros.']}
      ],
      cardio:{name:'Bicicleta ergométrica',dose:'5–8 min · leve',suggestion:'Selim ajustado e pedalada suave. Use apenas se não agravar o joelho.',kind:'cardio'}
    },
    D:{
      title:'Quadril + mobilidade + cardio',
      subtitle:'Mobilidade, pernas adaptadas e cardio leve.',
      duration:'45–60 min',interval:'Sábado',recover:'~96 h depois do treino B',
      mobility:[
        {id:'mD1',name:'Círculos de tornozelo sentado',dose:'1 × 10 por sentido e lado',kind:'ankle',steps:['Sente-se e mantenha a perna relaxada.','Desenhe círculos pequenos com o pé, sem girar o joelho.','Inverta a direção e repita do outro lado.']},
        {id:'mD2',name:'Rotação do tronco sentado',dose:'1 × 8 por lado',kind:'rotate',steps:['Com os pés apoiados, cruze os braços sobre o peito.','Gire a parte superior do tronco suavemente.','Volte ao centro e alterne.']},
        {id:'mD3',name:'Aquecimento dos ombros com elástico',dose:'1 × 8 movimentos suaves',kind:'mobility',steps:['Segure o elástico com as mãos mais afastadas que os ombros.','Leve os braços lentamente para cima dentro da amplitude confortável.','Se for confortável, passe a faixa por trás da cabeça e retorne devagar, sem forçar os ombros.']}
      ],
      exercises:[
        {id:'d1',name:'Abdução de quadril na máquina, leve',dose:'2 × 12–15',rest:'60–90 s',muscle:'Glúteo médio',kind:'hip',hotel:'Abdução sentada com miniband se houver e sem dor.',steps:['Ajuste o banco e não force a flexão dos joelhos.','Afaste as pernas lentamente em pequena amplitude confortável.','Retorne com controle.'],caution:true},
        {id:'d2',name:'Extensão de quadril na máquina, leve',dose:'2 × 10 por lado',rest:'60 s',muscle:'Glúteo máximo',kind:'hip',hotel:'Extensão de quadril sem resistência com apoio firme, apenas se indolor.',steps:['Ajuste a máquina de extensão de quadril e segure os apoios, mantendo o tronco alinhado.','Empurre a alavanca suavemente para trás usando o quadril, sem arquear a lombar e sem forçar o joelho de apoio.','Retorne lentamente e alterne o lado; interrompa se houver dor no joelho.'],cue:'Comece sem carga ou com carga mínima; não executar se a posição exigir flexão dolorosa do joelho.',caution:true},
        {id:'d3',name:'Panturrilha sentado, leve',dose:'2 × 12–15',rest:'60 s',muscle:'Panturrilhas',kind:'ankle',hotel:'Elevação de calcanhares sentado sem carga.',steps:['Sente-se, pés apoiados no chão.','Eleve os calcanhares mantendo as pontas dos pés no chão.','Desça devagar em amplitude indolor.'],caution:true},
        {id:'d4',name:'Contração isométrica de glúteos',dose:'2 × 10 · sustentar 4 s',rest:'45–60 s',muscle:'Glúteos',kind:'isometric',hotel:'Mesmo exercício sentado.',steps:['Sente-se em posição confortável.','Contraia levemente os glúteos, sem prender a respiração.','Relaxe e repita.']},
        {id:'d5',name:'Mobilização ativa confortável do joelho',dose:'1–2 × 6–8 por lado',rest:'45–60 s',muscle:'Controle de movimento articular',kind:'knee',hotel:'Mesmo movimento em cadeira estável, sem resistência.',steps:['Sente-se com a coxa apoiada e a perna em posição confortável.','Dobre e estique suavemente apenas até onde não houver dor.','Retorne sem forçar; pare se houver bloqueio ou estalo doloroso.'],cue:'Pode ser omitida até avaliação, sobretudo se a extensão ou a flexão estiver bloqueada.',caution:true}
      ],
      optional:[
        {name:'Leg press ou sentar-levantar de banco alto',note:'Incluir apenas após avaliação da condição articular, com amplitude e carga individualizadas.'},
        {name:'Ponte de glúteos',note:'Considerar somente após esclarecer a cirurgia abdominal, verificar posicionamento confortável dos joelhos e confirmar que não há restrições.'}
      ],
      cardio:{name:'Bicicleta ergométrica',dose:'10–15 min · leve',suggestion:'Bicicleta confortável com selim ajustado. Progrida tempo antes da carga, sem dor crescente.',kind:'cardio'}
    }
  };
  var progression=[
    {range:'Semanas 1–2',text:'Aprender a execução e usar cargas leves.'},
    {range:'Semanas 3–4',text:'Progredir repetições se estiver confortável.'},
    {range:'Semanas 5–6',text:'Progredir cargas aos poucos, com boa técnica.'},
    {range:'Semanas 7–8',text:'Reavaliar evolução, dor, cargas e cardio.'}
  ];
  function escapeHtml(value){
    return String(value===null||value===undefined?'':value).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function safeRecord(){
    var data=bridge.getData(),week=bridge.getWeek();
    if(!data.weeks[week-1]||typeof data.weeks[week-1]!=='object')data.weeks[week-1]={};
    var weekData=data.weeks[week-1];
    if(!weekData.training||typeof weekData.training!=='object'||Array.isArray(weekData.training))weekData.training={};
    if(!weekData.training[dayChoice]||typeof weekData.training[dayChoice]!=='object')weekData.training[dayChoice]={};
    var row=weekData.training[dayChoice];
    // Mudança na ficha B: não marcar exercícios novos usando registros do plano antigo.
    if(dayChoice==='B'&&row.planVersion!=='B-20261024-v2'){
      if(row.complete===true)row.oldPlanCompletedAt=row.completedAt||'';
      row.complete=false;row.completedAt='';row.planVersion='B-20261024-v2';
    }
    if(!row.exercises||typeof row.exercises!=='object')row.exercises={};
    return row;
  }
  function getDayRecord(day){
    var data=bridge.getData(),week=bridge.getWeek();
    var w=data.weeks[week-1]||{};
    return w.training&&w.training[day]||{};
  }
  function teachingVideo(id){
    var cfg=window.MeuTreinoVideos||{};
    var clip=cfg.clips&&cfg.clips[id];
    if(clip&&clip.status==='pending'){
      return '<div class="video-pending" role="note"><span class="pending-icon" aria-hidden="true">▷</span><div><strong>Vídeo anatômico específico pendente</strong><p>Consulte o passo a passo abaixo para este movimento adaptado.</p></div></div>';
    }
    if(!clip||!/^\.\/assets\/videos\/[a-z0-9-]+\.mp4$/.test(clip.url)){
      return '<p class="video-unavailable">Demonstração indisponível.</p>';
    }
    return '<figure class="teaching-video" data-video-exercise="'+escapeHtml(id)+'">'
      +'<div class="video-stage"><video class="loop-video" muted loop playsinline preload="none" poster="'+escapeHtml(clip.poster)+'" data-src="'+escapeHtml(clip.url)+'" aria-label="Demonstração anatômica do exercício"></video>'
      +'<button type="button" class="video-retry" data-video-retry hidden>Reproduzir demonstração</button>'
      +'<span class="video-error" hidden>Não foi possível carregar. Confira as instruções abaixo.</span></div>'
      +'<figcaption><span><span class="live-dot"></span> Demonstração em loop</span><button type="button" data-video-toggle aria-label="Pausar demonstração">Pausar <span aria-hidden="true">Ⅱ</span></button></figcaption>'
      +'</figure>';
  }
  function autoLoopIn(details){
    if(!details||typeof details.querySelectorAll!=='function')return;
    var videos=details.querySelectorAll('video.loop-video');
    for(var i=0;i<videos.length;i++){
      var player=videos[i];
      if(details.open&&!document.getElementById('trainingTab').hidden){
        if(!player.getAttribute('src')){
          player.setAttribute('src',player.getAttribute('data-src'));
          player.load();
        }
        player.muted=true;
        player.defaultMuted=true;
        var box=player.getBoundingClientRect();
        if(box.bottom>0&&box.top<window.innerHeight&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&player.dataset.userPaused!=='true'){
          var playing=player.play();
          if(playing&&typeof playing.catch==='function')playing.catch(function(){var retry=player.closest('figure').querySelector('[data-video-retry]');if(retry)retry.hidden=false;});
        }
      }else if(typeof player.pause==='function'){
        player.pause();
      }
    }
  }
  function stepsList(steps){return '<ol>'+steps.map(function(s){return '<li>'+escapeHtml(s)+'</li>';}).join('')+'</ol>';}
  function guideSteps(items){
    return '<div class="train-step-row">'+items.map(function(m,index){
      return '<details class="train-step"><summary><span class="train-step-index">'+(index+1)+'</span>'
        +'<span class="train-step-content"><strong>'+escapeHtml(m.name)+'</strong><small>'+escapeHtml(m.dose)+'</small></span></summary>'
        +'<div class="train-step-body">'+teachingVideo(m.id)+stepsList(m.steps)+'</div></details>';
    }).join('')+'</div>';
  }

  function setCount(exercise){
    var dose=String(exercise.dose||'');
    var found=dose.match(/^\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*[×xX]/);
    return found?Math.min(10,Number(found[2]||found[1])):1;
  }
  function exerciseIsComplete(exercise,entry){
    if(!entry||typeof entry!=='object')return false;
    if(Array.isArray(entry.series)){
      var count=setCount(exercise);
      return entry.series.length>=count&&Array.from({length:count},function(_,i){return entry.series[i]&&entry.series[i].done===true;}).every(Boolean);
    }
    return entry.done===true;
  }
  function completedSets(exercise,entry){
    if(!entry||!Array.isArray(entry.series))return 0;
    return Array.from({length:setCount(exercise)},function(_,i){return entry.series[i]&&entry.series[i].done===true;}).filter(Boolean).length;
  }
  function previousSeries(id){
    var weeks=bridge.getData().weeks||[];
    for(var number=bridge.getWeek()-2;number>=0;number--){
      var data=weeks[number]&&weeks[number].training&&weeks[number].training[dayChoice];
      var value=data&&data.exercises&&data.exercises[id];
      if(value&&Array.isArray(value.series)&&value.series.some(function(s){return s&&(s.load||s.reps||s.done);})){
        return {week:number+1,series:value.series};
      }
    }
    return null;
  }
  function seriesProgressNote(id){
    var earlier=previousSeries(id);
    if(!earlier)return '';
    var entries=earlier.series.map(function(s,i){
      if(!s||(s.load===undefined||s.load==='')&&(s.reps===undefined||s.reps===''))return '';
      var parts=[];
      if(s.load!==undefined&&s.load!=='')parts.push(String(s.load).replace('.',',')+' kg');
      if(s.reps!==undefined&&s.reps!=='')parts.push(s.reps+' rep.');
      return 'S'+(i+1)+' '+parts.join(' · ');
    }).filter(Boolean);
    return entries.length?'<p class="series-history">Semana '+earlier.week+': '+escapeHtml(entries.join('  |  '))+'</p>':'';
  }
  function seriesRows(exercise,entry){
    var count=setCount(exercise),existing=Array.isArray(entry.series)?entry.series:[];
    var rows=Array.from({length:count},function(_,i){
      var record=existing[i]&&typeof existing[i]==='object'?existing[i]:{};
      var number=i+1;
      return '<div class="series-row" data-series-row="'+number+'">'
        +'<strong class="series-number">Série '+number+'</strong>'
        +'<label class="series-input"><span>Carga (kg)</span><input type="text" inputmode="decimal" autocomplete="off" maxlength="8" id="load-'+exercise.id+'-'+number+'" data-exercise="'+exercise.id+'" data-series="'+i+'" data-exfield="load" aria-label="Carga em quilos da série '+number+'" placeholder="kg" value="'+escapeHtml(record.load===undefined?'':record.load)+'"></label>'
        +'<label class="series-input"><span>Repetições</span><input type="number" inputmode="numeric" min="0" max="200" step="1" id="reps-'+exercise.id+'-'+number+'" data-exercise="'+exercise.id+'" data-series="'+i+'" data-exfield="reps" aria-label="Repetições da série '+number+'" placeholder="reps" value="'+escapeHtml(record.reps===undefined?'':record.reps)+'"></label>'
        +'<label class="series-done"><input type="checkbox" data-exercise="'+exercise.id+'" data-series="'+i+'" data-exfield="done" aria-label="Série '+number+' concluída" '+(record.done?'checked':'')+'><span>Feita</span></label>'
        +'</div>';
    }).join('');
    var old=(entry.load||entry.reps)&&!Array.isArray(entry.series)
      ?'<p class="series-legacy">Registro antigo: '+escapeHtml([entry.load?(entry.load+' kg'):'',entry.reps?(entry.reps+' repetições'):''].filter(Boolean).join(' · '))+'</p>':'';
    return '<div class="series-tracker"><div class="series-tracker-title"><strong>Séries</strong><span data-series-progress="'+exercise.id+'">'+completedSets(exercise,entry)+'/'+count+' feitas</span></div>'
      +rows+old+seriesProgressNote(exercise.id)+'</div>';
  }
  function refreshSeriesIndicators(exercise){
    if(typeof mount.querySelector!=='function')return;
    var entry=safeRecord().exercises[exercise.id]||{};
    var done=completedSets(exercise,entry),progress=mount.querySelector('[data-series-progress="'+exercise.id+'"]');
    if(progress)progress.textContent=done+'/'+setCount(exercise)+' feitas';
    var completed=plans[dayChoice].exercises.filter(function(x){return exerciseIsComplete(x,safeRecord().exercises[x.id]);}).length;
    var total=mount.querySelector('[data-exercises-progress]');
    if(total)total.textContent=completed+'/'+plans[dayChoice].exercises.length+' exercícios';
    var card=mount.querySelector('#exercise-'+exercise.id);
    if(card){card.classList.toggle('is-done',exerciseIsComplete(exercise,entry));var label=card.querySelector('.exercise-ordinal');if(label)label.textContent=exerciseIsComplete(exercise,entry)?'✓':String(plans[dayChoice].exercises.indexOf(exercise)+1);}
    var bar=mount.querySelector('[data-session-bar]');
    if(bar)bar.style.width=(completed/plans[dayChoice].exercises.length*100)+'%';
    var caption=mount.querySelector('[data-session-progress]');
    if(caption)caption.textContent=completed+' de '+plans[dayChoice].exercises.length+' exercícios completos';
  }
  function renderExercise(x,index,location,entry){
    entry=entry&&typeof entry==='object'?entry:{};
    var disp=location==='hotel'?(x.hotel||'Sem alternativa definida.'):'';
    var done=exerciseIsComplete(x,entry);
    return '<details class="train-exercise'+(done?' is-done':'')+'" id="exercise-'+escapeHtml(x.id)+'">'
      +'<summary><span class="exercise-ordinal">'+(done?'✓':index+1)+'</span><span>'
      +'<div class="exercise-name">'+escapeHtml(x.name)+'</div>'
      +'<div class="exercise-description">'+escapeHtml(x.dose)+' · '+escapeHtml(x.rest)+' descanso</div>'
      +'</span><span class="exercise-caret" aria-hidden="true">⌄</span></summary>'
      +'<div class="train-exercise-body">'
      +'<div class="exercise-meta"><span>'+escapeHtml(x.muscle)+'</span>'
      +(x.caution?'<span class="safety">Sem dor</span>':'')+'</div>'
      +teachingVideo(x.id)
      +stepsList(x.steps)
      +(disp?'<p class="exercise-note"><strong>Alternativa no hotel:</strong> '+escapeHtml(disp)+' A demonstração acima corresponde ao exercício principal.</p>':'')
      +(x.cue?'<p class="exercise-note caution">'+escapeHtml(x.cue)+'</p>':'')
      +seriesRows(x,entry)
      +'<button class="rest-button" type="button" data-rest="'+parseInt(x.rest,10)+'"><span aria-hidden="true">◷</span> Descansar '+parseInt(x.rest,10)+' segundos</button>'
      +'</div></details>';
  }
  function field(label,id,type,value,extra){
    extra=extra||'';
    if(type==='textarea')return '<div class="workout-field"><label for="'+id+'">'+escapeHtml(label)+'</label><textarea id="'+id+'" data-field="'+id+'" maxlength="650" '+extra+'>'+escapeHtml(value||'')+'</textarea></div>';
    return '<div class="workout-field"><label for="'+id+'">'+escapeHtml(label)+'</label><input id="'+id+'" type="'+(type||'text')+'" data-field="'+id+'" value="'+escapeHtml(value===undefined?'':value)+'" '+extra+'></div>';
  }
  function render(){
    if(!mount)return;
    mount.querySelectorAll('video').forEach(function(v){v.pause();});
    var week=bridge.getWeek(),p=plans[dayChoice],r=safeRecord(),location=r.location==='hotel'?'hotel':'condominio';
    var completed=['A','B','C','D'].filter(function(key){return getDayRecord(key).complete===true;}).length;
    var completedExercises=p.exercises.filter(function(x){return exerciseIsComplete(x,r.exercises[x.id]);}).length;

    mount.innerHTML='<div class="training-guide">'
      +'<nav class="train-day-nav" aria-label="Escolha a sessão">'+['A','B','C','D'].map(function(key){
        var done=getDayRecord(key).complete===true,day=plans[key];
        var shortName={A:'Superior',B:'Inferiores',C:'Superior',D:'Mobilidade'}[key];
        return '<button type="button" class="train-day-btn'+(dayChoice===key?' active':'')+(done?' completed':'')+'" data-day="'+key+'" aria-pressed="'+(dayChoice===key)+'"><span class="day-topline"><strong>'+key+'</strong><span class="train-done">'+(done?'✓':'')+'</span></span><small>'+shortName+'</small><span class="day-weekday">'+day.interval+'</span></button>';
      }).join('')+'</nav>'
      +'<section class="panel train-panel" aria-labelledby="trainingDetailTitle"><div class="train-panel-head"><div>'
      +'<span class="session-eyebrow">SESSÃO '+dayChoice+' <span>·</span> SEMANA '+String(week).padStart(2,'0')+'</span><h3 id="trainingDetailTitle">'+escapeHtml(p.title)+'</h3><p class="session-subtitle">'+escapeHtml(p.subtitle)+'</p></div>'
      +'<div class="training-summary"><span class="training-stat">'+escapeHtml(p.duration)+'</span></div></div>'
      +'<div class="train-equipment"><label for="trainingLocation">Local</label><select id="trainingLocation" aria-label="Local do treinamento"><option value="condominio"'+(location==='condominio'?' selected':'')+'>Condomínio</option><option value="hotel"'+(location==='hotel'?' selected':'')+'>Hotel</option></select></div>'
      +'<div class="session-progress"><div><span data-session-progress>'+completedExercises+' de '+p.exercises.length+' exercícios completos</span><span>Tudo salvo automaticamente</span></div><div class="track"><div data-session-bar style="width:'+(completedExercises/p.exercises.length*100)+'%"></div></div></div>'
      +'<p class="train-safety-short" role="note">Joelhos: não force dor ou travamento. Avalie antes de aumentar cargas.</p>'
      +'<h4 class="train-section-title"><span>01</span> Prepare o corpo <small>Mobilidade · 6–8 min</small></h4>'
      +guideSteps(p.mobility)
      +'<h4 class="train-section-title"><span>02</span> Seu treino <small>'+p.exercises.length+' exercícios</small></h4>'
      +'<div class="train-exercises">'+p.exercises.map(function(x,index){return renderExercise(x,index,location,r.exercises[x.id]);}).join('')+'</div>'

      +'<h4 class="train-section-title"><span>03</span> Finalize em movimento <small>Cardio</small></h4>'
      +'<details class="train-step"><summary><span class="train-step-index">♥</span><span class="train-step-content"><strong>'+escapeHtml(p.cardio.name)+'</strong><small>'+escapeHtml(p.cardio.dose)+'</small></span></summary><div class="train-step-body"><p>'+escapeHtml(p.cardio.suggestion)+'</p>'+teachingVideo('cardio'+dayChoice)+'</div></details>'

      +'<details class="train-log"><summary><strong>Registro</strong><span data-exercises-progress>'+completedExercises+'/'+p.exercises.length+' exercícios</span></summary>'
      +'<div class="workout-session-form">'
      +'<div class="workout-field-row">'
      +field('Dor antes (0–10)','painBefore','number',r.painBefore===undefined?'':r.painBefore,'min="0" max="10" step="1"')
      +field('Dor depois (0–10)','painAfter','number',r.painAfter===undefined?'':r.painAfter,'min="0" max="10" step="1"')
      +'</div><div class="workout-field-row">'
      +field('Esforço (0–10)','effort','number',r.effort===undefined?'':r.effort,'min="0" max="10" step="1"')
      +field('Cardio (min)','cardioMinutes','number',r.cardioMinutes===undefined?'':r.cardioMinutes,'min="0" max="180" step="1"')
      +'</div>'+field('Observações','notes','textarea',r.notes||'','rows="3"')
      +'<label class="workout-check"><input type="checkbox" data-field="mobilityDone" '+(r.mobilityDone?'checked':'')+'>Mobilidade feita</label>'
      +'<div class="workout-actions"><button class="save" type="button" data-action="save">Salvar</button>'
      +'<button class="finish" type="button" data-action="finish">'+(r.complete?'✓ Sessão concluída':'Concluir sessão')+'</button>'
      +'<button class="clear" type="button" data-action="clear">Limpar</button></div>'
      +'<p class="workout-last">Salvo neste navegador. Use “Meus dados” para baixar um backup.</p>'
      +'</div></details></section>'
      +'</div>';
    window.dispatchEvent(new CustomEvent('meutreino:render'));
  }
  function saveAuto(){
    var ok=bridge.save();
    return ok;
  }
  function fieldValue(fieldId,el){
    if(['painBefore','painAfter','effort','cardioMinutes'].indexOf(fieldId)>-1){
      var text=el.value.trim();
      if(text===''){el.setCustomValidity('');return '';}
      var n=Number(text),max=fieldId==='cardioMinutes'?180:10;
      if(!Number.isFinite(n)||n<0||n>max){el.setCustomValidity('Valor fora da faixa permitida');return null;}
      el.setCustomValidity('');
      return String(n);
    }
    if(fieldId==='mobilityDone')return el.checked;
    return el.value.slice(0,650);
  }
  function recordInput(target){
    var r=safeRecord();
    if(target.hasAttribute('data-field')){
      var fieldId=target.getAttribute('data-field');
      var val=fieldValue(fieldId,target);
      if(val===null)return;
      r[fieldId]=val;
      saveAuto();
      return;
    }
    if(target.hasAttribute('data-exercise')){
      var id=target.getAttribute('data-exercise');
      var key=target.getAttribute('data-exfield');
      var idxText=target.getAttribute('data-series');
      var exercise=plans[dayChoice].exercises.find(function(x){return x.id===id;});
      if(!exercise||!['load','reps','done'].includes(key))return;
      if(idxText===null)return;
      var seriesNumber=Number(idxText);
      if(!Number.isInteger(seriesNumber)||seriesNumber<0||seriesNumber>=setCount(exercise))return;
      if(!r.exercises[id])r.exercises[id]={};
      var entry=r.exercises[id];
      if(!Array.isArray(entry.series))entry.series=[];
      if(!entry.series[seriesNumber])entry.series[seriesNumber]={load:'',reps:'',done:false};
      var set=entry.series[seriesNumber];
      if(key==='done'){
        set.done=target.checked;
      }else{
        var value=target.value.trim();
        if(key==='load'){
          // Aceita vírgula e ponto decimal; mantém o texto para exibição.
          var validLoad=value===''||(/^\d{1,4}([.,]\d{1,2})?$/.test(value)&&Number(value.replace(',','.'))<=9999);
          if(typeof target.setCustomValidity==='function')target.setCustomValidity(validLoad?'':'Digite uma carga válida em kg');
          if(!validLoad)return;
          set.load=value.slice(0,8);
        }else{
          var validReps=value===''||(/^\d{1,3}$/.test(value)&&Number(value)<=200);
          if(typeof target.setCustomValidity==='function')target.setCustomValidity(validReps?'':'Use de 0 a 200 repetições');
          if(!validReps)return;
          set.reps=value;
        }
      }
      entry.done=exerciseIsComplete(exercise,entry);
      saveAuto();
      refreshSeriesIndicators(exercise);
    }
  }
  mount.addEventListener('click',function(event){
    var retry=event.target.closest('[data-video-retry]');
    var toggle=event.target.closest('[data-video-toggle]');
    if(retry||toggle){
      var figure=(retry||toggle).closest('figure'),video=figure.querySelector('video');
      if(toggle&&!video.paused){video.dataset.userPaused='true';video.pause();}
      else{video.dataset.userPaused='false';var playing=video.play();if(playing)playing.catch(function(){bridge.toast('Toque em reproduzir ou recarregue a página.');});}
      return;
    }
    var dayBtn=event.target.closest('[data-day]');
    if(dayBtn&&plans[dayBtn.dataset.day]){dayChoice=dayBtn.dataset.day;try{localStorage.setItem('meu-treino-sessao-v2',dayChoice);}catch(e){}render();return;}
    var act=event.target.closest('[data-action]');if(!act)return;
    var r=safeRecord();
    if(act.dataset.action==='save'){
      if(saveAuto())bridge.toast('Treino '+dayChoice+' salvo na semana '+bridge.getWeek()+'.');
    }else if(act.dataset.action==='finish'){
      var before=r.painBefore===''||r.painBefore===undefined?null:Number(r.painBefore);
      var after=r.painAfter===''||r.painAfter===undefined?null:Number(r.painAfter);
      if(after!==null&&before!==null&&after>before){
        bridge.toast('A dor aumentou. Revise a sessão e os exercícios antes de progredir.');
      }
      r.complete=!r.complete;
      r.completedAt=r.complete?new Date().toISOString():'';
      if(saveAuto()){if(bridge.refreshWeeks)bridge.refreshWeeks();render();bridge.toast(r.complete?'Sessão registrada como concluída.':'Sessão reaberta.');}
    }else if(act.dataset.action==='clear'){
      if(!confirm('Apagar somente o treino '+dayChoice+' da semana '+bridge.getWeek()+'?'))return;
      var w=bridge.getData().weeks[bridge.getWeek()-1];
      if(w.training)delete w.training[dayChoice];
      if(saveAuto()){render();bridge.toast('Registro removido.');}
    }
  });
  mount.addEventListener('toggle',function(event){
    // <details> emite toggle sem bubbling: captura permite iniciar o vídeo sem tocar no player.
    var details=event.target;
    if(details&&details.tagName==='DETAILS')autoLoopIn(details);
  },true);
  mount.addEventListener('play',function(event){var v=event.target;if(v.tagName!=='VIDEO')return;var f=v.closest('figure');f.querySelector('[data-video-retry]').hidden=true;var b=f.querySelector('[data-video-toggle]');b.innerHTML='Pausar <span aria-hidden="true">Ⅱ</span>';b.setAttribute('aria-label','Pausar demonstração');},true);
  mount.addEventListener('pause',function(event){var v=event.target;if(v.tagName!=='VIDEO')return;var b=v.closest('figure').querySelector('[data-video-toggle]');b.innerHTML='Reproduzir <span aria-hidden="true">▷</span>';b.setAttribute('aria-label','Reproduzir demonstração');},true);
  mount.addEventListener('error',function(event){var v=event.target;if(v.tagName==='VIDEO')v.closest('figure').querySelector('.video-error').hidden=false;},true);
  document.addEventListener('visibilitychange',function(){if(document.hidden)mount.querySelectorAll('video').forEach(function(v){v.pause();});else mount.querySelectorAll('details[open]').forEach(autoLoopIn);});
  mount.addEventListener('input',function(event){recordInput(event.target);});
  mount.addEventListener('change',function(event){
    var t=event.target;
    if(t.id==='trainingLocation'){
      var r=safeRecord();r.location=t.value==='hotel'?'hotel':'condominio';
      saveAuto();render();
    } else recordInput(t);
  });
  window.MeuTreinoTreinos={render:render};
  render();
})();
