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
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.14;
  const scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x180f09,0.018);
  const camera=new THREE.PerspectiveCamera(38,1,.1,100);
  const CX=-0.75; // desplazar taza a la izquierda (texto va a la derecha)

  // Environment map: gradiente cálido procedural → reflejos realistas en cerámica y café
  const pmrem=new THREE.PMREMGenerator(renderer);pmrem.compileEquirectangularShader();
  (function(){
    const cv=document.createElement('canvas');cv.width=512;cv.height=256;const x=cv.getContext('2d');
    const g=x.createLinearGradient(0,0,0,256);
    g.addColorStop(0,'#4a3826');g.addColorStop(.35,'#2a1c12');g.addColorStop(.6,'#17100a');g.addColorStop(1,'#080604');
    x.fillStyle=g;x.fillRect(0,0,512,256);
    const rg=x.createRadialGradient(360,66,0,360,66,130);rg.addColorStop(0,'rgba(255,214,156,.95)');rg.addColorStop(1,'rgba(255,214,156,0)');
    x.fillStyle=rg;x.fillRect(0,0,512,256);
    const rg2=x.createRadialGradient(120,92,0,120,92,95);rg2.addColorStop(0,'rgba(255,176,104,.5)');rg2.addColorStop(1,'rgba(255,176,104,0)');
    x.fillStyle=rg2;x.fillRect(0,0,512,256);
    const tex=new THREE.CanvasTexture(cv);tex.mapping=THREE.EquirectangularReflectionMapping;
    scene.environment=pmrem.fromEquirectangular(tex).texture;tex.dispose();
  })();

  function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}

  // Grupo de la taza
  const cup=new THREE.Group();cup.position.x=CX;scene.add(cup);

  // Cerámica oscura tipo stoneware (refleja el env)
  const ceramic=new THREE.MeshStandardMaterial({color:0x4a3d33,roughness:.4,metalness:0,envMapIntensity:1.35,side:THREE.DoubleSide});
  const prof=[[0,0],[.55,0],[.62,.05],[.86,1.25],[.865,1.31],[.80,1.31],[.745,1.20],[.60,.15],[0,.15]].map(p=>new THREE.Vector2(p[0],p[1]));
  const body=new THREE.Mesh(new THREE.LatheGeometry(prof,96),ceramic);cup.add(body);
  // Asa
  const handle=new THREE.Mesh(new THREE.TorusGeometry(.30,.082,20,40,Math.PI*1.3),ceramic);
  handle.position.set(.85,.70,0);handle.rotation.z=-0.32;cup.add(handle);
  // Superficie de café — acabado líquido brillante (color se transforma)
  const coffeeMat=new THREE.MeshStandardMaterial({color:0x0a0705,roughness:.55,metalness:0,emissive:0x1c0d05,envMapIntensity:.12});
  const coffee=new THREE.Mesh(new THREE.CircleGeometry(.735,64),coffeeMat);
  coffee.rotation.x=-Math.PI/2;coffee.position.y=1.185;cup.add(coffee);
  // Platito
  const saucer=new THREE.Mesh(new THREE.CylinderGeometry(1.18,1.06,.055,72),new THREE.MeshStandardMaterial({color:0x2c2926,roughness:.5,metalness:0,envMapIntensity:.7}));
  saucer.position.y=-0.03;cup.add(saucer);
  // Sombra de contacto
  const shTex=(function(){const cv=document.createElement('canvas');cv.width=cv.height=128;const x=cv.getContext('2d');const g=x.createRadialGradient(64,64,4,64,64,64);g.addColorStop(0,'rgba(0,0,0,.6)');g.addColorStop(.65,'rgba(0,0,0,.2)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128);const t=new THREE.Texture(cv);t.needsUpdate=true;return t;})();
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(3.6,3.6),new THREE.MeshBasicMaterial({map:shTex,transparent:true,depthWrite:false,opacity:.85,fog:false}));
  shadow.rotation.x=-Math.PI/2;shadow.position.y=-0.062;cup.add(shadow);

  // Luces (frontales para cerámica oscura, calibradas para ACES + env)
  scene.add(new THREE.HemisphereLight(0xffe0b8,0x140c07,.35));
  scene.add(new THREE.AmbientLight(0x201308,.25));
  const key=new THREE.DirectionalLight(0xffe2b4,2.0);key.position.set(2.6,3.6,3.0);scene.add(key);
  const fill=new THREE.DirectionalLight(0xffcf9a,.6);fill.position.set(-2.5,1.2,2.6);scene.add(fill);
  const rim=new THREE.DirectionalLight(0xffb264,1.6);rim.position.set(-2.8,2.4,-3);scene.add(rim);
  const rim2=new THREE.DirectionalLight(0xff9d54,1.1);rim2.position.set(2.6,1.6,-2.6);scene.add(rim2);
  // Halo cálido detrás de la taza para que la cerámica resalte del fondo oscuro
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex('rgba(255,190,120,.95)'),transparent:true,blending:THREE.AdditiveBlending,opacity:.5,depthWrite:false,fog:false}));
  halo.position.set(CX,0.7,-1.2);halo.scale.set(3.0,3.0,1);halo.material.opacity=.45;scene.add(halo);

  // Bokeh cálido de fondo
  const bokehTex=softTex('rgba(255,205,150,.9)');
  const bokeh=new THREE.Group();scene.add(bokeh);
  for(let i=0;i<9;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:bokehTex,transparent:true,blending:THREE.AdditiveBlending,opacity:.12+Math.random()*.16,depthWrite:false}));
    sp.position.set((Math.random()-.5)*8,(Math.random()-.2)*4.5,-2-Math.random()*3);const s=.6+Math.random()*1.6;sp.scale.set(s,s,1);sp.userData={sp:.1+Math.random()*.2,ph:Math.random()*7};bokeh.add(sp);}

  // Vapor
  const steamTex=softTex('rgba(255,255,255,.9)');
  const steam=new THREE.Group();steam.position.x=CX;scene.add(steam);
  const puffs=[];
  for(let i=0;i<30;i++){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:steamTex,transparent:true,blending:THREE.AdditiveBlending,opacity:0,depthWrite:false}));
    steam.add(m);const p={m,seed:Math.random()*7,x:(Math.random()-.5)*.7,life:Math.random()};puffs.push(p);m.scale.set(.5,.5,1);}

  // Estado
  const target={progress:0};let cur=0,lastP=0,vel=0,t=0;
  const C0=new THREE.Color(0x1c0d05),C1=new THREE.Color(0xcaa46e),C2=new THREE.Color(0x86bd4e);
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

  function updateFrame(){
    t+=0.016;
    cur+=(target.progress-cur)*.08;
    vel+=((Math.abs(cur-lastP)*40)-vel)*.1;lastP=cur;
    const mn = window.__mn?window.__mn():[0,0];

    // cámara casi FIJA mirando dentro de la taza (para que se luzca el cambio de bebida)
    const th=-0.32, rad=3.15-cur*0.12, hy=2.02;
    camera.position.set(CX+Math.sin(th)*rad + mn[0]*0.18, hy - mn[1]*0.14, Math.cos(th)*rad);
    camera.lookAt(CX,0.96,0);

    // la taza solo se inclina un poco a lo largo del scroll + micro-movimiento vivo
    cup.rotation.y=0.16+cur*0.26+Math.sin(t*0.3)*0.03;
    cup.rotation.z=Math.sin(t*0.5)*0.02;
    cup.rotation.x=0.02+cur*0.06;
    const bob=Math.sin(t*0.7)*0.02; cup.position.y=bob; steam.position.y=bob;
    // color de la bebida (por emisión → negro se ve negro, matcha se ve verde)
    coffeeMat.emissive.copy(drinkColor(cur)).multiplyScalar(.92);

    // bokeh flotando
    bokeh.children.forEach(sp=>{sp.material.opacity=(.12+Math.sin(t*sp.userData.sp+sp.userData.ph)*.06);});

    // vapor: sube, se ondula, reacciona al scroll y al cursor
    const intensity=0.35+Math.min(vel,1.4);
    puffs.forEach(p=>{
      p.life+=0.0045+intensity*0.004;if(p.life>1)p.life-=1;
      const y=1.24+p.life*1.7;
      const sway=Math.sin(t*1.2+p.seed+p.life*4)*(0.12+p.life*0.2);
      p.m.position.set(p.x*0.6+sway+mn[0]*0.5*p.life, y, (Math.sin(p.seed)*.18));
      const sc=.18+p.life*0.7;p.m.scale.set(sc,sc,1);
      p.m.material.opacity=Math.sin(p.life*Math.PI)*0.32*intensity;
    });

    renderer.render(scene,camera);
  }
  function render(){ updateFrame(); if(visible&&!document.hidden)raf=requestAnimationFrame(render); }
  window.__C={updateFrame,setP:p=>{cur=p;target.progress=p;}};
  // refresh de ScrollTrigger DESPUÉS de que el layout se asiente (fuentes/imágenes)
  function refresh(){resize();ScrollTrigger.refresh();updateFrame();}
  if(document.readyState==='complete'){setTimeout(refresh,300);}else{addEventListener('load',()=>setTimeout(refresh,300));}
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(()=>setTimeout(refresh,150));}
  setTimeout(refresh,1400); // respaldo
}
