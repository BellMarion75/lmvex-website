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
    var hh = location.hash.slice(1); if(T[hh]) setLang(hh);
  });

  var menu = document.querySelector(".menu-btn");
  if(menu){
    menu.addEventListener("click", function(){
      var top = document.querySelector(".top");
      var open = top.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
  }

  // ---- forms (book, coaching, contact) ----
  // Set FORM_ENDPOINT to the Formspree URL (e.g. "https://formspree.io/f/abcdwxyz") to send without an email app.
  var FORM_ENDPOINT = "";
  function msg(k){
    var l = document.documentElement.lang, ex = T.de_extra || {};
    return (l === "de" ? ex[k] : (T[l] || {})[k]) || ex[k];
  }
  function labelOf(el){
    var lb = document.querySelector('label[for="' + el.id + '"]');
    return lb ? lb.textContent.replace(/\*|\((optional|facultatif)\)/gi, "").trim() : el.name;
  }
  document.querySelectorAll("form.nform").forEach(function(f){
    f.addEventListener("submit", function(ev){
      ev.preventDefault();
      var box = f.querySelector(".fmsg"), btn = f.querySelector("button[type=submit]");
      var ok = true, data = {}, lines = [];
      f.querySelectorAll("input,select,textarea").forEach(function(el){
        if(el.type === "checkbox"){ if(el.required && !el.checked) ok = false; return; }
        var v = el.value.trim();
        if(el.required && !v) ok = false;
        if(el.type === "email" && v && v.indexOf("@") < 1) ok = false;
        if(v){ data[el.name] = v; lines.push(labelOf(el) + ": " + v); }
      });
      if(!ok){ box.textContent = msg("nf_err"); box.className = "fmsg err"; return; }
      var subject = f.dataset.subject + (data.topic ? " – " + data.topic : "") + (data.programme ? " – " + data.programme : "");
      data._subject = subject;
      if(FORM_ENDPOINT){
        btn.disabled = true;
        fetch(FORM_ENDPOINT, {method:"POST", headers:{"Content-Type":"application/json","Accept":"application/json"}, body:JSON.stringify(data)})
          .then(function(r){ if(!r.ok) throw 0; f.reset(); box.textContent = msg(f.dataset.ok); box.className = "fmsg ok"; })
          .catch(function(){ box.textContent = msg("nf_fail"); box.className = "fmsg err"; })
          .then(function(){ btn.disabled = false; });
      } else {
        box.textContent = msg("nf_mail"); box.className = "fmsg ok";
        location.href = "mailto:laurence.monkam@lmvex.de?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      }
    });
  });
  document.querySelectorAll("a[data-topic]").forEach(function(a){
    a.addEventListener("click", function(){
      var sel = document.getElementById("kf-topic"); if(sel) sel.value = a.dataset.topic;
    });
  });

  var h = location.hash.slice(1);
  setLang(T[h] ? h : (stored() || "de"));
})();
