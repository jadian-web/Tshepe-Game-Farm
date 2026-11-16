/* Tshepe Game Farm — shared site script (v7). No third-party code, no network calls. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store={ /* browser storage can be blocked: never let it break the page */
    get(k){try{return localStorage.getItem(k);}catch(_){return null;}},
    set(k,v){try{localStorage.setItem(k,v);}catch(_){}},
    del(k){try{localStorage.removeItem(k);}catch(_){}}
  };

  /* ---------- cookie / storage consent ---------- */
  const CONSENT='tshepe-consent', PICKS='tshepe-interests';
  const consent=()=>{try{return (JSON.parse(store.get(CONSENT)||'null')||{}).choice||null;}catch(_){return null;}};
  const banner=$('cookie');
  const showBanner=()=>{if(banner){banner.hidden=false;}};
  const setConsent=choice=>{
    store.set(CONSENT,JSON.stringify({choice,date:new Date().toISOString().slice(0,10)}));
    if(choice!=='all')store.del(PICKS);
    if(banner)banner.hidden=true;
    document.dispatchEvent(new CustomEvent('consentchange'));
  };
  if(banner){
    banner.querySelectorAll('[data-consent]').forEach(b=>b.addEventListener('click',()=>setConsent(b.dataset.consent)));
    if(!consent())showBanner();
  }
  document.querySelectorAll('[data-cookie-settings]').forEach(b=>b.addEventListener('click',()=>{showBanner();const f=banner&&banner.querySelector('button');f&&f.focus();}));

  /* ---------- header + mobile action bar ---------- */
  const head=$('head'), mbar=$('mbar');
  let ticking=false;
  const paint=()=>{ticking=false;const y=scrollY;head&&head.classList.toggle('solid',y>60);mbar&&mbar.classList.toggle('show',y>innerHeight*.6);};
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(paint);}},{passive:true});
  requestAnimationFrame(paint);
  const mb=$('menuBtn'), dr=$('drawer');
  if(mb){
    const setMenu=o=>{dr.hidden=!o;mb.setAttribute('aria-expanded',String(o));mb.querySelector('span').textContent=o?'CLOSE':'MENU';};
    mb.addEventListener('click',()=>setMenu(dr.hidden));
    dr.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
    addEventListener('keydown',e=>{if(e.key==='Escape'&&!dr.hidden){setMenu(false);mb.focus();}});
  }

  /* ---------- hero slideshow (home): later slides load after the page ---------- */
  const slides=[...document.querySelectorAll('.slide')], dots=$('dots');
  const hydrate=s=>s.querySelectorAll('[data-srcset],[data-src]').forEach(el=>{
    if(el.dataset.srcset){el.srcset=el.dataset.srcset;el.removeAttribute('data-srcset');}
    if(el.dataset.src&&!el.srcset){el.src=el.dataset.src;}
    el.removeAttribute('data-src');
  });
  if(slides.length&&dots){
    let cur=0,timer;
    const go=i=>{hydrate(slides[i]);hydrate(slides[(i+1)%slides.length]);slides[cur].classList.remove('on');dots.children[cur].setAttribute('aria-current','false');cur=i;slides[cur].classList.add('on');dots.children[cur].setAttribute('aria-current','true');};
    const restart=()=>{clearInterval(timer);if(!reduce)timer=setInterval(()=>go((cur+1)%slides.length),7000);};
    slides.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML='<span class="lbl">'+s.dataset.label+'</span>';b.setAttribute('aria-label','Show photo: '+s.dataset.label);b.setAttribute('aria-current',i===0);b.addEventListener('click',()=>{go(i);restart();});dots.appendChild(b);});
    const warm=()=>setTimeout(()=>hydrate(slides[1]),reduce?0:4000);
    if(document.readyState==='complete')warm();else addEventListener('load',warm);
    restart();
  }

  /* ---------- audience tabs (home) ---------- */
  const tabs=[...document.querySelectorAll('[role=tab]')];
  const sel=t=>tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;$(x.getAttribute('aria-controls')).hidden=!on;});
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>sel(t));t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];sel(n);n.focus();e.preventDefault();}});});

  /* ---------- photo rails ---------- */
  document.querySelectorAll('[data-rail]').forEach(wrap=>{
    const rail=wrap.querySelector('.land-rail');const step=()=>rail.clientWidth*.66;
    wrap.querySelector('[data-prev]').addEventListener('click',()=>rail.scrollBy({left:-step(),behavior:reduce?'auto':'smooth'}));
    wrap.querySelector('[data-next]').addEventListener('click',()=>rail.scrollBy({left:step(),behavior:reduce?'auto':'smooth'}));
  });

  /* ---------- gallery + lightbox ---------- */
  const gal=$('gal'), fl=$('filters');
  if(gal){
    const G=[
      ['hero-aerial','Lodge','The lodge from above'],['lodge-front','Lodge','The lodge and chalets'],['bed-2','Lodge','A double bedroom'],['bed-1','Lodge','Bedroom'],['bed-3','Lodge','Bedroom with sitting area'],['bathroom','Lodge','Private bathroom'],['bath-tub','Lodge','Freestanding bath'],['chalet','Lodge','Chalet deck'],['lodge-path','Lodge','Arriving at the lodge'],
      ['boma','Spaces','The boma'],['pool','Spaces','Swimming pool'],['pool-deck','Spaces','Pool deck'],['bar-kitchen','Spaces','Dining and braai room'],['lounge','Spaces','Lounge'],['dining','Spaces','Dining area'],['patio','Spaces','Patio lounge'],['clubhouse','Spaces','Clubhouse with pool table'],
      ['hero-dam','Land','Dams and farm roads'],['gazebo','Land','The gazebo deck'],['lily-dam','Land','Water lilies on the dam'],['cascade','Land','Stream over sandstone'],['gorge','Land','The gorge'],['cliffs','Land','Sandstone cliffs'],['acacia','Land','Acacia in the grassland'],['hills','Land','Towards the hills'],['stream','Land','The stream'],
      ['sable','Wildlife','Sable'],['wildebeest','Wildlife','Blue wildebeest'],['springbok','Wildlife','Springbok'],['zebra','Wildlife','Zebra and foal'],['giraffe','Wildlife','Giraffe'],['blesbok','Wildlife','Blesbok'],['springbok-herd','Wildlife','Springbok herd'],['sable-herd','Wildlife','Sable herd'],
      ['game-vehicle','Activities','Game vehicle'],['quads','Activities','Quad bikes'],['range','Activities','Underground shooting range'],['range-lane','Activities','Range lane, up to 100 m'],['game-drive','Activities','On a game drive'],['butchery','Activities','Butchery and slaughter room'],['clubhouse-ext','Activities','Farm facilities building']
    ];
    const V={"hero-aerial": [800, 1200, 1600, 2400], "hero-dam": [800, 1200, 1600, 2400], "hero-river": [800, 1200, 1600, 2400], "hero-gorge": [800, 1200, 1600, 2400], "lodge-front": [800, 1200, 1600, 2400], "boma": [800, 1200, 1600, 2400], "boma-close": [800, 1200, 1600, 2400], "pool": [800, 1200, 1600, 2400], "pool-deck": [800, 1200, 1600], "lodge-path": [800, 1200, 1600], "patio": [800, 1200, 1600], "bar-kitchen": [800, 1200, 1600], "lounge": [800, 1200, 1600], "bathroom": [800, 1200, 1600], "bed-1": [800, 1200, 1600], "bed-2": [800, 1200, 1600], "bed-3": [800, 1200, 1600], "dining": [800, 1200, 1600], "bath-tub": [800, 1200], "chalet": [800, 1200, 1600], "game-drive": [800, 1200], "lily-dam": [800, 1200, 1600, 2400], "gazebo": [800, 1200, 1600, 2400], "gazebo-dam": [800, 1200, 1600, 2400], "stream": [800, 1200, 1600], "cascade": [800, 1200, 1600], "gorge": [800, 1200, 1600], "weir": [800, 1200, 1600], "hills": [800, 1200, 1600], "acacia": [800, 1200, 1600], "track": [800, 1200, 1600, 2400], "river": [800, 1200, 1600], "cliffs": [800, 1200, 1600], "aerial-weir": [800, 1200, 1600], "causeway": [800, 1200, 1600], "sable": [800, 1200, 1600, 2400], "springbok-herd": [800, 1200, 1600, 2400], "sable-herd": [800, 1200, 1600], "springbok": [800, 1200, 1600, 2400], "wildebeest": [800, 1200, 1600, 2400], "zebra": [800, 1200, 1600], "giraffe": [800, 1200, 1600], "blesbok": [800, 1200, 1600], "sable-rest": [800, 1200, 1600], "wildebeest-plain": [800, 1200, 1600, 2400], "quads": [800, 1200, 1600], "game-vehicle": [800, 1200, 1600], "range": [800, 1200, 1600], "range-lane": [800, 1200, 1600], "clubhouse": [800, 1200, 1600], "butchery": [800, 1200, 1600], "clubhouse-ext": [800, 1200, 1600]};
    const base=n=>Math.min(1600,Math.max(...V[n]));
    const SS=(n,ext)=>(V[n]||[]).map(w=>`img/${n}${w===base(n)?'':'-'+w}.${ext} ${w}w`).join(', ');
    const cats=['All','Lodge','Spaces','Land','Wildlife','Activities'];
    const labels={All:'All',Lodge:'Lodge & rooms',Spaces:'Shared spaces',Land:'The land',Wildlife:'Wildlife',Activities:'Activities & hunting'};
    const SIZES='(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw';
    let view=G.slice();
    const render=c=>{view=c==='All'?G.slice():G.filter(g=>g[1]===c);gal.innerHTML=view.map((g,i)=>`<button type="button" data-i="${i}" aria-label="View larger: ${g[2]}"><picture><source type="image/webp" srcset="${SS(g[0],'webp')}" sizes="${SIZES}"><img src="img/${g[0]}.jpg" srcset="${SS(g[0],'jpg')}" sizes="${SIZES}" alt="" loading="lazy" decoding="async"></picture><span aria-hidden="true">${g[2]}</span></button>`).join('');};
    const start=cats.find(c=>'#'+c.toLowerCase()===location.hash)||'All';
    cats.forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=labels[c];b.setAttribute('aria-pressed',c===start);b.addEventListener('click',()=>{[...fl.children].forEach(x=>x.setAttribute('aria-pressed',x===b));render(c);});fl.appendChild(b);});
    render(start);
    const lb=$('lb'),lbImg=$('lbImg'),lbCap=$('lbCap');let li=0,lastFocus;
    const show=i=>{li=(i+view.length)%view.length;const g=view[li];lbImg.srcset=SS(g[0],'jpg');lbImg.sizes='100vw';lbImg.src='img/'+g[0]+'.jpg';lbImg.alt=g[2];lbCap.textContent=g[2]+'  ·  '+(li+1)+' / '+view.length;};
    gal.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;lastFocus=b;show(+b.dataset.i);lb.hidden=false;document.body.style.overflow='hidden';$('lbClose').focus();});
    const close=()=>{lb.hidden=true;document.body.style.overflow='';lastFocus&&lastFocus.focus();};
    $('lbClose').addEventListener('click',close);$('lbPrev').addEventListener('click',()=>show(li-1));$('lbNext').addEventListener('click',()=>show(li+1));
    lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-stage'))close();});
    addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(li-1);if(e.key==='ArrowRight')show(li+1);
      if(e.key==='Tab'){const f=[...lb.querySelectorAll('button')];const a=document.activeElement;if(e.shiftKey&&a===f[0]){f[f.length-1].focus();e.preventDefault();}else if(!e.shiftKey&&a===f[f.length-1]){f[0].focus();e.preventDefault();}}});
  }

  /* ---------- copy helper ---------- */
  function copy(t,btn){const o=btn.textContent;const done=ok=>{btn.textContent=ok?'Copied':'Select to copy';setTimeout(()=>btn.textContent=o,1800);};try{navigator.clipboard.writeText(t).then(()=>done(true),()=>done(false));}catch(_){done(false);}}
  document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copy(b.dataset.copy,b)));

  /* ---------- enquiry interests (Experiences → Plan) ----------
     Saved on the device only with consent; otherwise kept in memory and handed over in the link. */
  const VALID=['a1','a2','a3','a4','a5','a6','a7','a8','a9','a10'];
  let memPicks=[];
  const readPicks=()=>{if(consent()==='all'){try{const v=JSON.parse(store.get(PICKS)||'[]');return Array.isArray(v)?v.filter(x=>VALID.includes(x)):[];}catch(_){return [];}}return memPicks.slice();};
  const writePicks=v=>{memPicks=v.slice();if(consent()==='all')store.set(PICKS,JSON.stringify(v));};
  const pickBtns=[...document.querySelectorAll('.pick')];
  if(pickBtns.length){
    const picksBar=$('picks'),picksList=$('picksList'),picksLink=picksBar&&picksBar.querySelector('a');
    const sync=()=>{const p=readPicks();
      pickBtns.forEach(b=>{const on=p.includes(b.dataset.act);b.setAttribute('aria-pressed',on);b.lastChild.textContent=on?'Added to my enquiry':'Add to my enquiry';});
      const labels=[...new Set(pickBtns.filter(b=>p.includes(b.dataset.act)).map(b=>b.dataset.label))];
      picksBar.hidden=!labels.length;picksList.textContent=labels.join(', ');
      if(picksLink)picksLink.href='plan.html'+(p.length?'?acts='+p.join(','):'');};
    pickBtns.forEach(b=>b.addEventListener('click',()=>{let p=readPicks();const a=b.dataset.act;p=p.includes(a)?p.filter(x=>x!==a):[...p,a];writePicks(p);sync();}));
    document.addEventListener('consentchange',()=>{if(consent()==='all')store.set(PICKS,JSON.stringify(memPicks));sync();});
    sync();
  }

  /* ---------- planner (Plan your stay) ---------- */
  const form=$('planner');
  if(form){
    const result=$('result'),st=$('status'),waLink=$('waLink'),waText=$('waText');
    const WA='https://wa.me/27826107583';
    const todaySA=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Johannesburg',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    const arrive=$('arrive'),depart=$('depart');
    arrive.min=todaySA;depart.min=todaySA;
    const loadedAt=Date.now();

    /* presets from page links (#family, #team, #hunting…), ?acts= hand-over and saved interests */
    const presets={family:['st1',['a1','a7']],friends:['st2',[]],celebration:['st3',[]],team:['st4',['a10']],hunting:['st5',['a8','a5']],'hunting-family':['st6',['a8','a1']]};
    const applyHash=()=>{const p=presets[location.hash.slice(1)];if(!p)return;$(p[0]).checked=true;p[1].forEach(id=>$(id).checked=true);};
    applyHash();addEventListener('hashchange',applyHash);
    const fromLink=(new URLSearchParams(location.search).get('acts')||'').split(',').filter(x=>VALID.includes(x));
    [...new Set([...readPicks(),...fromLink])].forEach(id=>{const el=$(id);if(el)el.checked=true;});
    form.querySelectorAll('input[name=act]').forEach(cb=>cb.addEventListener('change',()=>writePicks([...form.querySelectorAll('input[name=act]:checked')].map(x=>x.id))));

    /* guests */
    let guests=8;const gOut=$('gOut'),gNote=$('gNote');
    const upd=()=>{gOut.textContent=guests;$('gMinus').disabled=guests<=1;$('gPlus').disabled=guests>=16;
      gNote.textContent=guests>=16?'16 is the maximum number of overnight guests.':'Up to 16 overnight guests. We\'ll confirm room allocation with you.';};
    $('gMinus').addEventListener('click',()=>{if(guests>1){guests--;upd();invalidate();}});
    $('gPlus').addEventListener('click',()=>{if(guests<16){guests++;upd();invalidate();}});
    upd();

    /* dates: fixed or flexible */
    const flexible=()=>$('dm2').checked;
    const syncDates=()=>{$('dateFields').hidden=flexible();$('flexFields').hidden=!flexible();if(flexible()){setErr(arrive,'');setErr(depart,'');}};
    form.querySelectorAll('input[name=datemode]').forEach(r=>r.addEventListener('change',syncDates));
    arrive.addEventListener('change',()=>{depart.min=arrive.value&&arrive.value>todaySA?arrive.value:todaySA;});

    /* validation: checked when a field is left, then live once an error shows, and again on submit */
    const NAME=/^[\p{L}][\p{L}\p{M} .'’-]{1,79}$/u, EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, PHONE_CHARS=/^\+?[0-9 ()-]+$/;
    const clean=v=>v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').trim();
    function setErr(el,msg){const e=$(el.id+'Err');if(e)e.textContent=msg;el.setAttribute('aria-invalid',msg?'true':'false');el.classList.toggle('ok',!msg&&!!el.value);}
    const rules={
      name:()=>{const v=clean($('name').value);if(!v)return'Enter your name.';return NAME.test(v)?'':'Enter your name using letters only.';},
      phone:()=>{const v=clean($('phone').value);if(!v)return'Enter a contact number.';const d=v.replace(/\D/g,'');if(!PHONE_CHARS.test(v)||d.length<9||d.length>15)return'Enter a valid contact number, for example 082 123 4567 or +27 82 123 4567.';return'';},
      email:()=>{const v=clean($('email').value);return !v||EMAIL.test(v)?'':'Enter a valid email address, or leave it blank.';},
      arrive:()=>{if(flexible())return'';const v=arrive.value;if(!v)return'Choose an arrival date, or select "My dates are flexible".';return v<todaySA?'Choose an arrival date of today or later.':'';},
      depart:()=>{if(flexible())return'';const v=depart.value;if(!v)return'Choose a departure date.';return arrive.value&&v<=arrive.value?'Choose a departure date after your arrival date.':'';}
    };
    Object.keys(rules).forEach(id=>{const el=$(id);
      el.addEventListener('blur',()=>{if(el.value||el.getAttribute('aria-invalid')==='true')setErr(el,rules[id]());});
      el.addEventListener('input',()=>{if(el.getAttribute('aria-invalid')==='true')setErr(el,rules[id]());});
      el.addEventListener('change',()=>{if(el.getAttribute('aria-invalid')==='true'||el.type==='date')setErr(el,rules[id]());});
    });
    const msgEl=$('msg'),msgCount=$('msgCount');
    if(msgEl&&msgCount)msgEl.addEventListener('input',()=>{const left=1000-msgEl.value.length;msgCount.textContent=left<200?`${left} characters left.`:'Up to 1,000 characters.';});

    /* a prepared message must never outlive the details it was built from */
    function invalidate(){
      if(result.hidden)return;
      result.hidden=true;waText.textContent='';waLink.href=WA;
      st.className='status warn';st.textContent='Your details have changed. Prepare your message again before opening WhatsApp.';
    }
    form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);

    /* spam guard: hidden honeypot, minimum fill time and a limit on repeated messages */
    const recent=[];
    const spamCheck=()=>{
      if($('website')&&$('website').value)return'Something went wrong. Please refresh the page and try again.';
      if(Date.now()-loadedAt<3000)return'Please take a moment to check your details, then try again.';
      const now=Date.now();while(recent.length&&now-recent[0]>10*60*1000)recent.shift();
      if(recent.length>=5)return'You have prepared several messages in a short time. Please wait a few minutes, or contact us directly on WhatsApp.';
      return'';
    };

    const fmt=v=>new Date(v+'T00:00').toLocaleDateString('en-ZA',{weekday:'short',day:'numeric',month:'long',year:'numeric'});
    form.addEventListener('submit',e=>{
      e.preventDefault();
      let first=null;
      ['name','phone','email','arrive','depart'].forEach(id=>{const msg=rules[id]();setErr($(id),msg);if(msg&&!first)first=$(id);});
      if(first){st.className='status err';st.textContent='Please check the highlighted details.';first.focus();return;}
      const spam=spamCheck();if(spam){st.className='status err';st.textContent=spam;return;}
      recent.push(Date.now());
      const acts=[...form.querySelectorAll('input[name=act]:checked')].map(x=>x.value);
      let dates;
      if(flexible()){const w=clean($('when').value).slice(0,120);dates='Flexible'+(w?` (${w})`:'');}
      else{const n=Math.round((new Date(depart.value)-new Date(arrive.value))/864e5);dates=`${fmt(arrive.value)} to ${fmt(depart.value)} (${n} night${n>1?'s':''})`;}
      const email=clean($('email').value),notes=clean(msgEl.value).slice(0,1000);
      const L=[`Hi, I'd like to enquire about a stay at Tshepe Game Farm.`,``,
        `Name: ${clean($('name').value)}`,`Contact: ${clean($('phone').value)}`+(email?` / ${email}`:''),
        `Type of stay: ${form.querySelector('input[name=stay]:checked').value}`,
        `Dates: ${dates}`,
        `Overnight guests: ${guests}`,
        `Interested in: ${acts.length?acts.join(', '):'Not sure yet'}`];
      if(notes)L.push(`Notes: ${notes}`);
      const m=L.join('\n');waText.textContent=m;waLink.href=WA+'?text='+encodeURIComponent(m);
      result.hidden=false;st.className='status';st.textContent='Your message is ready below.';
      result.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
    });
    $('copyMsg').addEventListener('click',e=>copy(waText.textContent,e.currentTarget));
  }
})();
