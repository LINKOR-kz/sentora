(function(){
'use strict';

var WA = '77002505208';
var DELIVERY = 1700;
var VOLS = [3,5,10,15,20];
var DEFAULT_ML = 5;

var CATALOG = [
  {id:'khamrah-qahwa',brand:'Lattafa',name:'Khamrah Qahwa',cat:'arabic',desc:'Пряный · кофейный · сладкий',top:'Имбирь · корица · кардамон',heart:'Пралине · засахаренные фрукты · белые цветы',base:'Кофе · ваниль · бобы тонка · бензоин',tags:['Пряные','Кофейные','Сладкие','Ванильные'],prices:{3:1000,5:1500,10:2200,15:3100,20:4000}},
  {id:'fakhar-black',brand:'Lattafa',name:'Fakhar Black',cat:'arabic',desc:'Ароматический · свежий · древесный',top:'Яблоко · бергамот · имбирь',heart:'Лаванда · шалфей · ягоды можжевельника',base:'Бобы тонка · амбра · кедр · ветивер',tags:['Свежие','Древесные'],prices:{3:1100,5:1600,10:2200,15:3100,20:4000}},
  {id:'asad-bourbon',brand:'Lattafa',name:'Asad Bourbon',cat:'arabic',desc:'Пряный · тёплый · ванильный',top:'Розовый перец · лаванда · слива мирабель',heart:'Какао · давана · мускатный орех',base:'Ваниль · амбра · ветивер',tags:['Пряные','Ванильные','Сладкие'],prices:{3:1000,5:1500,10:2400,15:3400,20:4400}},
  {id:'bade-al-oud-glory',brand:'Lattafa',name:'Bade al Oud for Glory',cat:'arabic',desc:'Уд · специи · древесные ноты',top:'Шафран · мускатный орех · лаванда',heart:'Уд · пачули',base:'Уд · пачули · мускус',tags:['Удовые','Пряные','Древесные'],prices:{3:1200,5:1700,10:2700,15:3800,20:4900}},
  {id:'hawas-fire',brand:'Rasasi',name:'Hawas Fire',cat:'arabic',desc:'Яркий · фруктовый · пряный',top:'Бергамот · лимон · фруктовые аккорды',heart:'Специи · жасмин · морские аккорды',base:'Амбра · древесные ноты · мускус',tags:['Фруктовые','Пряные','Сладкие'],prices:{3:1400,5:2000,10:3000,15:4300,20:5500}},
  {id:'hawas-ice',brand:'Rasasi',name:'Hawas Ice',cat:'arabic',desc:'Свежий · прохладный · акватический',top:'Яблоко · лимон · бергамот',heart:'Морские ноты · слива · апельсиновый цвет',base:'Мускус · амбра · древесные ноты',tags:['Свежие','Акватические','Цитрусовые'],prices:{3:1300,5:1900,10:2800,15:4000,20:5100}},
  {id:'afnan-9pm',brand:'Afnan',name:'9PM',cat:'arabic',desc:'Сладкий · фруктовый · вечерний',top:'Яблоко · корица · лаванда · бергамот',heart:'Апельсиновый цвет · ландыш',base:'Ваниль · бобы тонка · амбра · пачули',tags:['Сладкие','Фруктовые','Ванильные'],prices:{3:1000,5:1500,10:2000,15:2800,20:3600}},
  {id:'cdn-intense-man',brand:'Armaf',name:'Club de Nuit Intense Man',cat:'arabic',desc:'Цитрусы · дымные ноты · древесина',top:'Лимон · ананас · бергамот · чёрная смородина',heart:'Берёза · жасмин · роза',base:'Мускус · амбра · пачули · ваниль',tags:['Цитрусовые','Древесные','Фруктовые'],prices:{3:1200,5:1800,10:3000,15:4300,20:5500}},
  {id:'le-male-le-parfum',brand:'Jean Paul Gaultier',name:'Le Male Le Parfum',cat:'european',desc:'Кардамон · лаванда · ваниль',top:'Кардамон',heart:'Лаванда · ирис',base:'Ваниль · древесные аккорды',tags:['Пряные','Ванильные','Сладкие'],prices:{3:1600,5:2400,10:4000,15:5700,20:7300}},
  {id:'le-beau-le-parfum',brand:'Jean Paul Gaultier',name:'Le Beau Le Parfum',cat:'european',desc:'Кокос · древесные ноты · бобы тонка',top:'Ананас · ирис · имбирь',heart:'Кокос · древесные аккорды',base:'Бобы тонка · сандал',tags:['Кокосовые','Древесные','Сладкие'],prices:{3:1900,5:2800,10:4700,15:6700,20:8600}},
  {id:'the-most-wanted',brand:'Azzaro',name:'The Most Wanted',cat:'european',desc:'Пряный · тёплый · сладкий',top:'Кардамон',heart:'Карамель · тёплые пряные ноты',base:'Амбра · древесные ноты',tags:['Пряные','Сладкие'],prices:{3:2000,5:3000,10:4800,15:6800,20:8700}},
  {id:'spicebomb-extreme',brand:'Viktor & Rolf',name:'Spicebomb Extreme',cat:'european',desc:'Табак · специи · ваниль',top:'Чёрный перец · шафран · грейпфрут',heart:'Корица · тмин · лаванда',base:'Табак · ваниль · амбра',tags:['Табачные','Пряные','Ванильные'],prices:{3:2000,5:3000,10:4800,15:6800,20:8700}},
  {id:'hedonistic',brand:'Clive Christian',name:'Hedonistic',cat:'european',desc:'Насыщенный · древесный · пряный',top:'Цитрусы · специи',heart:'Древесные ноты · ароматические аккорды',base:'Амбра · мускус · тёплая древесина',tags:['Древесные','Пряные'],prices:{3:3600,5:5300,10:10200,15:14500,20:18600}}
];
CATALOG.forEach(function(p){p.img='img/p/'+p.id+'.webp';p.ml=DEFAULT_ML;});

var NOTES = [
  ['Сладкие','#D9A77C'],['Свежие','#9FC3C2'],['Древесные','#8B6B4E'],['Пряные','#B5573B'],['Ванильные','#EAD7AE'],['Фруктовые','#C9707A'],
  ['Цитрусовые','#E3C35B'],['Акватические','#7FA4C4'],['Удовые','#4E3426'],['Табачные','#9A6A3C'],['Кофейные','#5E3F2C'],['Кокосовые','#EFE6D6']
];

var CUSTOM = (window.SENTORA_CUSTOM||[]).map(function(p,i){return {id:'c'+(i+1),cat:p.c,brand:p.b,name:p.n,price:p.p,notes:p.t,img:p.i,idx:i};});

/* ---------- helpers ---------- */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function money(n){return n.toLocaleString('ru-RU').replace(/ | /g,' ')+' ₸';}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function norm(s){return String(s).toLowerCase().replace(/ё/g,'е');}
function waLink(text){return 'https://wa.me/'+WA+(text?'?text='+encodeURIComponent(text):'');}
function openWa(text){window.open(waLink(text),'_blank','noopener');}
var icon=function(id){return '<svg><use href="#i-'+id+'"/></svg>';};

/* ---------- toast ---------- */
var toastEl=$('#toast'),toastT;
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('is-on');clearTimeout(toastT);toastT=setTimeout(function(){toastEl.classList.remove('is-on');},2200);}

/* ---------- header / menu ---------- */
var header=$('#header');
function onScroll(){header.classList.toggle('is-scrolled',window.scrollY>10);}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
var burger=$('#burger'),nav=$('#nav');
function setMenu(open){if(open)document.documentElement.style.setProperty('--nav-top',Math.round(header.getBoundingClientRect().bottom)+'px');burger.setAttribute('aria-expanded',open);nav.classList.toggle('is-open',open);document.body.classList.toggle('menu-open',open);}
burger.addEventListener('click',function(){setMenu(burger.getAttribute('aria-expanded')!=='true');});
$$('a',nav).forEach(function(a){a.addEventListener('click',function(){setMenu(false);});});
$('#year').textContent=new Date().getFullYear();

/* ---------- reveal ---------- */
var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.05}):null;
function observe(els){els.forEach(function(el,i){
  el.style.transitionDelay=Math.min(i%4*70,210)+'ms';
  var r=el.getBoundingClientRect();
  if(!io||(r.top<window.innerHeight&&r.bottom>0)){setTimeout(function(){el.classList.add('is-in');},40);return;}
  io.observe(el);
});}
observe($$('.reveal'));

