/* ===================== CONFIG (reskineable) ===================== */
const SITE = {
  wa:"524423897667",
  waMsg:"Hola (entre tanto) 👋 vi su sitio y me gustaría reservar / conocer la carta.",
  hours:[["Lunes","8:00 – 14:00"],["Martes","8:00 – 21:00"],["Miércoles","8:00 – 21:00"],["Jueves","8:00 – 21:00"],["Viernes","8:00 – 21:00"],["Sábado","8:00 – 21:00"],["Domingo","9:30 – 15:30"]],
  reviews:[
    {stars:5,text:"Beautiful environment, great coffee and food and the service is very welcoming and friendly. Maybe one of our favorites to date. A definite, high recommendation!",who:"Maryam",meta:"Google · hace un año"},
    {stars:5,text:"My favorite cafe in this area; good coffee, good tea, good food and most importantly good service! It's a really nice place, you will love it. Favorites: Matcha Latte, chicken Panini, Chilaquiles, Croissants.",who:"Jane Jiang",meta:"Google · reseña local"},
    {stars:5,text:"What a charming and welcoming place! Soft music, comfortable seating, work tables, and a laptop-free zone. The spritzer was beautifully presented and delicious. I highly recommend a visit.",who:"Lysa Allman-Baldwin",meta:"Google · Local Guide"}
  ]
};

/* WhatsApp */
const waUrl = `https://wa.me/${SITE.wa}?text=${encodeURIComponent(SITE.waMsg)}`;
document.querySelectorAll('[data-wa]').forEach(a=>a.href=waUrl);
/* Horarios */
(function(){const map={0:6,1:0,2:1,3:2,4:3,5:4,6:5};const today=map[new Date().getDay()];
  document.getElementById('hours').innerHTML=SITE.hours.map((h,i)=>`<li class="${i===today?'today':''}"><span>${h[0]}</span><span>${h[1]}</span></li>`).join('');})();
/* Testimonios */
document.getElementById('testiGrid').innerHTML=SITE.reviews.map((r,i)=>`<div class="tcard ${i?'d'+i:''}" data-reveal><div class="stars">${'★'.repeat(r.stars)}</div><p>“${r.text}”</p><div class="who">${r.who}<span>${r.meta}</span></div></div>`).join('');
/* Marquee loop */
const mq=document.getElementById('mq'); mq.innerHTML+=mq.innerHTML;

const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine=matchMedia('(pointer:fine)').matches;

/* Preloader + hero reveal */
addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('pre').classList.add('done'),350);
  document.body.classList.add('reveal-on');
  const k=document.getElementById('heroKicker'); if(k)k.style.opacity=1;
});
setTimeout(()=>{document.getElementById('pre').classList.add('done');document.body.classList.add('reveal-on');const k=document.getElementById('heroKicker');if(k)k.style.opacity=1;},2600);

/* NAV */
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});
const toggle=document.getElementById('navToggle'),links=document.getElementById('navLinks');
toggle.addEventListener('click',()=>links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));

/* REVEAL */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'-8% 0px -8% 0px'});
document.querySelectorAll('[data-reveal]').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight*0.92)el.classList.add('in');else io.observe(el);});

