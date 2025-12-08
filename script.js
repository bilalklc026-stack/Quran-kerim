// script.js — Model B (her sayfada max 10 ayet)
const PAGE_SIZE = 10; // her sayfada en fazla 10 ayet (senin istediğin)

// DOM yardımcıları
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));
const panelEls = qsa('.panel');
const pageView = qs('#pageView');
const currentPageLabel = qs('#currentPageLabel');
const prevBtn = qs('#prevPage');
const nextBtn = qs('#nextPage');
const logo = qs('#logo');

// JSON verileri
let QURAN = {};      // quran.json — { "1": [ {...}, ... ], "2": [...] }
let SURA = [];       // surah.json — array
let JUZ = [];        // juz.json — array

// flatten edilmiş verse list: [{chapter, verse, text, globalIndex}]
let GLOBAL_VERSES = [];
let TOTAL_PAGES = 0;
let currentPage = 1;

// logo tıklayınca reset (veya anasayfa)
logo.addEventListener('click', ()=> location.reload());

// Menü butonları: aç/kapa
qsa('.menuBtn').forEach(b=>{
  b.addEventListener('click', ()=> {
    const target = b.dataset.target;
    panelEls.forEach(p=> p.style.display = 'none');
    qs(`#${target}`).style.display = 'block';
  });
});

// Sayfa kontrol butonları
prevBtn.addEventListener('click', ()=> {
  if(currentPage > 1) showPage(currentPage - 1);
});
nextBtn.addEventListener('click', ()=> {
  if(currentPage < TOTAL_PAGES) showPage(currentPage + 1);
});

// Go butonları
qs('#goPageBtn').addEventListener('click', ()=>{
  const val = parseInt(qs('#pageInput').value);
  if(!val || val < 1) return alert('Geçerli bir sayfa numarası gir.');
  if(val > TOTAL_PAGES) return alert(`Maks sayfa: ${TOTAL_PAGES}`);
  showPage(val);
});

qs('#goSureBtn').addEventListener('click', ()=>{
  const s = parseInt(qs('#sureSelect').value);
  if(!s) return;
  // sure'ün ilk ayetinin global indexine bak -> o sayfaya git
  const idx = GLOBAL_VERSES.findIndex(v => v.chapter === s);
  if(idx === -1) return alert('Sure verisi bulunamadı.');
  const page = Math.floor(idx / PAGE_SIZE) + 1;
  showPage(page);
});

qs('#goJuzBtn').addEventListener('click', ()=>{
  const j = qs('#juzSelect').value;
  if(!j) return;
  // juz.json'tan seçili cüzü al
  const jj = JUZ.find(x => String(x.index) === String(j));
  if(!jj) return alert('Cüz verisi yok.');
  const startSure = parseInt(jj.start.index);
  const startVerseStr = jj.start.verse || '';
  // parse verse number from "verse_1"
  const match = (startVerseStr+'').match(/(\d+)$/);
  const startVerseNum = match ? parseInt(match[1]) : 1;

  // bul: GLOBAL_VERSES'de ilk matching
  const idx = GLOBAL_VERSES.findIndex(v => v.chapter === startSure && v.verse === startVerseNum);
  const page = idx >= 0 ? Math.floor(idx / PAGE_SIZE) + 1 : 1;
  showPage(page);
});

qs('#goAyetBtn').addEventListener('click', ()=>{
  const chap = parseInt(qs('#chapterInput').value);
  const verse = parseInt(qs('#verseInput').value);
  if(!chap || !verse) return alert('Sure ve ayet numarası gir.');
  const idx = GLOBAL_VERSES.findIndex(v => v.chapter === chap && v.verse === verse);
  if(idx === -1) return alert('Ayet bulunamadı.');
  const page = Math.floor(idx / PAGE_SIZE) + 1;
  showPage(page);
});

// Dosya yükleme
Promise.all([
  fetch('quran.json').then(r=> r.ok ? r.json() : Promise.reject('quran.json yüklenemedi')),
  fetch('surah.json').then(r=> r.ok ? r.json() : Promise.reject('surah.json yüklenemedi')),
  fetch('juz.json').then(r=> r.ok ? r.json() : Promise.reject('juz.json yüklenemedi')),
]).then(([quran, surahs, juz])=>{
  QURAN = quran;
  SURA = surahs;
  JUZ = juz;
  buildGlobalVerses();
  populateSureSelect();
  populateJuzSelect();
  // otomatik olarak 1. sayfayı göster
  showPage(1);
}).catch(err=>{
  pageView.innerHTML = `<div style="padding:20px;color:#900">Yükleme hatası: ${err}. Dosyaların aynı klasörde ve isimlerin doğru olduğundan emin ol.</div>`;
});