/* ---------- cart ---------- */
var cart=[];
try{cart=JSON.parse(localStorage.getItem('sentora-cart-v2')||'[]');if(!Array.isArray(cart))cart=[];}catch(e){cart=[];}
function saveCart(){try{localStorage.setItem('sentora-cart-v2',JSON.stringify(cart));}catch(e){}renderCart();}
function cartQty(){return cart.reduce(function(s,i){return s+i.qty;},0);}
function cartSum(){return cart.reduce(function(s,i){return s+i.price*i.qty;},0);}
function addToCart(item){
  var key=item.id+'|'+item.ml;
  var ex=cart.filter(function(i){return i.key===key;})[0];
  if(ex)ex.qty++;else{item.key=key;item.qty=1;cart.push(item);}
  saveCart();
  var c=$('#cartCount');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump');
  toast('Добавлено: '+item.name+(item.mlLabel?' · '+item.mlLabel:''));
}
function renderCart(){
  var q=cartQty(),sum=cartSum();
  var cc=$('#cartCount');cc.textContent=q;cc.classList.toggle('has',q>0);
  var bar=$('#cartBar');
  if(q>0){bar.hidden=false;requestAnimationFrame(function(){bar.classList.add('is-visible');});}
  else{bar.classList.remove('is-visible');bar.hidden=true;}
  $('#cartBarCount').textContent=q+' шт';$('#cartBarSum').textContent=money(sum);
  $('#cartSum').textContent=money(sum);$('#cartTotal').textContent=money(sum+DELIVERY);
  $('#cartFoot').hidden=!q;
  var box=$('#cartItems');
  if(!q){box.innerHTML='<div class="cart-empty"><svg><use href="#i-bottle"/></svg><h4>Корзина пока пуста</h4><p>Выбери аромат и объём — мы соберём заказ за тебя.</p><a href="#catalog" class="btn btn--dark" data-close>Перейти к ароматам</a></div>';return;}
  box.innerHTML=cart.map(function(i,k){
    return '<div class="citem"><div class="citem__img'+(i.cover?' cover':'')+'"><img src="'+esc(i.img)+'" alt=""></div>'+
      '<div><p class="citem__brand">'+esc(i.brand)+'</p><p class="citem__name">'+esc(i.name)+'</p><p class="citem__meta">'+esc(i.mlLabel)+' · '+money(i.price)+'</p>'+
      '<div class="qty"><button data-dec="'+k+'" aria-label="Меньше">'+icon('minus')+'</button><span>'+i.qty+'</span><button data-inc="'+k+'" aria-label="Больше">'+icon('plus')+'</button></div></div>'+
      '<div class="citem__right"><span class="citem__price">'+money(i.price*i.qty)+'</span><button class="citem__rm" data-rm="'+k+'">Удалить</button></div></div>';
  }).join('');
}
$('#cartItems').addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  if(b.dataset.inc!=null){cart[+b.dataset.inc].qty++;}
  else if(b.dataset.dec!=null){var it=cart[+b.dataset.dec];it.qty--;if(it.qty<1)cart.splice(+b.dataset.dec,1);}
  else if(b.dataset.rm!=null){cart.splice(+b.dataset.rm,1);}
  else return;
  saveCart();
});
$('#checkout').addEventListener('click',function(){
  if(!cart.length)return;
  var lines=cart.map(function(i,n){return (n+1)+'. '+i.name+' ('+i.brand+') — '+i.mlLabel+' × '+i.qty+' = '+money(i.price*i.qty);});
  var msg='Здравствуйте! Хочу оформить заказ в Sentora Parfume:\n\n'+lines.join('\n')+'\n\nСумма за ароматы: '+money(cartSum())+'\nДоставка по Казахстану: '+money(DELIVERY)+'\nИтого: '+money(cartSum()+DELIVERY)+'\n\nПодскажите, пожалуйста, по наличию.';
  openWa(msg);
});