/* COUNT-UP */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,end=parseFloat(el.dataset.count),dec=+(el.dataset.dec||0);let t0=null;const dur=1400;function tick(t){t0=t0||t;const p=Math.min((t-t0)/dur,1);el.textContent=(end*(1-Math.pow(1-p,3))).toFixed(dec);if(p<1)requestAnimationFrame(tick);else el.textContent=end.toFixed(dec);}requestAnimationFrame(tick);cio.unobserve(el);}),{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

/* HERO parallax + cursor + motes + magnetic */
if(fine && !reduce){
  const glow=document.querySelector('.cursor-glow');let gx=innerWidth/2,gy=innerHeight/2,cx=gx,cy=gy,mnx=0,mny=0;
  addEventListener('mousemove',e=>{gx=e.clientX;gy=e.clientY;glow.style.opacity=1;mnx=(e.clientX/innerWidth-.5)*2;mny=(e.clientY/innerHeight-.5)*2;});
  (function loop(){cx+=(gx-cx)*.12;cy+=(gy-cy)*.12;glow.style.left=cx+'px';glow.style.top=cy+'px';requestAnimationFrame(loop);})();
  document.querySelectorAll('.btn-primary').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`;});
    b.addEventListener('mouseleave',()=>b.style.transform='');});
  const layers=document.querySelectorAll('[data-depth]');
  addEventListener('scroll',()=>{const y=scrollY;layers.forEach(l=>{const d=+l.dataset.depth;l.style.transform=`translateY(${y*d}px)`;});},{passive:true});
  window.__mn=()=>[mnx,mny];
  // motes
  const c=document.getElementById('motes'),ctx=c.getContext('2d');let W,H,motes=[],raf,vis=true;
  function size(){W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;motes=Array.from({length:Math.min(46,Math.floor(W/26))},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.5,s:Math.random()*.3+.05,o:Math.random()*.5+.2}));}
  function draw(){ctx.clearRect(0,0,W,H);for(const m of motes){m.y-=m.s;m.x+=Math.sin(m.y*.01)*.2;if(m.y<-5){m.y=H+5;m.x=Math.random()*W;}ctx.beginPath();ctx.arc(m.x,m.y,m.r,0,7);ctx.fillStyle=`rgba(240,196,137,${m.o})`;ctx.fill();}if(vis)raf=requestAnimationFrame(draw);}
  const hero=document.querySelector('.hero');
  new IntersectionObserver(([e])=>{vis=e.isIntersecting;if(vis){size();draw();}else cancelAnimationFrame(raf);}).observe(hero);
  addEventListener('resize',size);size();draw();
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(vis)draw();});
}

/* ============ EL RITUAL — secuencia scroll-scrub de fotos reales ============ */
const IMMERSIVE = !reduce && innerWidth>760 && fine && typeof gsap!=='undefined' && typeof ScrollTrigger!=='undefined';

if(IMMERSIVE){
  document.body.classList.add('immersive');
  gsap.registerPlugin(ScrollTrigger);
  initRitual();
}

function initRitual(){
  const photos=[...document.querySelectorAll('.drink-photo')];
  const tag=document.getElementById('drinkTag');
  const tags=['Pour-over · negro','Latte · leche sedosa','Matcha · de autor'];
  const dots=document.querySelectorAll('.ritual-progress i');
  const steps=document.querySelectorAll('.rstep');
  const N=photos.length;
  const seg=1/(N-1);
  const target={progress:0};let cur=0,lastBeat=-1;

  function setBeat(p){const b=Math.max(0,Math.min(N-1,Math.floor(p*N)));if(b!==lastBeat){lastBeat=b;steps.forEach((s,i)=>s.classList.toggle('active',i===b));dots.forEach((d,i)=>d.classList.toggle('on',i===b));if(tag)tag.textContent=tags[b];}}

  ScrollTrigger.create({
    trigger:'.ritual',start:'top top',end:()=>'+='+(innerHeight*N),
    pin:'#ritualStage',scrub:.5,anticipatePin:1,invalidateOnRefresh:true,
    onUpdate:self=>{target.progress=self.progress;setBeat(self.progress);}
  });

  function applyFrame(){
    cur+=(target.progress-cur)*.09;
    const mn=window.__mn?window.__mn():[0,0];
    photos.forEach((ph,i)=>{
      const center=i*seg;
      const near=Math.max(0,Math.min(1,1-Math.abs(cur-center)/(seg*0.92)));
      const op=near*near*(3-2*near); // smoothstep
      const zoom=1.09-near*0.06+(cur-center)*0.045;
      ph.style.opacity=op.toFixed(3);
      ph.style.transform='scale('+zoom.toFixed(3)+') translate('+(mn[0]*10).toFixed(1)+'px,'+(mn[1]*8).toFixed(1)+'px)';
      ph.style.zIndex=Math.round(near*10);
    });
  }
  let visible=false,raf;
  function loop(){applyFrame();if(visible&&!document.hidden)raf=requestAnimationFrame(loop);}
  new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible&&!document.hidden){cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);}else cancelAnimationFrame(raf);}).observe(document.getElementById('ritualStage'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(visible)raf=requestAnimationFrame(loop);});
  applyFrame();
  window.__C={setP:function(p){target.progress=p;cur=p;},updateFrame:applyFrame};

  function refresh(){ScrollTrigger.refresh();applyFrame();}
  if(document.readyState==='complete'){setTimeout(refresh,300);}else{addEventListener('load',function(){setTimeout(refresh,300);});}
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(refresh,150);});}
  setTimeout(refresh,1400);
}
