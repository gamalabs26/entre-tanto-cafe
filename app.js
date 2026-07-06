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

/* ===================== ESCENA 3D — LA TAZA (Nivel 3) ===================== */
function webglOK(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')));}catch(e){return false;}}
const IMMERSIVE = !reduce && innerWidth>760 && fine && typeof THREE!=='undefined' && typeof gsap!=='undefined' && webglOK();

if(IMMERSIVE){
  document.body.classList.add('immersive');
  gsap.registerPlugin(ScrollTrigger);
  initCup();
}

function softTex(inner){
  const s=64,cv=document.createElement('canvas');cv.width=cv.height=s;const x=cv.getContext('2d');
  const g=x.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
  g.addColorStop(0,inner);g.addColorStop(.5,'rgba(255,220,170,.35)');g.addColorStop(1,'rgba(255,220,170,0)');
  x.fillStyle=g;x.fillRect(0,0,s,s);const t=new THREE.Texture(cv);t.needsUpdate=true;return t;
}

function initCup(){
  const canvas=document.getElementById('cupScene');
  const stage=document.getElementById('ritualStage');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(38,1,.1,100);
  const CX=-0.75; // desplazar taza a la izquierda (texto va a la derecha)

  function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}

  // Grupo de la taza
  const cup=new THREE.Group();cup.position.x=CX;scene.add(cup);

  // Cuerpo (Lathe) — cerámica oscura tipo stoneware
  const prof=[[0,0],[.55,0],[.62,.05],[.86,1.25],[.86,1.30],[.80,1.30],[.74,1.20],[.60,.15],[0,.15]].map(p=>new THREE.Vector2(p[0],p[1]));
  const body=new THREE.Mesh(new THREE.LatheGeometry(prof,64),new THREE.MeshStandardMaterial({color:0x2c2b30,roughness:.66,metalness:.05}));
  cup.add(body);
  // Asa
  const handle=new THREE.Mesh(new THREE.TorusGeometry(.30,.075,14,28,Math.PI*1.25),new THREE.MeshStandardMaterial({color:0x2c2b30,roughness:.66,metalness:.05}));
  handle.position.set(.86,.72,0);handle.rotation.z=-0.35;cup.add(handle);
  // Superficie de café (color se transforma)
  const coffeeMat=new THREE.MeshStandardMaterial({color:0x241009,roughness:.22,metalness:0,emissive:0x0a0402});
  const coffee=new THREE.Mesh(new THREE.CircleGeometry(.72,48),coffeeMat);
  coffee.rotation.x=-Math.PI/2;coffee.position.y=1.19;cup.add(coffee);
  // Platito
  const saucer=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.05,.06,60),new THREE.MeshStandardMaterial({color:0x27262b,roughness:.7,metalness:.05}));
  saucer.position.y=-0.04;cup.add(saucer);

  // Luces (frontales para cerámica oscura)
  scene.add(new THREE.HemisphereLight(0xffd9a8,0x160d08,.55));
  scene.add(new THREE.AmbientLight(0x2a1c12,.5));
  const key=new THREE.DirectionalLight(0xffe0b0,1.15);key.position.set(2.4,3.4,3.2);scene.add(key);
  const rim=new THREE.DirectionalLight(0xffb066,.55);rim.position.set(-3,1.4,-2);scene.add(rim);

  // Bokeh cálido de fondo
  const bokehTex=softTex('rgba(255,205,150,.9)');
  const bokeh=new THREE.Group();scene.add(bokeh);
  for(let i=0;i<9;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:bokehTex,transparent:true,blending:THREE.AdditiveBlending,opacity:.12+Math.random()*.16,depthWrite:false}));
    sp.position.set((Math.random()-.5)*8,(Math.random()-.2)*4.5,-2-Math.random()*3);const s=.6+Math.random()*1.6;sp.scale.set(s,s,1);sp.userData={sp:.1+Math.random()*.2,ph:Math.random()*7};bokeh.add(sp);}

  // Vapor
  const steamTex=softTex('rgba(255,255,255,.9)');
  const steam=new THREE.Group();steam.position.x=CX;scene.add(steam);
  const puffs=[];
  for(let i=0;i<34;i++){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:steamTex,transparent:true,blending:THREE.AdditiveBlending,opacity:0,depthWrite:false}));
    steam.add(m);const p={m,seed:Math.random()*7,x:(Math.random()-.5)*.7,life:Math.random()};puffs.push(p);m.scale.set(.5,.5,1);}

  // Estado
  const target={progress:0};let cur=0,lastP=0,vel=0,t=0;
  const C0=new THREE.Color(0x241009),C1=new THREE.Color(0xc9a06a),C2=new THREE.Color(0x7fae5a);
  const tmp=new THREE.Color();
  function drinkColor(p){if(p<.5){tmp.copy(C0).lerp(C1,p/.5);}else{tmp.copy(C1).lerp(C2,(p-.5)/.5);}return tmp;}

  resize();addEventListener('resize',resize);

  // Scroll driver (pin + scrub)
  const dots=document.querySelectorAll('.ritual-progress i');
  const steps=document.querySelectorAll('.rstep');
  function setBeat(p){const b=Math.max(0,Math.min(2,Math.floor(p*3)));steps.forEach((s,i)=>s.classList.toggle('active',i===b));dots.forEach((d,i)=>d.classList.toggle('on',i===b));}
  ScrollTrigger.create({
    trigger:'.ritual',start:'top top',end:()=>'+='+(innerHeight*3),
    pin:'#ritualStage',scrub:.5,anticipatePin:1,invalidateOnRefresh:true,
    onUpdate:self=>{target.progress=self.progress;setBeat(self.progress);}
  });

  // Render loop
  let visible=false,raf;
  new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible&&!document.hidden){raf=requestAnimationFrame(render);}else cancelAnimationFrame(raf);}).observe(stage);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(visible)raf=requestAnimationFrame(render);});

  function render(){
    t+=0.016;
    cur+=(target.progress-cur)*.08;
    vel+=((Math.abs(cur-lastP)*40)-vel)*.1;lastP=cur;
    const mn = window.__mn?window.__mn():[0,0];

    // cámara orbita/dollea con el progreso + parallax de cursor
    const th=-0.5+cur*1.0, rad=4.5-cur*0.9, hy=1.7-cur*0.6;
    camera.position.set(CX+Math.sin(th)*rad + mn[0]*0.25, hy - mn[1]*0.2, Math.cos(th)*rad);
    camera.lookAt(CX,0.85,0);

    cup.rotation.y=0.25+cur*0.7+t*0.05;
    // color de la bebida
    coffeeMat.color.copy(drinkColor(cur));coffeeMat.emissive.copy(drinkColor(cur)).multiplyScalar(.12);

    // bokeh flotando
    bokeh.children.forEach(sp=>{sp.material.opacity=(.12+Math.sin(t*sp.userData.sp+sp.userData.ph)*.06);});

    // vapor: sube, se ondula, reacciona al scroll y al cursor
    const intensity=0.35+Math.min(vel,1.4);
    puffs.forEach(p=>{
      p.life+=0.0045+intensity*0.004;if(p.life>1)p.life-=1;
      const y=1.2+p.life*1.9;
      const sway=Math.sin(t*1.2+p.seed+p.life*4)*(0.18+p.life*0.15);
      p.m.position.set(p.x+sway+mn[0]*0.5*p.life, y, (Math.sin(p.seed)*.2));
      const sc=.35+p.life*1.2;p.m.scale.set(sc,sc,1);
      p.m.material.opacity=Math.sin(p.life*Math.PI)*0.5*intensity;
    });

    renderer.render(scene,camera);
    if(visible&&!document.hidden)raf=requestAnimationFrame(render);
  }
  // refresh de ScrollTrigger DESPUÉS de que el layout se asiente (fuentes/imágenes)
  function refresh(){resize();ScrollTrigger.refresh();renderer.render(scene,camera);}
  if(document.readyState==='complete'){setTimeout(refresh,300);}else{addEventListener('load',()=>setTimeout(refresh,300));}
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(()=>setTimeout(refresh,150));}
  setTimeout(refresh,1400); // respaldo
}