/* ---------- overlays ---------- */
var lastFocus=null;
function openLayer(el){lastFocus=document.activeElement;el.classList.add('is-open');el.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';var f=$('[data-close].icon-btn',el);if(f)setTimeout(function(){f.focus();},50);}
function closeLayer(el){el.classList.remove('is-open');el.setAttribute('aria-hidden','true');if(!$('.drawer.is-open, .modal.is-open'))document.body.style.overflow='';if(lastFocus&&lastFocus.focus)lastFocus.focus();}
$$('.drawer,.modal').forEach(function(l){l.addEventListener('click',function(e){if(e.target.closest('[data-close]'))closeLayer(l);});});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){$$('.drawer.is-open,.modal.is-open').forEach(closeLayer);setMenu(false);}});
var cartEl=$('#cart');
$('#cartOpen').addEventListener('click',function(){openLayer(cartEl);});
$('#cartBar').addEventListener('click',function(){openLayer(cartEl);});

/* ---------- catalog ---------- */
var state={cat:'all',brand:'all',note:null,q:'',sort:'default'};
var grid=$('#catGrid');
var brands=[];CATALOG.forEach(function(p){if(brands.indexOf(p.brand)<0)brands.push(p.brand);});
$('#brandSel').insertAdjacentHTML('beforeend',brands.map(function(b){return '<option value="'+esc(b)+'">'+esc(b)+'</option>';}).join(''));
$('#noteChips').innerHTML='<button class="chip is-active" data-note="">Любые ноты</button>'+NOTES.map(function(n){return '<button class="chip" data-note="'+n[0]+'">'+n[0]+'</button>';}).join('');
$('#moodChips').innerHTML=NOTES.slice(0,6).concat([NOTES[8],NOTES[9]]).map(function(n){
  var c=CATALOG.filter(function(p){return p.tags.indexOf(n[0])>=0;}).length;
  return '<button class="mood-chip" data-note="'+n[0]+'"><i style="--c:'+n[1]+'"></i>'+n[0]+' <small>'+c+'</small></button>';
}).join('');

