// Basit frontend: data/texts.json dosyasını yükler, arama yapar, içerik gösterir.
// İçeriklerde yazar veya isim alanı yoktur.
const itemsEl = document.getElementById('items');
const contentTitle = document.getElementById('content-title');
const contentBody = document.getElementById('content-body');
const searchInput = document.getElementById('search');

let texts = [];

async function loadTexts(){
  try{
    const res = await fetch('data/texts.json');
    texts = await res.json();
    renderList(texts);
  }catch(e){
    itemsEl.innerHTML = '<li>İçerik yüklenemedi.</li>';
    console.error(e);
  }
}

function renderList(list){
  if(!list.length){
    itemsEl.innerHTML = '<li>Hiç içerik bulunamadı.</li>';
    return;
  }
  itemsEl.innerHTML = '';
  list.forEach(item=>{
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = item.title;
    btn.addEventListener('click', ()=> showItem(item));
    li.appendChild(btn);
    itemsEl.appendChild(li);
  });
}

function showItem(item){
  contentTitle.textContent = item.title;
  contentBody.innerHTML = '';
  // Metni paragraflara bölüp ekle
  item.content.split('\n\n').forEach(par=>{
    const p = document.createElement('p');
    p.textContent = par;
    contentBody.appendChild(p);
  });
  window.scrollTo({top:0,behavior:'smooth'});
}

searchInput.addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q){ renderList(texts); return; }
  const filtered = texts.filter(t=>{
    return t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q);
  });
  renderList(filtered);
});

// Başlat
loadTexts();
