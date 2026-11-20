(function(){
'use strict';

/* Адрес сервера админки (Cloudflare Worker). */
var API = 'https://sentora-admin.sentora-admin-worker.workers.dev';
var DEMO = /[?&]demo\b/.test(location.search); // локальная проверка без сервера: admin.html?demo

var VOLS = [3,5,10,15,20];
var NOTES = ['Сладкие','Свежие','Древесные','Пряные','Ванильные','Фруктовые','Цитрусовые','Акватические','Удовые','Табачные','Кофейные','Кокосовые'];
var RASP_CATS = [['arabic','Арабский парфюм (оригинал)'],['european','Европейский аналог']];
var CUSTOM_CATS = ['Европейские реплики','Арабские оригиналы','Оригинал Европа'];
var TOKEN_KEY = 'sentora-admin-token';

var data = null, orig = '', sha = null, tab = 'rasp', imgCache = {};

/* ---------- helpers ---------- */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function money(n){return (+n||0).toLocaleString('ru-RU').replace(/ | /g,' ')+' ₸';}
function norm(s){return String(s||'').toLowerCase().replace(/ё/g,'е');}
function getToken(){try{return localStorage.getItem(TOKEN_KEY)||'';}catch(e){return '';}}
function setToken(t){try{if(t)localStorage.setItem(TOKEN_KEY,t);else localStorage.removeItem(TOKEN_KEY);}catch(e){}}
var toastT;
function toast(msg,err){var t=$('#toast');t.textContent=msg;t.classList.toggle('is-err',!!err);t.classList.add('is-on');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('is-on');},err?5000:3200);}
function imgSrc(p){return imgCache[p]||p||'';}
function slug(s){
  var map={а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'c',ч:'ch',ш:'sh',щ:'sh',ы:'y',э:'e',ю:'yu',я:'ya'};
  var out=String(s||'').toLowerCase().split('').map(function(c){return map[c]!=null?map[c]:c;}).join('').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);
  return (out||'item')+'-'+Math.random().toString(36).slice(2,6);
}

function api(path,opts){
  opts=opts||{};
  var h={'Content-Type':'application/json'};var t=getToken();if(t)h.Authorization='Bearer '+t;
  return fetch(API+path,{method:opts.method||'GET',headers:h,body:opts.body?JSON.stringify(opts.body):undefined})
    .then(function(r){return r.json().catch(function(){return {};}).then(function(j){
      if(r.status===401&&path!=='/login'){setToken('');showLogin('Сессия закончилась, войдите снова.');throw new Error('auth');}
      if(!r.ok)throw new Error(j.error||('Ошибка '+r.status));return j;});});
}

/* ---------- views ---------- */
function showLogin(msg){
  $('#appView').hidden=true;$('#headRight').hidden=true;$('#saveBar').hidden=true;$('#loginView').hidden=false;
  var e=$('#loginErr');e.hidden=!msg;e.textContent=msg||'';setTimeout(function(){$('#pw').focus();},50);
}
function showApp(){$('#loginView').hidden=true;$('#appView').hidden=false;$('#headRight').hidden=false;render();}

$('#loginForm').addEventListener('submit',function(e){
  e.preventDefault();var b=$('#loginBtn');b.disabled=true;b.textContent='Проверяем…';
  api('/login',{method:'POST',body:{password:$('#pw').value}})
    .then(function(j){setToken(j.token);$('#pw').value='';return load();})
    .catch(function(err){if(err.message!=='auth')showLogin(err.message==='Failed to fetch'?'Нет связи с сервером. Проверьте интернет.':err.message);})
    .finally(function(){b.disabled=false;b.textContent='Войти';});
});
$('#logout').addEventListener('click',function(){if(isDirty()&&!confirm('Есть несохранённые изменения. Всё равно выйти?'))return;setToken('');data=null;showLogin();});

function load(){
  if(DEMO){return fetch('data/products.json?t='+Date.now()).then(function(r){return r.json();}).then(function(d){setData(d,'demo');showApp();});}
  return api('/data').then(function(j){setData(j.data,j.sha);showApp();});
}
function setData(d,s){data=d;data.settings=data.settings||{delivery:1700};data.rasp=data.rasp||[];data.custom=data.custom||[];sha=s;orig=JSON.stringify(data);}
function isDirty(){return data&&JSON.stringify(data)!==orig;}

