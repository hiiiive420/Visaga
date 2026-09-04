
const intro = document.querySelector('#intro');
const one = document.querySelector('#one');
const st = document.querySelector('#st');
const copy = document.querySelector('#anniversaryCopy');
const msg = document.querySelector('#introMessage');
const flare = document.querySelector('#flare');
const skip = document.querySelector('#skip');
const canvas = document.querySelector('#burst');
const ctx = canvas.getContext('2d');

let particles=[], shockwaves=[], frame=0, finished=false;

function fit(){
  const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;
  canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
fit();addEventListener('resize',fit);

function burst(){
  flare.classList.add('pop');
  const cx=innerWidth/2,cy=innerHeight/2-20;
  const gold=['#fff8db','#f5e0a3','#d4af37','#c5a059','#e6c687','#ffffff'];
  shockwaves=[
    {r:10,max:Math.max(innerWidth,innerHeight)*.9,a:.9,c:'#f3e5c8'},
    {r:10,max:Math.max(innerWidth,innerHeight)*.7,a:.6,c:'#d4af37'}
  ];
  for(let i=0;i<35;i++){
    const a=Math.PI*2*i/35+(Math.random()-.5)*.4,s=4+Math.random()*9;
    particles.push({t:'r',x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2.5,w:3.5+Math.random()*3,h:18+Math.random()*25,c:gold[Math.floor(Math.random()*gold.length)],rot:Math.random()*6.28,vr:(Math.random()-.5)*.15,o:1,d:.005+Math.random()*.006,wob:Math.random()*6.28});
  }
  for(let i=0;i<75;i++){
    const a=Math.random()*Math.PI*2,s=3+Math.random()*11;
    particles.push({t:'c',x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,w:4+Math.random()*5,h:4+Math.random()*6,c:gold[Math.floor(Math.random()*gold.length)],rot:Math.random()*6.28,vr:(Math.random()-.5)*.25,o:1,d:.007+Math.random()*.007,wob:Math.random()*6.28});
  }
  for(let i=0;i<90;i++){
    const a=Math.random()*Math.PI*2,s=1.5+Math.random()*7;
    particles.push({t:'d',x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,w:1+Math.random()*2,c:Math.random()>.4?'#fffbd4':'#fff',rot:0,vr:0,o:.9,d:.009+Math.random()*.008,wob:0});
  }
  if(!frame) draw();
}
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  const cx=innerWidth/2,cy=innerHeight/2-20;
  shockwaves.forEach(s=>{
    if(s.a>.01){
      ctx.save();ctx.beginPath();ctx.arc(cx,cy,s.r,0,Math.PI*2);ctx.strokeStyle=s.c;ctx.lineWidth=2.5*s.a;ctx.globalAlpha=s.a;ctx.shadowColor='#ffdf78';ctx.shadowBlur=18;ctx.stroke();ctx.restore();
      s.r+=(s.max-s.r)*.065+4;s.a*=.94;
    }
  });
  particles=particles.filter(p=>p.o>0);
  for(const p of particles){
    p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.vx*=.98;p.rot+=p.vr;p.o-=p.d;p.wob+=.08;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=Math.max(0,p.o);
    if(p.t==='r'){
      const q=Math.sin(p.wob);ctx.fillStyle=p.c;ctx.shadowColor='#d4af37';ctx.shadowBlur=6;ctx.beginPath();ctx.ellipse(0,0,p.w*Math.abs(q)+1,p.h/2,0,0,Math.PI*2);ctx.fill();
    }else if(p.t==='c'){
      const q=Math.cos(p.wob);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2*q,-p.h/2,p.w*Math.abs(q),p.h);
    }else{
      ctx.fillStyle=p.c;ctx.shadowColor='#fff';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(0,0,p.w,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  if(particles.length||shockwaves.some(s=>s.a>.01)) frame=requestAnimationFrame(draw);
  else{cancelAnimationFrame(frame);frame=0}
}
function finish(skipAnimation=false){
  if(finished)return;finished=true;
  if(skipAnimation)intro.classList.add('hide');
  else{intro.classList.add('reveal-out');setTimeout(()=>intro.classList.add('hide'),900)}
  document.body.style.overflow='';
  sessionStorage.setItem('syas-intro-seen','1');
  setTimeout(()=>document.body.classList.add('ready'),skipAnimation?50:650);
}
document.body.style.overflow='hidden';

if(sessionStorage.getItem('syas-intro-seen')||matchMedia('(prefers-reduced-motion:reduce)').matches){
  finish(true);
}else{
  setTimeout(()=>{one.classList.add('show');st.classList.add('show')},500);
  setTimeout(()=>copy.classList.add('show'),1200);
  setTimeout(()=>{msg.classList.add('show');burst()},2000);
  setTimeout(()=>finish(false),3600);
}
skip.addEventListener('click',()=>finish(true));

const hero=document.querySelector('#hero');
const canAnimateHero=hero&&matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches;
if(canAnimateHero){
  let pointerFrame=0;
  hero.addEventListener('pointermove',event=>{
    if(pointerFrame)return;
    pointerFrame=requestAnimationFrame(()=>{
      pointerFrame=0;
      const rect=hero.getBoundingClientRect();
      const x=((event.clientX-rect.left)/rect.width-.5)*6;
      const y=((event.clientY-rect.top)/rect.height-.5)*4;
      hero.style.setProperty('--hero-x',x.toFixed(2)+'px');
      hero.style.setProperty('--hero-y',y.toFixed(2)+'px');
    });
  });
  hero.addEventListener('pointerleave',()=>{
    hero.style.setProperty('--hero-x','0px');
    hero.style.setProperty('--hero-y','0px');
  });
}

if(hero&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  let scrollFrame=0;
  const updateHeroScroll=()=>{
    scrollFrame=0;
    const rect=hero.getBoundingClientRect();
    const progress=Math.min(1,Math.max(0,-rect.top/Math.max(1,rect.height)));
    hero.style.setProperty('--hero-scroll',(progress*18).toFixed(2)+'px');
    hero.style.setProperty('--hero-glow-scroll',(progress*8).toFixed(2)+'px');
  };
  addEventListener('scroll',()=>{
    if(!scrollFrame)scrollFrame=requestAnimationFrame(updateHeroScroll);
  },{passive:true});
  updateHeroScroll();
}

const revealEls=[...document.querySelectorAll('.reveal')];
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})
},{threshold:.13});
revealEls.forEach(el=>io.observe(el));