// GLOBAL_VERSES oluştur (chap ina sıra 1..114)
function buildGlobalVerses(){
  GLOBAL_VERSES = [];
  // we expect QURAN keys like "1","2"... sort numerically
  const keys = Object.keys(QURAN).sort((a,b)=> parseInt(a) - parseInt(b));
  keys.forEach(k=>{
    const arr = QURAN[k];
    if(!Array.isArray(arr)) return;
    arr.forEach(item=>{
      // item.verse may be number; convert
      const vnum = typeof item.verse === 'number' ? item.verse : parseInt(String(item.verse).replace(/\D/g,'')) || null;
      GLOBAL_VERSES.push({
        chapter: parseInt(item.chapter || k),
        verse: vnum,
        text: item.text || item.ar || item.t || ''
      });
    });
  });
  TOTAL_PAGES = Math.max(1, Math.ceil(GLOBAL_VERSES.length / PAGE_SIZE));
}

// render bir sayfa (pageNumber: 1-based)
function showPage(pageNumber){
  if(pageNumber < 1) pageNumber = 1;
  if(pageNumber > TOTAL_PAGES) pageNumber = TOTAL_PAGES;
  currentPage = pageNumber;
  const startIdx = (pageNumber - 1) * PAGE_SIZE;
  const slice = GLOBAL_VERSES.slice(startIdx, startIdx + PAGE_SIZE);
  renderPage(slice, pageNumber);
  currentPageLabel.textContent = `Sayfa ${pageNumber} / ${TOTAL_PAGES}`;
}

// sayfa renderleme
function renderPage(verses, pageNumber){
  pageView.innerHTML = ''; // temizle
  // Başlık (opsiyonel: hangi surelerden geldiğini göster)
  const covers = uniqueChapters(verses).map(ch => {
    const meta = SURA.find(s => parseInt(s.index) === ch) || {};
    return `${ch} • ${meta.title || ''}`;
  }).join(' — ');
  if(covers){
    const d = document.createElement('div');
    d.style.textAlign = 'center';
    d.style.marginBottom = '8px';
    d.style.color = '#444';
    d.style.fontSize = '14px';
    d.textContent = covers;
    pageView.appendChild(d);
  }

  // Verseleri ekle
  verses.forEach(v=>{
    const box = document.createElement('div');
    box.className = 'verseBox';
    const num = document.createElement('span');
    num.className = 'verseNumber';
    num.textContent = `Sure ${v.chapter} — Ayet ${v.verse}`;

    const a = document.createElement('div');
    a.className = 'arabicText';
    a.textContent = v.text;

    box.appendChild(num);
    box.appendChild(a);
    pageView.appendChild(box);
  });

  // sayfanın en alta sayfa numarası yaz
  const foot = document.createElement('div');
  foot.style.textAlign = 'center';
  foot.style.marginTop = '18px';
  foot.style.color = '#666';
  foot.style.fontSize = '13px';
  foot.textContent = `Sayfa ${pageNumber}`;
  pageView.appendChild(foot);

  // otomatik olarak içeriğin başına kaydır
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// yardımcı: verilen verses listesinde unique chapter numaralarını döndür
function uniqueChapters(verses){
  const set = new Set();
  verses.forEach(v=> set.add(v.chapter));
  return Array.from(set);
}

// Sure select doldur
function populateSureSelect(){
  const sel = qs('#sureSelect');
  sel.innerHTML = '';
  SURA.forEach(s=>{
    const opt = document.createElement('option');
    opt.value = parseInt(s.index);
    opt.textContent = `${parseInt(s.index)} — ${s.title} (${s.titleAr || ''})`;
    sel.appendChild(opt);
  });
}

// Cüz select doldur
function populateJuzSelect(){
  const sel = qs('#juzSelect');
  sel.innerHTML = '';
  JUZ.forEach(j=>{
    const opt = document.createElement('option');
    opt.value = j.index;
    opt.textContent = `Cüz ${String(j.index).padStart(2,'0')} — ${j.start.name || ''} → ${j.end.name || ''}`;
    sel.appendChild(opt);
  });
}