function volsHtml(p){return VOLS.map(function(v){return '<button class="vol'+(v===p.ml?' is-active':'')+'" data-ml="'+v+'" aria-label="'+v+' мл">'+v+'<small>мл</small></button>';}).join('');}
function cardHtml(p){
  return '<article class="card reveal" data-id="'+p.id+'">'+
    '<button class="card__img" data-open aria-label="Подробнее: '+esc(p.name)+'"><img src="'+p.img+'" alt="'+esc(p.brand+' '+p.name)+' — флакон" loading="lazy"><span class="card__tag">'+(p.cat==='arabic'?'Оригинал':'Аналог')+'</span><span class="card__peek">Пирамида нот</span></button>'+
    '<div class="card__body"><p class="card__brand">'+esc(p.brand)+'</p><h3 class="card__name">'+esc(p.name)+'</h3><p class="card__desc">'+esc(p.desc)+'</p>'+
    (p.cat==='european'?'<span class="badge">Аналог, не оригинал</span>':'')+
    '<div class="vols">'+volsHtml(p)+'</div>'+
    '<div class="card__foot"><span class="price" data-price>'+money(p.prices[p.ml])+'<small>/ '+p.ml+' мл</small></span>'+
    '<div class="card__btns"><button class="add" data-add>'+icon('plus')+'В корзину</button><button class="wa-mini" data-wa aria-label="Заказать в WhatsApp">'+icon('wa')+'</button></div></div></div></article>';
}
function filtered(){
  var q=norm(state.q.trim());
  var list=CATALOG.filter(function(p){
    if(state.cat!=='all'&&p.cat!==state.cat)return false;
    if(state.brand!=='all'&&p.brand!==state.brand)return false;
    if(state.note&&p.tags.indexOf(state.note)<0)return false;
    if(q){var hay=norm([p.brand,p.name,p.desc,p.top,p.heart,p.base,p.tags.join(' ')].join(' '));if(q.split(/\s+/).some(function(w){return hay.indexOf(w)<0;}))return false;}
    return true;
  });
  if(state.sort!=='default')list=list.slice().sort(function(a,b){return state.sort==='asc'?a.prices[3]-b.prices[3]:b.prices[3]-a.prices[3];});
  return list;
}
function plural(n,a,b,c){var m=n%10,h=n%100;return (m===1&&h!==11)?a:(m>=2&&m<=4&&(h<10||h>=20))?b:c;}
function renderCatalog(){
  var list=filtered();
  grid.innerHTML=list.map(cardHtml).join('');
  $('#catEmpty').hidden=list.length>0;
  $('#catCount').textContent=list.length?'Найдено '+list.length+' '+plural(list.length,'аромат','аромата','ароматов'):'';
  observe($$('.card',grid));
}
function getP(id){return CATALOG.filter(function(p){return p.id===id;})[0];}
function itemFrom(p){return {id:p.id,name:p.name,brand:p.brand,img:p.img,ml:p.ml,mlLabel:p.ml+' мл',price:p.prices[p.ml]};}
function orderMsg(p){return 'Здравствуйте! Хочу заказать в Sentora Parfume:\n'+p.name+' ('+p.brand+') — '+p.ml+' мл, '+money(p.prices[p.ml])+'\n\nПодскажите, пожалуйста, по наличию и доставке.';}
function flashDone(btn){btn.classList.add('is-done');var html=btn.innerHTML;btn.innerHTML='✓ Добавлено';setTimeout(function(){btn.classList.remove('is-done');btn.innerHTML=html;},1300);}