/* ---------- render ---------- */
function render(){
  $('#nRasp').textContent=data.rasp.length;$('#nCustom').textContent=data.custom.length;
  var u=data.meta&&data.meta.updated;$('#updatedInfo').textContent=u?'Последнее сохранение: '+new Date(u).toLocaleString('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'}):'';
  $$('.a-tab').forEach(function(t){t.classList.toggle('is-active',t.dataset.tab===tab);});
  $('#listView').hidden=tab==='settings';$('#settingsView').hidden=tab!=='settings';
  if(tab==='settings'){$('#setDelivery').value=data.settings.delivery;}
  else{$('#addBtn').textContent=tab==='rasp'?'＋ Добавить аромат':'＋ Добавить флакон';renderList();}
  $('#saveBar').hidden=!isDirty();
}
function arr(){return tab==='rasp'?data.rasp:data.custom;}
function renderList(){
  var q=norm($('#q').value.trim()),f=$('#filterSel').value,list=arr();
  var html=list.map(function(p,i){
    if(f==='visible'&&p.hidden)return '';if(f==='hidden'&&!p.hidden)return '';
    if(q&&norm(p.brand+' '+p.name).indexOf(q)<0)return '';
    var meta;
    if(tab==='rasp'){meta=VOLS.filter(function(v){return +p.prices[v]>0;}).map(function(v){return '<span style="white-space:nowrap">'+v+' мл <b>'+money(p.prices[v])+'</b></span>';}).join('');
      if(!meta)meta='<b style="color:var(--danger)">цены не указаны</b>';}
    else meta='<span>'+esc(p.cat)+'</span><b>'+money(p.price)+'</b>';
    return '<div class="a-row'+(p.hidden?' is-hidden':'')+'" data-i="'+i+'">'+
      '<div class="a-row__img'+(tab==='custom'?' cover':'')+'">'+(p.img?'<img src="'+esc(imgSrc(p.img))+'" alt="" loading="lazy">':'')+'</div>'+
      '<div><p class="a-row__brand">'+esc(p.brand)+'</p><p class="a-row__name">'+esc(p.name)+
        (p.hidden?'<span class="a-pill a-pill--off">скрыт</span>':'')+(p.featured?'<span class="a-pill a-pill--star">в карусели</span>':'')+'</p>'+
      '<div class="a-row__meta">'+meta+'</div></div>'+
      '<div class="a-row__act">'+
        '<button class="a-ic" data-act="up" title="Выше" aria-label="Выше">↑</button>'+
        '<button class="a-ic" data-act="down" title="Ниже" aria-label="Ниже">↓</button>'+
        '<button class="a-ic" data-act="hide" title="'+(p.hidden?'Показать на сайте':'Скрыть с сайта')+'" aria-label="Скрыть или показать">'+(p.hidden?'🙈':'👁')+'</button>'+
        '<button class="a-ic" data-act="del" title="Удалить" aria-label="Удалить">🗑</button>'+
        '<button class="a-ic a-ic--edit" data-act="edit" title="Изменить" aria-label="Изменить">✎<span class="lbl">Изменить</span></button>'+
      '</div></div>';
  }).join('');
  $('#list').innerHTML=html||'<p class="a-empty">Ничего не найдено.</p>';
}

$('#tabs').addEventListener('click',function(e){var t=e.target.closest('.a-tab');if(!t)return;tab=t.dataset.tab;$('#q').value='';render();});
$('#q').addEventListener('input',renderList);
$('#filterSel').addEventListener('change',renderList);
$('#setDelivery').addEventListener('input',function(){data.settings.delivery=Math.max(0,parseInt(this.value,10)||0);$('#saveBar').hidden=!isDirty();});
$('#list').addEventListener('click',function(e){
  var b=e.target.closest('[data-act]');if(!b)return;
  var i=+b.closest('.a-row').dataset.i,list=arr(),p=list[i];
  switch(b.dataset.act){
    case 'edit':openEditor(i);return;
    case 'hide':p.hidden=!p.hidden;toast(p.hidden?'Скрыт с сайта (после сохранения)':'Снова на сайте (после сохранения)');break;
    case 'del':if(!confirm('Удалить «'+p.name+'»? Его не будет на сайте после сохранения.'))return;list.splice(i,1);break;
    case 'up':if(i>0){list.splice(i-1,0,list.splice(i,1)[0]);}break;
    case 'down':if(i<list.length-1){list.splice(i+1,0,list.splice(i,1)[0]);}break;
  }
  render();
});
$('#addBtn').addEventListener('click',function(){openEditor(-1);});

