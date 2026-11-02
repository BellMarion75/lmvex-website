(function(){
  var T = window.LMVEX_T || {};
  var DE = {};
  var els = document.querySelectorAll("[data-i]");
  els.forEach(function(e){ if(!(e.dataset.i in DE)) DE[e.dataset.i] = e.innerHTML; });
  T.de = DE;
  var menuLabel = {de:"Menü", en:"Menu", fr:"Menu"};

  function store(l){ try{ localStorage.setItem("lmvex-lang", l); }catch(e){} }
  function stored(){ try{ return localStorage.getItem("lmvex-lang"); }catch(e){ return null; } }

  function setLang(l){
    if(!T[l]) l = "de";
    document.documentElement.lang = l;
    els.forEach(function(e){
      var v = (l === "de") ? DE[e.dataset.i] : T[l][e.dataset.i];
      if(v !== undefined) e.innerHTML = v;
    });
    document.querySelectorAll(".lang button").forEach(function(b){
      b.setAttribute("aria-pressed", String(b.dataset.lang === l));
    });
    var mb = document.querySelector(".menu-btn");
    if(mb) mb.textContent = menuLabel[l];
    store(l);
  }

  document.querySelectorAll(".lang button").forEach(function(b){
    b.addEventListener("click", function(){ setLang(b.dataset.lang); });
  });
  window.addEventListener("hashchange", function(){
    var h = location.hash.slice(1); if(T[h]) setLang(h);
  });

  var mb = document.querySelector(".menu-btn");
  if(mb){
    mb.addEventListener("click", function(){
      var top = document.querySelector(".top");
      var open = top.classList.toggle("open");
      mb.setAttribute("aria-expanded", String(open));
    });
  }

  var h = location.hash.slice(1);
  setLang(T[h] ? h : (stored() || "de"));
})();
