(function(){
  'use strict';
  var root=document.getElementById('libraryContent');
  if(!root)return;
  var list=document.querySelectorAll('[data-library-day]'),selected='A',plans=null;
  function text(tag,cls,value){
    var e=document.createElement(tag);if(cls)e.className=cls;
    if(value!==undefined)e.textContent=String(value);return e;
  }
  function validVideo(url){return typeof url==='string'&&/^\.\/assets\/videos\/[a-z0-9_-]+\.mp4$/i.test(url);}
  function validPoster(url){return typeof url==='string'&&/^\.\/assets\/(?:videos|images)\/[a-z0-9_-]+\.webp$/i.test(url);}
  function makeCard(ex,kind){
    var clip=window.MeuTreinoVideos&&window.MeuTreinoVideos.clips&&window.MeuTreinoVideos.clips[ex.id];
    var card=text('article','library-card');
    var preview=text('div','library-preview');
    if(clip&&validPoster(clip.poster)){
      var img=text('img','library-poster');
      img.src=clip.poster;img.loading='lazy';img.alt='Imagem demonstrativa: '+ex.name;
      preview.appendChild(img);
    }else preview.appendChild(text('span','library-no-image','▶ Demonstração'));
    card.appendChild(preview);
    var main=text('div','library-card-body');
    main.appendChild(text('small','library-type',kind));
    main.appendChild(text('h3','library-name',ex.name));
    main.appendChild(text('p','library-dose',[ex.dose,ex.rest?'Descanso: '+ex.rest:''].filter(Boolean).join(' · ')));
    var detail=text('details','library-details');
    detail.appendChild(text('summary',null,'Ver vídeo e orientações'));
    var inner=text('div','library-inner');
    if(clip&&validVideo(clip.url)){
      var video=text('video','library-player');video.controls=true;video.muted=true;video.loop=true;video.playsInline=true;
      video.preload='none';if(validPoster(clip.poster))video.poster=clip.poster;
      video.setAttribute('aria-label','Vídeo de '+ex.name);
      inner.appendChild(video);
      detail.addEventListener('toggle',function(){
        if(detail.open&&!video.src){video.src=clip.url;}
        if(!detail.open)video.pause();
      });
    }
    if(Array.isArray(ex.steps)&&ex.steps.length){
      var ol=text('ol','library-steps');
      ex.steps.forEach(function(step){ol.appendChild(text('li',null,step));});
      inner.appendChild(ol);
    }
    if(ex.cue)inner.appendChild(text('p','library-note',ex.cue));
    if(ex.suggestion)inner.appendChild(text('p','library-note',ex.suggestion));
    if(ex.caution)inner.appendChild(text('p','library-caution','Este movimento exige acompanhamento profissional e adaptação individual.'));
    detail.appendChild(inner);main.appendChild(detail);card.appendChild(main);
    return card;
  }
  function render(){
    root.replaceChildren();var p=plans&&plans[selected];
    if(!p){root.appendChild(text('p','library-note','Biblioteca indisponível. Atualize a página.'));return;}
    list.forEach(function(button){
      var active=button.dataset.libraryDay===selected;
      button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
    });
    var intro=text('div','library-intro');
    intro.appendChild(text('h3',null,'Treino '+selected+' · '+p.title));
    intro.appendChild(text('p',null,[p.interval,p.duration,p.subtitle].filter(Boolean).join(' · ')));
    root.appendChild(intro);
    var groups=[['Mobilidade',p.mobility||[]],['Musculação',p.exercises||[]]];
    if(p.cardio)groups.push(['Cardio',[Object.assign({},p.cardio,{id:'cardio'+selected})]]);
    groups.forEach(function(pair){
      if(!pair[1].length)return;
      var section=text('section','library-group');
      section.appendChild(text('h4',null,pair[0]+' · '+pair[1].length));
      var grid=text('div','library-grid');
      pair[1].forEach(function(ex){grid.appendChild(makeCard(ex,pair[0]));});
      section.appendChild(grid);root.appendChild(section);
    });
  }
  list.forEach(function(button){button.addEventListener('click',function(){selected=button.dataset.libraryDay;render();});});
  fetch('./data/site-content.json',{cache:'force-cache'}).then(function(r){if(!r.ok)throw Error('offline');return r.json();})
    .then(function(data){plans=data&&data.plans;render();})
    .catch(function(){root.replaceChildren(text('p','library-note','Não foi possível abrir os vídeos. Atualize a página.'));});
})();