/* ---------- editor ---------- */
var edIndex=-1,edItem=null,uploading=false;
function field(label,html,cls,hint){return '<label class="a-field '+(cls||'')+'"><span>'+label+'</span>'+html+(hint?'<small>'+hint+'</small>':'')+'</label>';}
function input(name,val,attrs){return '<input class="a-input" name="'+name+'" value="'+esc(val)+'" '+(attrs||'')+'>';}
function select(name,opts,val){return '<select class="a-input a-select" name="'+name+'">'+opts.map(function(o){var v=Array.isArray(o)?o[0]:o,l=Array.isArray(o)?o[1]:o;return '<option value="'+esc(v)+'"'+(v===val?' selected':'')+'>'+esc(l)+'</option>';}).join('')+'</select>';}
function photoBlock(p){
  return '<div class="a-field full"><span>Фото</span><div class="a-photo"><div class="a-photo__prev" id="phPrev">'+(p.img?'<img src="'+esc(imgSrc(p.img))+'" alt="">':'нет фото')+'</div>'+
    '<div class="a-photo__ctl"><span class="a-btn a-btn--ghost a-file">📷 '+(p.img?'Заменить фото':'Загрузить фото')+'<input type="file" accept="image/*" id="phFile"></span>'+
    '<label class="a-check"><input type="checkbox" id="phCut" checked><span>Убрать белый фон<small>'+(tab==='rasp'?'Для фото флакона на белом фоне — так он красиво смотрится в карусели':'Если флакон снят на белом фоне')+'</small></span></label>'+
    '<small class="a-muted" id="phStatus"></small></div></div></div>';
}
function openEditor(i){
  edIndex=i;var list=arr();
  edItem=i>=0?JSON.parse(JSON.stringify(list[i])):(tab==='rasp'?{id:'',brand:'',name:'',cat:'arabic',desc:'',top:'',heart:'',base:'',tags:[],prices:{},img:'',featured:false,hidden:false}:{id:'',cat:CUSTOM_CATS[0],brand:'',name:'',price:'',notes:'',img:'',hidden:false});
  var p=edItem,h='';
  if(tab==='rasp'){
    $('#edTitle').textContent=i>=0?'Изменить аромат':'Новый аромат';
    h+=field('Бренд',input('brand',p.brand,'required placeholder="Например, Lattafa"'));
    h+=field('Название',input('name',p.name,'required placeholder="Например, Khamrah"'));
    h+=field('Категория',select('cat',RASP_CATS,p.cat));
    h+=field('Короткое описание',input('desc',p.desc,'placeholder="Пряный · тёплый · сладкий"'));
    h+='<div class="a-field full"><span>Цены за объём, ₸</span><div class="a-prices">'+VOLS.map(function(v){return '<label>'+v+' мл<input class="a-input" type="number" min="0" step="50" inputmode="numeric" name="p'+v+'" value="'+esc(p.prices[v]||'')+'"></label>';}).join('')+'</div><small class="a-muted">Пустое поле — этот объём не продаётся.</small></div>';
    h+=field('Верхние ноты',input('top',p.top,'placeholder="Бергамот · лимон"'),'full');
    h+=field('Ноты сердца',input('heart',p.heart,'placeholder="Жасмин · роза"'),'full');
    h+=field('Базовые ноты',input('base',p.base,'placeholder="Ваниль · амбра"'),'full');
    h+='<div class="a-field full"><span>Характер аромата (для фильтров на сайте)</span><div class="a-chips" id="tagChips">'+NOTES.map(function(n){return '<button type="button" class="a-chip'+(p.tags.indexOf(n)>=0?' is-on':'')+'" data-tag="'+n+'">'+n+'</button>';}).join('')+'</div></div>';
    h+=photoBlock(p);
    h+='<label class="a-check full"><input type="checkbox" name="featured"'+(p.featured?' checked':'')+'><span>Показывать в карусели на главном экране<small>Лучше всего 6–8 флаконов с фото без фона</small></span></label>';
  } else {
    $('#edTitle').textContent=i>=0?'Изменить флакон':'Новый флакон под заказ';
    h+=field('Бренд',input('brand',p.brand,'required placeholder="Например, Tom Ford"'));
    h+=field('Название',input('name',p.name,'required placeholder="Например, Oud Wood 100ml"'));
    h+=field('Категория',select('cat',CUSTOM_CATS,p.cat));
    h+=field('Цена флакона, ₸',input('price',p.price,'type="number" min="0" step="100" inputmode="numeric" required'));
    h+=field('Ноты',input('notes',p.notes,'placeholder="уд, сандал, ваниль"'),'full','Через запятую');
    h+=photoBlock(p);
  }
  h+='<label class="a-check full"><input type="checkbox" name="hidden"'+(p.hidden?' checked':'')+'><span>Скрыть с сайта<small>Например, если временно нет в наличии</small></span></label>';
  if(i>=0)h+='<div class="full"><button type="button" class="a-btn a-btn--danger" id="edDel">Удалить</button></div>';
  $('#edBody').innerHTML=h;
  if(tab==='custom')$('#phCut').checked=false;
  $('#editor').hidden=false;document.body.style.overflow='hidden';
  setTimeout(function(){var f=$('#edBody input[name=brand]');if(f&&i<0)f.focus();},60);
}
function closeEditor(){$('#editor').hidden=true;document.body.style.overflow='';edItem=null;}
$('#editor').addEventListener('click',function(e){
  if(e.target.closest('[data-close]')){closeEditor();return;}
  var c=e.target.closest('[data-tag]');if(c){c.classList.toggle('is-on');return;}
  if(e.target.id==='edDel'){var list=arr();if(confirm('Удалить «'+list[edIndex].name+'»?')){list.splice(edIndex,1);closeEditor();render();}}
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('#editor').hidden)closeEditor();});
$('#editor').addEventListener('change',function(e){
  if(e.target.id!=='phFile'||!e.target.files[0])return;
  var file=e.target.files[0];uploading=true;$('#phStatus').textContent='Обрабатываем фото…';
  processImage(file,$('#phCut').checked).then(function(img){
    $('#phPrev').innerHTML='<img src="'+img.dataURL+'" alt="">';
    $('#phStatus').textContent='Загружаем…';
    if(DEMO)return {path:'img/u/demo-'+Date.now()+'.webp',img:img};
    return api('/upload',{method:'POST',body:{base64:img.dataURL,type:img.type}}).then(function(j){return {path:j.path,img:img};});
  }).then(function(r){
    imgCache[r.path]=r.img.dataURL;edItem.img=r.path;
    if(tab==='rasp'){if(r.img.cut)edItem.cut=r.path;else delete edItem.cut;}
    $('#phStatus').textContent='✓ Фото загружено';
  }).catch(function(err){$('#phStatus').textContent='';toast('Не удалось загрузить фото: '+err.message,true);})
    .finally(function(){uploading=false;e.target.value='';});
});
$('#edForm').addEventListener('submit',function(e){
  e.preventDefault();
  if(uploading){toast('Подождите, фото ещё загружается');return;}
  var f=e.target,p=edItem,val=function(n){var el=f.elements[n];return el?String(el.value).trim():'';};
  p.brand=val('brand');p.name=val('name');p.cat=val('cat');p.hidden=f.elements.hidden.checked;
  if(!p.brand||!p.name){toast('Заполните бренд и название',true);return;}
  if(tab==='rasp'){
    p.desc=val('desc');p.top=val('top');p.heart=val('heart');p.base=val('base');
    p.prices={};VOLS.forEach(function(v){var n=parseInt(val('p'+v),10);if(n>0)p.prices[v]=n;});
    if(!Object.keys(p.prices).length){toast('Укажите цену хотя бы для одного объёма',true);return;}
    p.tags=$$('#tagChips .is-on').map(function(c){return c.dataset.tag;});
    p.featured=f.elements.featured.checked;
  } else {
    p.notes=val('notes');p.price=parseInt(val('price'),10)||0;
    if(!p.price){toast('Укажите цену флакона',true);return;}
  }
  if(!p.img){toast('Добавьте фото',true);return;}
  if(!p.id)p.id=slug(p.brand+' '+p.name);
  var list=arr();if(edIndex>=0)list[edIndex]=p;else list.unshift(p);
  closeEditor();render();toast('Готово. Не забудьте нажать «Сохранить на сайте»');
});

