(function(){
  'use strict';
  var bridge=window.MeuTreinoBridge;
  if(!bridge)return;
  var byId=function(id){return document.getElementById(id);};
  function progress(){
    var total=0,weekDone=0;
    bridge.getData().weeks.forEach(function(w,index){var count=['A','B','C','D'].filter(function(d){return w.training&&w.training[d]&&w.training[d].complete===true;}).length;total+=count;if(index===bridge.getWeek()-1)weekDone=count;});
    byId('planProgressText').innerHTML=total+' <span>/ 32 sessões</span>';
    byId('planProgress').setAttribute('aria-valuenow',String(total));byId('planBar').style.width=total/32*100+'%';
    byId('heroWeek').textContent='SEMANA '+String(bridge.getWeek()).padStart(2,'0')+' / 08';
    byId('weekSessionCount').innerHTML=weekDone+'<span>/4</span>';byId('weekRing').style.setProperty('--progress',weekDone/4*100+'%');
    byId('heroProgress').textContent=weekDone===4?'Semana completa. Cada sessão conta!':weekDone===0?'Quatro sessões para cuidar da sua evolução.':weekDone+' de 4 sessões concluídas nesta semana. Continue no seu ritmo.';
  }
  window.addEventListener('meutreino:saved',progress);window.addEventListener('meutreino:render',progress);progress();
  byId('exportBackup').addEventListener('click',function(){
    var data=bridge.exportData();data.app='meu-treino';data.exportedAt=new Date().toISOString();
    var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='meu-treino-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);
    document.querySelector('.backup-menu').open=false;bridge.toast('Backup baixado. Guarde este arquivo para restaurar seus registros.');
  });
  byId('importBackup').addEventListener('click',function(){byId('backupFile').click();});
  byId('backupFile').addEventListener('change',async function(){
    var file=this.files&&this.files[0];this.value='';if(!file)return;if(file.size>2*1024*1024){bridge.toast('Arquivo muito grande. Selecione um backup do Meu Treino.');return;}
    try{var raw=JSON.parse(await file.text());if(!raw||!Array.isArray(raw.weeks)||raw.weeks.length!==8)throw Error('Formato');
      var measurements=Object.keys(raw.evaluation&&raw.evaluation.values||{}).filter(function(k){return raw.evaluation.values[k]!=='';}).length;
      var sessions=raw.weeks.reduce(function(sum,w){return sum+['A','B','C','D'].filter(function(d){return w&&w.training&&w.training[d]&&w.training[d].complete;}).length;},0);
      if(!confirm('Restaurar este backup?\n\n'+measurements+' medidas e '+sessions+' sessões concluídas.\n\nOs registros atuais deste navegador serão substituídos. Baixe um backup antes se quiser preservá-los.'))return;
      bridge.restore(raw);progress();document.querySelector('.backup-menu').open=false;bridge.toast('Backup restaurado com sucesso.');
    }catch(err){bridge.toast('Não foi possível restaurar. Selecione um backup válido do Meu Treino.');}
  });
  document.addEventListener('click',function(e){var menu=document.querySelector('.backup-menu');if(!menu.contains(e.target))menu.open=false;});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')document.querySelector('.backup-menu').open=false;});
  var observer='IntersectionObserver' in window?new IntersectionObserver(function(entries){entries.forEach(function(entry){
    var video=entry.target;if(!entry.isIntersecting){video.pause();return;}var details=video.closest('details');
    if(details&&details.open&&!byId('trainingTab').hidden&&!document.hidden&&video.dataset.userPaused!=='true'&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&video.getAttribute('src')){var promise=video.play();if(promise)promise.catch(function(){video.closest('figure').querySelector('[data-video-retry]').hidden=false;});}
  });},{threshold:.15}):null;
  function watchVideos(){if(observer){observer.disconnect();document.querySelectorAll('video.loop-video').forEach(function(v){observer.observe(v);});}}
  window.addEventListener('meutreino:render',watchVideos);watchVideos();
  // A deadline keeps rest accurate when the browser throttles background timers.
  var timer=document.createElement('section');timer.className='rest-timer';timer.hidden=true;timer.setAttribute('aria-label','Cronômetro de descanso');
  timer.innerHTML='<div class="rest-timer-head"><span>RECUPERE O FÔLEGO</span><button type="button" data-timer="close" aria-label="Fechar cronômetro">×</button></div><div class="timer-main"><div><strong id="timerTime">01:00</strong><span id="timerStatus">Descanso entre séries</span></div><button type="button" data-timer="pause" id="timerPause" aria-label="Pausar cronômetro">Ⅱ</button></div><div class="timer-actions"><button type="button" data-timer="add">+ 15 s</button><button type="button" data-timer="reset">Reiniciar</button><button type="button" data-timer="sound" aria-pressed="false">Som desligado</button></div>';
  document.body.appendChild(timer);
  var deadline=0,remaining=0,initial=60,running=false,sound=false,audioContext=null,interval=null;
  function paint(){
    var seconds=running?Math.max(0,Math.ceil((deadline-Date.now())/1000)):remaining;
    byId('timerTime').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
    if(running&&seconds===0){running=false;remaining=0;clearInterval(interval);timer.classList.add('finished');byId('timerStatus').textContent='Descanso concluído';byId('timerPause').textContent='↻';byId('timerPause').setAttribute('aria-label','Reiniciar cronômetro');bridge.toast('Descanso concluído. Continue quando estiver pronto.');
      if(sound&&audioContext){var oscillator=audioContext.createOscillator(),gain=audioContext.createGain();oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.frequency.value=660;gain.gain.value=.12;oscillator.start();gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.5);oscillator.stop(audioContext.currentTime+.5);}}
  }
  function start(seconds){clearInterval(interval);initial=seconds;remaining=seconds;deadline=Date.now()+seconds*1000;running=true;timer.hidden=false;timer.classList.remove('finished');byId('timerStatus').textContent='Descanso entre séries';byId('timerPause').textContent='Ⅱ';byId('timerPause').setAttribute('aria-label','Pausar cronômetro');interval=setInterval(paint,250);paint();}
  document.addEventListener('click',function(e){
    var rest=e.target.closest('[data-rest]');if(rest){start(Number(rest.dataset.rest)||60);return;}var action=e.target.closest('[data-timer]');if(!action)return;
    switch(action.dataset.timer){
      case 'close':clearInterval(interval);running=false;timer.hidden=true;break;
      case 'pause':if(!running&&remaining===0){start(initial);break;}
        if(running){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));running=false;byId('timerPause').textContent='▷';byId('timerPause').setAttribute('aria-label','Continuar cronômetro');byId('timerStatus').textContent='Cronômetro pausado';}
        else{deadline=Date.now()+remaining*1000;running=true;byId('timerPause').textContent='Ⅱ';byId('timerPause').setAttribute('aria-label','Pausar cronômetro');byId('timerStatus').textContent='Descanso entre séries';}paint();break;
      case 'add':if(running)deadline+=15000;else if(remaining===0)start(15);else remaining+=15;paint();break;
      case 'reset':start(initial);break;
      case 'sound':sound=!sound;action.textContent=sound?'Som ligado':'Som desligado';action.setAttribute('aria-pressed',String(sound));if(sound){try{var Audio=window.AudioContext||window.webkitAudioContext;if(Audio){audioContext=audioContext||new Audio();audioContext.resume();}}catch(err){sound=false;action.textContent='Som indisponível';action.setAttribute('aria-pressed','false');}}break;
    }
  });
})();
