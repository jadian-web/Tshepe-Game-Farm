(function(){
  const $=id=>document.getElementById(id);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header + mobile bar */
  const head=$('head'), mbar=$('mbar');
  const onScroll=()=>{const y=scrollY;head&&head.classList.toggle('solid',y>60);mbar&&mbar.classList.toggle('show',y>innerHeight*.6);};
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  const mb=$('menuBtn'), dr=$('drawer');
  if(mb){
    const setMenu=o=>{dr.hidden=!o;mb.setAttribute('aria-expanded',String(o));mb.querySelector('span').textContent=o?'CLOSE':'MENU';};
    mb.addEventListener('click',()=>setMenu(dr.hidden));
    dr.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
  }

  /* hero slideshow (home) */
  const slides=[...document.querySelectorAll('.slide')], dots=$('dots');
  if(slides.length&&dots){
    let cur=0,timer;
    const go=i=>{slides[cur].classList.remove('on');dots.children[cur].setAttribute('aria-current','false');cur=i;slides[cur].classList.add('on');dots.children[cur].setAttribute('aria-current','true');};
    const restart=()=>{clearInterval(timer);if(!reduce)timer=setInterval(()=>go((cur+1)%slides.length),7000);};
    slides.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML='<span class="lbl">'+s.dataset.label+'</span>';b.setAttribute('aria-label','Show photo: '+s.dataset.label);b.setAttribute('aria-current',i===0);b.addEventListener('click',()=>{go(i);restart();});dots.appendChild(b);});
    restart();
  }

  /* audience tabs (home) */
  const tabs=[...document.querySelectorAll('[role=tab]')];
  const sel=t=>tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;$(x.getAttribute('aria-controls')).hidden=!on;});
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>sel(t));t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];sel(n);n.focus();e.preventDefault();}});});

  /* bed maps */
  function bedMap(el,n){
    let h='';for(let r=0;r<7;r++){const a=n>r*2,b=n>r*2+1;h+=`<div class="room"><span>Room ${r+1}</span><span class="pp"><i class="${a?'f':''}"></i><i class="${b?'f':''}"></i></span></div>`;}
    h+=`<div class="room loft"><span>Loft</span><span class="pp"><i class="${n>14?'f':''}"></i><i class="${n>15?'f':''}"></i></span></div>`;el.innerHTML=h;
  }
  document.querySelectorAll('[data-bedmap]').forEach(el=>bedMap(el,+el.dataset.bedmap));

  /* photo rails */
  document.querySelectorAll('[data-rail]').forEach(wrap=>{
    const rail=wrap.querySelector('.land-rail');const step=()=>rail.clientWidth*.66;
    wrap.querySelector('[data-prev]').addEventListener('click',()=>rail.scrollBy({left:-step(),behavior:reduce?'auto':'smooth'}));
    wrap.querySelector('[data-next]').addEventListener('click',()=>rail.scrollBy({left:step(),behavior:reduce?'auto':'smooth'}));
  });

  /* gallery + lightbox */
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
    const SS=n=>(V[n]||[]).map(w=>`img/${n}${w===Math.min(1600,Math.max(...V[n]))?'':'-'+w}.jpg ${w}w`).join(', ');
    const cats=['All','Lodge','Spaces','Land','Wildlife','Activities'];
    const labels={All:'All',Lodge:'Lodge & rooms',Spaces:'Shared spaces',Land:'The land',Wildlife:'Wildlife',Activities:'Activities & hunting'};
    let view=G.slice();
    const render=c=>{view=c==='All'?G.slice():G.filter(g=>g[1]===c);gal.innerHTML=view.map((g,i)=>`<button type="button" data-i="${i}" aria-label="View larger: ${g[2]}"><img src="img/${g[0]}.jpg" srcset="${SS(g[0])}" sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" alt="${g[2]}" loading="lazy"><span>${g[2]}</span></button>`).join('');};
    const start=cats.find(c=>'#'+c.toLowerCase()===location.hash)||'All';
    cats.forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=labels[c];b.setAttribute('aria-pressed',c===start);b.addEventListener('click',()=>{[...fl.children].forEach(x=>x.setAttribute('aria-pressed',x===b));render(c);});fl.appendChild(b);});
    render(start);
    const lb=$('lb'),lbImg=$('lbImg'),lbCap=$('lbCap');let li=0,lastFocus;
    const show=i=>{li=(i+view.length)%view.length;const g=view[li];lbImg.srcset=SS(g[0]);lbImg.sizes='100vw';lbImg.src='img/'+g[0]+'.jpg';lbImg.alt=g[2];lbCap.textContent=g[2]+'  ·  '+(li+1)+' / '+view.length;};
    gal.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;lastFocus=b;show(+b.dataset.i);lb.hidden=false;document.body.style.overflow='hidden';$('lbClose').focus();});
    const close=()=>{lb.hidden=true;document.body.style.overflow='';lastFocus&&lastFocus.focus();};
    $('lbClose').addEventListener('click',close);$('lbPrev').addEventListener('click',()=>show(li-1));$('lbNext').addEventListener('click',()=>show(li+1));
    lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-stage'))close();});
    addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(li-1);if(e.key==='ArrowRight')show(li+1);});
  }

  /* copy helper */
  function copy(t,btn){const o=btn.textContent;const done=ok=>{btn.textContent=ok?'Copied':'Select to copy';setTimeout(()=>btn.textContent=o,1800);};try{navigator.clipboard.writeText(t).then(()=>done(true),()=>done(false));}catch(_){done(false);}}
  document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copy(b.dataset.copy,b)));

  /* enquiry interests (Experiences → Plan), per-visitor convenience only */
  const KEY='tshepe-interests';
  const readPicks=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch(_){return [];}};
  const writePicks=v=>{try{localStorage.setItem(KEY,JSON.stringify(v));}catch(_){}};
  const pickBtns=[...document.querySelectorAll('.pick')];
  if(pickBtns.length){
    const picksBar=$('picks'),picksList=$('picksList');
    const sync=()=>{const p=readPicks();
      pickBtns.forEach(b=>{const on=p.includes(b.dataset.act);b.setAttribute('aria-pressed',on);b.lastChild.textContent=on?'Added to my enquiry':'Add to my enquiry';});
      const labels=[...new Set(pickBtns.filter(b=>p.includes(b.dataset.act)).map(b=>b.dataset.label))];
      picksBar.hidden=!labels.length;picksList.textContent=labels.join(', ');};
    pickBtns.forEach(b=>b.addEventListener('click',()=>{let p=readPicks();const a=b.dataset.act;p=p.includes(a)?p.filter(x=>x!==a):[...p,a];writePicks(p);sync();}));
    sync();
  }

  /* planner (plan your stay page) */
  const form=$('planner');
  if(form){
    const result=$('result'),st=$('status'),waLink=$('waLink'),waText=$('waText');
    const WA='https://wa.me/27826107583';
    const todaySA=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Johannesburg',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    const arrive=$('arrive'),depart=$('depart');
    arrive.min=todaySA;depart.min=todaySA;

    /* presets from page links (#family, #team, #hunting…) and saved interests */
    const presets={family:['st1',['a1','a7']],friends:['st2',[]],celebration:['st3',[]],team:['st4',['a10']],hunting:['st5',['a8','a5']],'hunting-family':['st6',['a8','a1']]};
    const applyHash=()=>{const p=presets[location.hash.slice(1)];if(!p)return;$(p[0]).checked=true;p[1].forEach(id=>$(id).checked=true);};
    applyHash();addEventListener('hashchange',applyHash);
    readPicks().forEach(id=>{const el=$(id);if(el)el.checked=true;});
    form.querySelectorAll('input[name=act]').forEach(cb=>cb.addEventListener('change',()=>{const ids=[...form.querySelectorAll('input[name=act]:checked')].map(x=>x.id);writePicks(ids);}));

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

    /* field validation: on leaving a field, then live once an error shows */
    function setErr(el,msg){const e=$(el.id+'Err');if(e)e.textContent=msg;el.setAttribute('aria-invalid',msg?'true':'false');el.classList.toggle('ok',!msg&&!!el.value);}
    const rules={
      name:()=>$('name').value.trim()?'':'Enter your name.',
      phone:()=>$('phone').value.replace(/\D/g,'').length>=9?'':'Enter a contact number, including the area or mobile code.',
      arrive:()=>{if(flexible())return'';const v=arrive.value;if(!v)return'Choose an arrival date, or select "My dates are flexible".';return v<todaySA?'Choose an arrival date of today or later.':'';},
      depart:()=>{if(flexible())return'';const v=depart.value;if(!v)return'Choose a departure date.';return arrive.value&&v<=arrive.value?'Choose a departure date after your arrival date.':'';}
    };
    Object.keys(rules).forEach(id=>{const el=$(id);
      el.addEventListener('blur',()=>{if(el.value||el.getAttribute('aria-invalid')==='true')setErr(el,rules[id]());});
      el.addEventListener('input',()=>{if(el.getAttribute('aria-invalid')==='true')setErr(el,rules[id]());});
      el.addEventListener('change',()=>{if(el.getAttribute('aria-invalid')==='true'||el.type==='date')setErr(el,rules[id]());});
    });

    /* a prepared message must never outlive the details it was built from */
    function invalidate(){
      if(result.hidden)return;
      result.hidden=true;waText.textContent='';waLink.href=WA;
      st.className='status warn';st.textContent='Your details have changed. Prepare your message again before opening WhatsApp.';
    }
    form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);

    const fmt=v=>new Date(v+'T00:00').toLocaleDateString('en-ZA',{weekday:'short',day:'numeric',month:'long',year:'numeric'});
    form.addEventListener('submit',e=>{
      e.preventDefault();
      let first=null;
      ['name','phone','arrive','depart'].forEach(id=>{const msg=rules[id]();setErr($(id),msg);if(msg&&!first)first=$(id);});
      if(first){st.className='status err';st.textContent='Please check the highlighted details.';first.focus();return;}
      const acts=[...form.querySelectorAll('input[name=act]:checked')].map(x=>x.value);
      let dates;
      if(flexible()){const w=$('when').value.trim();dates='Flexible'+(w?` (${w})`:'');}
      else{const n=Math.round((new Date(depart.value)-new Date(arrive.value))/864e5);dates=`${fmt(arrive.value)} to ${fmt(depart.value)} (${n} night${n>1?'s':''})`;}
      const email=$('email').value.trim();
      const L=[`Hi, I'd like to enquire about a stay at Tshepe Game Farm.`,``,
        `Name: ${$('name').value.trim()}`,`Contact: ${$('phone').value.trim()}`+(email?` / ${email}`:''),
        `Type of stay: ${form.querySelector('input[name=stay]:checked').value}`,
        `Dates: ${dates}`,
        `Overnight guests: ${guests}`,
        `Interested in: ${acts.length?acts.join(', '):'Not sure yet'}`];
      if($('msg').value.trim())L.push(`Notes: ${$('msg').value.trim()}`);
      const m=L.join('\n');waText.textContent=m;waLink.href=WA+'?text='+encodeURIComponent(m);
      result.hidden=false;st.className='status';st.textContent='Your message is ready below.';
      result.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
    });
    $('copyMsg').addEventListener('click',e=>copy(waText.textContent,e.currentTarget));
  }
})();