/* ---------- image processing ---------- */
function loadBitmap(file){
  if(window.createImageBitmap)return createImageBitmap(file).catch(function(){return viaImg(file);});
  return viaImg(file);
}
function viaImg(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){res(im);};im.onerror=function(){rej(new Error('не удалось открыть файл'));};im.src=u;});}
function processImage(file,cut){
  return loadBitmap(file).then(function(bm){
    var MAX=1000,w=bm.width,h=bm.height,k=Math.min(1,MAX/Math.max(w,h));w=Math.round(w*k);h=Math.round(h*k);
    var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');x.drawImage(bm,0,0,w,h);
    var didCut=false;
    if(cut){didCut=removeWhite(x,w,h);if(didCut)c=cropAlpha(c);}
    return toData(c,didCut).then(function(r){r.cut=didCut;return r;});
  });
}
function removeWhite(x,w,h){
  var id=x.getImageData(0,0,w,h),d=id.data,n=w*h,seen=new Uint8Array(n),stack=[],removed=0;
  function white(i){var r=d[i*4],g=d[i*4+1],b=d[i*4+2],a=d[i*4+3];if(a<20)return true;var mn=Math.min(r,g,b),mx=Math.max(r,g,b);return mn>228&&mx-mn<22;}
  for(var xx=0;xx<w;xx++){stack.push(xx,(h-1)*w+xx);}for(var yy=0;yy<h;yy++){stack.push(yy*w,yy*w+w-1);}
  while(stack.length){var i=stack.pop();if(seen[i])continue;seen[i]=1;if(!white(i))continue;d[i*4+3]=0;removed++;
    var px=i%w;if(px>0)stack.push(i-1);if(px<w-1)stack.push(i+1);if(i>=w)stack.push(i-w);if(i<n-w)stack.push(i+w);}
  if(removed<n*0.05)return false; // фон не белый — оставляем как есть
  // мягкий край: полупрозрачность у пикселей рядом с вырезанным фоном
  for(var j=0;j<n;j++){if(d[j*4+3]===0)continue;var pxx=j%w,edge=(pxx>0&&d[(j-1)*4+3]===0)||(pxx<w-1&&d[(j+1)*4+3]===0)||(j>=w&&d[(j-w)*4+3]===0)||(j<n-w&&d[(j+w)*4+3]===0);if(edge)d[j*4+3]=140;}
  x.putImageData(id,0,0);return true;
}
function cropAlpha(c){
  var w=c.width,h=c.height,d=c.getContext('2d').getImageData(0,0,w,h).data,x0=w,y0=h,x1=0,y1=0;
  for(var y=0;y<h;y++)for(var x=0;x<w;x++)if(d[(y*w+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  if(x1<=x0||y1<=y0)return c;var pad=6;x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(w-1,x1+pad);y1=Math.min(h-1,y1+pad);
  var o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,x0,y0,o.width,o.height,0,0,o.width,o.height);return o;
}
function toData(c,alpha){
  return new Promise(function(res){
    c.toBlob(function(b){
      if(!b||(b.type!=='image/webp'&&!alpha)){c.toBlob(function(b2){fin(b2);},'image/jpeg',0.86);return;}
      fin(b);
    },'image/webp',0.86);
    function fin(b){var r=new FileReader();r.onload=function(){res({dataURL:r.result,type:b.type});};r.readAsDataURL(b);}
  });
}

/* ---------- save ---------- */
$('#discardBtn').addEventListener('click',function(){if(!confirm('Отменить все несохранённые изменения?'))return;data=JSON.parse(orig);render();});
$('#saveBtn').addEventListener('click',function(){
  var b=this;b.disabled=true;b.textContent='Сохраняем…';
  var p=DEMO?Promise.resolve({sha:'demo',updated:new Date().toISOString()}):api('/save',{method:'POST',body:{data:data,sha:sha}});
  p.then(function(j){sha=j.sha;data.meta=Object.assign({},data.meta,{updated:j.updated});orig=JSON.stringify(data);render();
      toast(DEMO?'Демо: изменения не отправлены':'Сохранено! Сайт обновится через 1–2 минуты');})
   .catch(function(err){if(err.message!=='auth')toast(err.message,true);})
   .finally(function(){b.disabled=false;b.textContent='Сохранить на сайте';});
});
window.addEventListener('beforeunload',function(e){if(isDirty()){e.preventDefault();e.returnValue='';}});

/* ---------- start ---------- */
if(DEMO||getToken()){load().catch(function(err){if(err.message!=='auth')showLogin(err.message==='Failed to fetch'?'Нет связи с сервером.':err.message);});}
else showLogin();
})();
