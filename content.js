(function(){
  'use strict';
  // Dados compartilhados, públicos e independentes das informações pessoais.
  window.MeuTreinoContentReady=fetch('./data/site-content.json?fresh='+Date.now(),{cache:'no-store'})
    .then(function(r){if(!r.ok)throw Error('offline');return r.json();})
    .then(function(v){if(!v||v.schemaVersion!==1||!v.site||!v.plans)throw Error('invalid');return v;})
    .catch(function(){return null;});
})();