grid.addEventListener('click',function(e){
  var card=e.target.closest('.card');if(!card)return;var p=getP(card.dataset.id);
  var vol=e.target.closest('.vol');
  if(vol){p.ml=+vol.dataset.ml;$$('.vol',card).forEach(function(v){v.classList.toggle('is-active',v===vol);});$('[data-price]',card).innerHTML=money(p.prices[p.ml])+'<small>/ '+p.ml+' мл</small>';return;}
  var add=e.target.closest('[data-add]');if(add){addToCart(itemFrom(p));flashDone(add);return;}
  if(e.target.closest('[data-wa]')){openWa(orderMsg(p));return;}
  if(e.target.closest('[data-open]')){openProduct(p);}
});
function setTab(container,attr,val){$$('.tab',container).forEach(function(t){t.classList.toggle('is-active',t.dataset[attr]===val);});}
function setNote(n){state.note=n||null;$$('#noteChips .chip').forEach(function(c){c.classList.toggle('is-active',(c.dataset.note||null)===state.note);});}
$('#catTabs').addEventListener('click',function(e){var t=e.target.closest('.tab');if(!t)return;state.cat=t.dataset.cat;setTab(this,'cat',state.cat);renderCatalog();});
$('#noteChips').addEventListener('click',function(e){var c=e.target.closest('.chip');if(!c)return;setNote(c.dataset.note);renderCatalog();});
$('#brandSel').addEventListener('change',function(){state.brand=this.value;renderCatalog();});
$('#sortSel').addEventListener('change',function(){state.sort=this.value;renderCatalog();});
var st;$('#catSearch').addEventListener('input',function(){var v=this.value;clearTimeout(st);st=setTimeout(function(){state.q=v;renderCatalog();},150);});
function resetCatalog(){state={cat:'all',brand:'all',note:null,q:'',sort:'default'};setTab($('#catTabs'),'cat','all');setNote(null);$('#brandSel').value='all';$('#sortSel').value='default';$('#catSearch').value='';renderCatalog();}
$('#catReset').addEventListener('click',resetCatalog);
function goCatalog(){$('#catalog').scrollIntoView({behavior:'smooth'});}
$('#moodChips').addEventListener('click',function(e){var c=e.target.closest('.mood-chip');if(!c)return;resetCatalog();setNote(c.dataset.note);renderCatalog();goCatalog();});
$$('[data-jump]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();resetCatalog();state.cat=a.dataset.jump;setTab($('#catTabs'),'cat',state.cat);renderCatalog();goCatalog();});});
renderCatalog();

/* ---------- product modal ---------- */
var pm=$('#pmodal'),cur=null;
function renderPm(){
  $('#pmPrice').textContent=money(cur.prices[cur.ml]);$('#pmMl').textContent='за '+cur.ml+' мл';
  $('#pmVols').innerHTML=volsHtml(cur);
}
function openProduct(p){
  cur=p;$('#pmImg').src=p.img;$('#pmImg').alt=p.brand+' '+p.name;
  $('#pmBrand').textContent=p.brand;$('#pmName').textContent=p.name;$('#pmDesc').textContent=p.desc;
  $('#pmBadge').hidden=p.cat!=='european';
  $('#pmPyramid').innerHTML='<div><b>Верхние ноты</b><span>'+esc(p.top)+'</span></div><div><b>Ноты сердца</b><span>'+esc(p.heart)+'</span></div><div><b>Базовые ноты</b><span>'+esc(p.base)+'</span></div>';
  renderPm();openLayer(pm);
}
$('#pmVols').addEventListener('click',function(e){var v=e.target.closest('.vol');if(!v)return;cur.ml=+v.dataset.ml;renderPm();syncCard(cur);});
function syncCard(p){var card=$('.card[data-id="'+p.id+'"]');if(!card)return;$$('.vol',card).forEach(function(v){v.classList.toggle('is-active',+v.dataset.ml===p.ml);});$('[data-price]',card).innerHTML=money(p.prices[p.ml])+'<small>/ '+p.ml+' мл</small>';}
$('#pmAdd').addEventListener('click',function(){addToCart(itemFrom(cur));closeLayer(pm);});
$('#pmWa').addEventListener('click',function(){openWa(orderMsg(cur));});

/* ---------- custom order ---------- */
var cs={cat:'all',q:'',sort:'default',shown:12};
var STEP=12,cgrid=$('#customGrid');
$$('#customTabs .tab').forEach(function(t){var c=t.dataset.cat;$('.tab__n',t).textContent=c==='all'?CUSTOM.length:CUSTOM.filter(function(p){return p.cat===c;}).length;});
function cFiltered(){
  var q=norm(cs.q.trim());
  var list=CUSTOM.filter(function(p){
    if(cs.cat!=='all'&&p.cat!==cs.cat)return false;
    if(q){var hay=norm(p.brand+' '+p.name+' '+p.notes+' '+p.cat);if(q.split(/\s+/).some(function(w){return hay.indexOf(w)<0;}))return false;}
    return true;
  });
  if(cs.sort!=='default')list=list.slice().sort(function(a,b){return cs.sort==='asc'?a.price-b.price:b.price-a.price;});
  return list;
}
function shortCat(c){return c==='Европейские реплики'?'Реплика':c==='Арабские оригиналы'?'Оригинал':c==='Оригинал Европа'?'Оригинал Европа':c;}
function ccardHtml(p){
  return '<article class="ccard reveal" data-id="'+p.id+'"><div class="ccard__img"><img src="'+esc(p.img)+'" alt="Флакон парфюма '+esc(p.name)+'" loading="lazy"><span class="ccard__cat">'+esc(shortCat(p.cat))+'</span></div>'+
  '<div class="ccard__body"><p class="ccard__brand">'+esc(p.brand)+'</p><h3 class="ccard__name">'+esc(p.name)+'</h3><p class="ccard__notes">'+esc(p.notes)+'</p>'+
  '<div class="ccard__foot"><span class="ccard__price">'+money(p.price)+'</span><button class="add" data-add>'+icon('plus')+'В корзину</button></div></div></article>';
}
function renderCustom(append){
  var list=cFiltered(),slice=list.slice(0,cs.shown);
  if(append){var start=cgrid.children.length;cgrid.insertAdjacentHTML('beforeend',slice.slice(start).map(ccardHtml).join(''));observe($$('.ccard',cgrid).slice(start));}
  else{cgrid.innerHTML=slice.map(ccardHtml).join('');observe($$('.ccard',cgrid));}
  $('#customEmpty').hidden=list.length>0;
  var more=$('.more');more.hidden=list.length<=cs.shown;
  $('#customInfo').textContent='Показано '+Math.min(cs.shown,list.length)+' из '+list.length;
}
$('#customTabs').addEventListener('click',function(e){var t=e.target.closest('.tab');if(!t)return;cs.cat=t.dataset.cat;cs.shown=STEP;setTab(this,'cat',cs.cat);renderCustom();});
$('#customSort').addEventListener('change',function(){cs.sort=this.value;cs.shown=STEP;renderCustom();});
var cst;$('#customSearch').addEventListener('input',function(){var v=this.value;clearTimeout(cst);cst=setTimeout(function(){cs.q=v;cs.shown=STEP;renderCustom();},150);});
$('#customMore').addEventListener('click',function(){cs.shown+=STEP;renderCustom(true);});
cgrid.addEventListener('click',function(e){
  var add=e.target.closest('[data-add]');if(!add)return;
  var id=add.closest('.ccard').dataset.id,p=CUSTOM.filter(function(x){return x.id===id;})[0];
  addToCart({id:p.id,name:p.name,brand:p.brand,img:p.img,cover:true,ml:'bottle',mlLabel:'флакон под заказ',price:p.price});flashDone(add);
});
renderCustom();

/* ---------- rotating bottle carousel (hero) ---------- */
(function(){
  var stage=$('#stage'),wrap=$('#carousel');if(!stage||!wrap)return;
  var ids=['hawas-ice','spicebomb-extreme','le-male-le-parfum','bade-al-oud-glory','the-most-wanted','hawas-fire','le-beau-le-parfum','fakhar-black'];
  var items=ids.map(function(id){
    var p=getP(id),b=document.createElement('button');
    b.className='bottle';b.type='button';b.setAttribute('aria-label',p.brand+' '+p.name);
    b.innerHTML='<img src="img/cut/'+id+'.webp" alt="" draggable="false">';
    wrap.appendChild(b);return {el:b,p:p};
  });
  var N=items.length,step=Math.PI*2/N,angle=0,vel=0,auto=-0.0042;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var running=true,dragging=false,lastX=0,moved=0,front=-1,last=performance.now();
  var cap=$('.stage__caption',stage);
  function layout(){
    var W=stage.clientWidth,R=W*0.36,best=-2,bi=0;
    for(var i=0;i<N;i++){
      var t=angle+i*step,s=Math.sin(t),z=Math.cos(t),d=(z+1)/2;
      var sc=0.34+0.66*Math.pow(d,2);
      var x=s*R,y=-(1-d)*W*0.3;
      var ry=-s*38;
      var o=0.25+0.75*Math.pow(d,1.2);
      var it=items[i].el;
      it.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0) scale('+sc.toFixed(3)+') perspective(600px) rotateY('+ry.toFixed(1)+'deg)';
      it.style.opacity=o.toFixed(3);
      it.style.zIndex=Math.round(d*100);
      it.style.filter=d<0.55?'blur('+((0.55-d)*4).toFixed(1)+'px)':'none';
      if(z>best){best=z;bi=i;}
    }
    if(bi!==front){front=bi;var p=items[bi].p;
      $('#capBrand').textContent=p.brand;$('#capName').textContent=p.name;$('#capPrice').textContent='от '+money(p.prices[3])+' за 3 мл';
      cap.classList.remove('swap');void cap.offsetWidth;cap.classList.add('swap');}
  }
  function tick(now){
    var dt=Math.min(50,now-last);last=now;
    if(!dragging){
      if(Math.abs(vel)>0.00002){angle+=vel*dt;vel*=Math.pow(0.94,dt/16);}
      if(!reduce&&!stage.matches(':hover'))angle+=auto*dt/16*1.0;
      else if(!reduce&&stage.matches(':hover'))angle+=auto*dt/16*0.25;
    }
    layout();
    if(running)requestAnimationFrame(tick);
  }
  function start(){if(!running){running=true;last=performance.now();requestAnimationFrame(tick);}}
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){if(es[0].isIntersecting)start();else running=false;}).observe(stage);}
  document.addEventListener('visibilitychange',function(){if(document.hidden)running=false;else start();});
  stage.addEventListener('pointerdown',function(e){dragging=true;moved=0;lastX=e.clientX;vel=0;stage.classList.add('is-drag');try{stage.setPointerCapture(e.pointerId);}catch(_){}});
  stage.addEventListener('pointermove',function(e){if(!dragging)return;var dx=e.clientX-lastX;lastX=e.clientX;moved+=Math.abs(dx);var da=dx/(stage.clientWidth*0.37)*0.9;angle+=da;vel=da/16;});
  function end(e){if(!dragging)return;dragging=false;stage.classList.remove('is-drag');
    if(moved<6){var el=document.elementsFromPoint(e.clientX,e.clientY).filter(function(n){return n.classList&&n.classList.contains('bottle');})[0];
      var idx=el?items.map(function(x){return x.el;}).indexOf(el):-1;
      if(idx<0&&e.target.closest&&e.target.closest('.bottle'))idx=items.map(function(x){return x.el;}).indexOf(e.target.closest('.bottle'));
      if(idx===front)openProduct(items[idx].p);
      else if(idx>=0){var diff=-(idx*step+angle);diff=Math.atan2(Math.sin(diff),Math.cos(diff));vel=diff*0.06/16;}
    }}
  stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',function(){dragging=false;stage.classList.remove('is-drag');});
  stage.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.classList.contains('bottle')){var i=items.map(function(x){return x.el;}).indexOf(e.target);if(i>=0)openProduct(items[i].p);}});
  layout();requestAnimationFrame(tick);
})();

renderCart();
})();
