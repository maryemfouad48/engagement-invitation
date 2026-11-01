(function(){
  var ar='٠١٢٣٤٥٦٧٨٩';
  function n(x){return String(x).replace(/\d/g,function(c){return ar[c]})}
  var target=new Date('2026-11-11T20:00:00').getTime();
  function tick(){
    var t=Math.max(0,target-Date.now());
    var s=Math.floor(t/1000);
    document.getElementById('d').textContent=n(Math.floor(s/86400));
    document.getElementById('h').textContent=n(Math.floor(s%86400/3600));
    document.getElementById('m').textContent=n(Math.floor(s%3600/60));
    document.getElementById('s').textContent=n(s%60);
  }
  tick(); setInterval(tick,1000);

})();
(function(){
  var b=document.body, ov=document.getElementById('intro'), pt=document.createElement('div');
  pt.className='petals'; pt.setAttribute('aria-hidden','true');
  for(var i=1;i<=10;i++){var e=document.createElement('i');e.style.setProperty('--i',i);pt.appendChild(e)}
  for(var k=1;k<=8;k++){var h=document.createElement('em');h.textContent='♥';h.style.setProperty('--i',k);pt.appendChild(h)}
  b.appendChild(pt);
  function reveal(){
    var els=document.querySelectorAll('.rise');
    if(!('IntersectionObserver' in window)){els.forEach(function(el){el.classList.add('in')});return}
    var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.15});
    els.forEach(function(el){io.observe(el)});
  }
  ov.addEventListener('click',function(){
    ov.classList.add('go');
    for(var k=0;k<14;k++){var an=k/14*6.283,d=110+Math.random()*90,h=document.createElement('span');
      h.className='burst';h.textContent='♥';
      h.style.cssText='--x:'+Math.cos(an)*d+'px;--y:'+Math.sin(an)*d+'px;font-size:'+(14+Math.random()*14)+'px';
      b.appendChild(h);setTimeout((function(n){return function(){n.remove()}})(h),1300)} b.classList.add('ready'); reveal();
    setTimeout(function(){ov.style.display='none'},1200);
  });
})();