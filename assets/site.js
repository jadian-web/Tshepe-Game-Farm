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
      ['boma','Spaces','The boma'],['pool','Spaces','Swimming pool'],['pool-deck','Spaces','Pool deck'],['bar-kitchen','Spaces','Kitchen and bar'],['lounge','Spaces','Lounge'],['dining','Spaces','Dining area'],['patio','Spaces','Patio lounge'],['clubhouse','Spaces','Clubhouse with pool table'],
      ['hero-dam','Land','Dams and farm roads'],['gazebo','Land','The gazebo deck'],['lily-dam','Land','Water lilies on the dam'],['cascade','Land','Stream over sandstone'],['gorge','Land','The gorge'],['cliffs','Land','Sandstone cliffs'],['acacia','Land','Acacia in the grassland'],['hills','Land','Towards the hills'],['stream','Land','The stream'],
      ['sable','Wildlife','Sable'],['wildebeest','Wildlife','Blue wildebeest'],['springbok','Wildlife','Springbok'],['zebra','Wildlife','Zebra and foal'],['giraffe','Wildlife','Giraffe'],['blesbok','Wildlife','Blesbok'],['springbok-herd','Wildlife','Springbok herd'],['sable-herd','Wildlife','Sable herd'],
      ['game-vehicle','Activities','Game vehicle'],['quads','Activities','Quad bikes'],['range','Activities','Indoor shooting range'],['range-lane','Activities','Range lane'],['game-drive','Activities','On a game drive'],['butchery','Activities','Butchery and slaughter room'],['clubhouse-ext','Activities','Clubhouse building']
    ];
    const cats=['All','Lodge','Spaces','Land','Wildlife','Activities'];
    const labels={All:'All',Lodge:'Lodge & rooms',Spaces:'Shared spaces',Land:'The land',Wildlife:'Wildlife',Activities:'Activities & hunting'};
    let view=G.slice();
    const render=c=>{view=c==='All'?G.slice():G.filter(g=>g[1]===c);gal.innerHTML=view.map((g,i)=>`<button type="button" data-i="${i}" aria-label="View larger: ${g[2]}"><img src="img/${g[0]}.jpg" alt="${g[2]}" loading="lazy"><span>${g[2]}</span></button>`).join('');};
    const start=cats.find(c=>'#'+c.toLowerCase()===location.hash)||'All';
    cats.forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=labels[c];b.setAttribute('aria-pressed',c===start);b.addEventListener('click',()=>{[...fl.children].forEach(x=>x.setAttribute('aria-pressed',x===b));render(c);});fl.appendChild(b);});
    render(start);
    const lb=$('lb'),lbImg=$('lbImg'),lbCap=$('lbCap');let li=0,lastFocus;
    const show=i=>{li=(i+view.length)%view.length;const g=view[li];lbImg.src='img/'+g[0]+'.jpg';lbImg.alt=g[2];lbCap.textContent=g[2]+'  ·  '+(li+1)+' / '+view.length;};
    gal.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;lastFocus=b;show(+b.dataset.i);lb.hidden=false;document.body.style.overflow='hidden';$('lbClose').focus();});
    const close=()=>{lb.hidden=true;document.body.style.overflow='';lastFocus&&lastFocus.focus();};
    $('lbClose').addEventListener('click',close);$('lbPrev').addEventListener('click',()=>show(li-1));$('lbNext').addEventListener('click',()=>show(li+1));
    lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-stage'))close();});
    addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(li-1);if(e.key==='ArrowRight')show(li+1);});
  }

  /* copy helper */
  function copy(t,btn){const o=btn.textContent;const done=ok=>{btn.textContent=ok?'Copied':'Select to copy';setTimeout(()=>btn.textContent=o,1800);};try{navigator.clipboard.writeText(t).then(()=>done(true),()=>done(false));}catch(_){done(false);}}
  document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copy(b.dataset.copy,b)));

  /* planner (plan your stay page) */
  const form=$('planner');
  if(form){
    const presets={family:['st1',['a1','a7']],friends:['st2',[]],celebration:['st3',[]],team:['st4',['a10']],hunting:['st5',['a8','a5']],'hunting-family':['st6',['a8','a1']]};
    const applyHash=()=>{const p=presets[location.hash.slice(1)];if(!p)return;$(p[0]).checked=true;p[1].forEach(id=>$(id).checked=true);};
    applyHash();addEventListener('hashchange',applyHash);
    let guests=8;const gOut=$('gOut'),gNote=$('gNote'),pm=$('planMap');
    const upd=()=>{gOut.textContent=guests;$('gMinus').disabled=guests<=1;$('gPlus').disabled=guests>=16;bedMap(pm,guests);
      const rooms=Math.min(7,Math.ceil(Math.min(guests,14)/2));
      gNote.textContent=guests>14?`All seven bedrooms plus the open loft for ${guests-14} guest${guests>15?'s':''}. This is the maximum the lodge sleeps.`:guests===14?'All seven bedrooms, sharing. Two more can join in the open loft.':`About ${rooms} of the 7 bedrooms, sharing.`;};
    $('gMinus').addEventListener('click',()=>{if(guests>1){guests--;upd();}});
    $('gPlus').addEventListener('click',()=>{if(guests<16){guests++;upd();}});
    upd();
    const fmt=v=>v?new Date(v+'T00:00').toLocaleDateString('en-ZA',{weekday:'short',day:'numeric',month:'long',year:'numeric'}):'Flexible';
    const st=$('status');
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const name=$('name').value.trim(),phone=$('phone').value.trim(),a=$('arrive').value,d=$('depart').value;
      if(!name||phone.replace(/\D/g,'').length<9){st.className='status err';st.textContent='Add your name and a contact number so Marius can reply.';($('name').value.trim()?$('phone'):$('name')).focus();return;}
      if(a&&d&&d<=a){st.className='status err';st.textContent='Choose a departure date after your arrival date.';$('depart').focus();return;}
      const acts=[...form.querySelectorAll('input[name=act]:checked')].map(x=>x.value);
      const nights=a&&d?Math.round((new Date(d)-new Date(a))/864e5):null;
      const L=[`Hi Marius, I'd like to enquire about a stay at Tshepe Game Farm.`,``,
        `Name: ${name}`,`Contact: ${phone}`+($('email').value.trim()?` / ${$('email').value.trim()}`:''),
        `Type of stay: ${form.querySelector('input[name=stay]:checked').value}`,
        `Dates: ${fmt(a)} to ${fmt(d)}`+(nights?` (${nights} night${nights>1?'s':''})`:''),
        `Overnight guests: ${guests}`+(guests>14?' (open loft needed)':''),
        `Single beds preferred: ${$('singles').checked?'Yes':'No'}`,
        `Interested in: ${acts.length?acts.join(', '):'Not sure yet'}`];
      if($('msg').value.trim())L.push(`Notes: ${$('msg').value.trim()}`);
      const m=L.join('\n');$('waText').textContent=m;$('waLink').href='https://wa.me/27826107583?text='+encodeURIComponent(m);
      $('result').hidden=false;st.className='status';st.textContent='Your message is ready below.';
      $('result').scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
    });
    $('copyMsg').addEventListener('click',e=>copy($('waText').textContent,e.currentTarget));
  }
})();
