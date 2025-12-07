const API_BASE = "https://acikkaynakkuran-dev.diyanet.gov.tr/api/v1";
const API_KEY = "218|0iV4nIwFhzy9DMtDq1cZcyLu4Kz8F3s7SiltlP43482ed659";

const selectArea = document.getElementById("select-area");
const displayArea = document.getElementById("display-area");
const tabs = {
    page: document.getElementById("page-tab"),
    surah: document.getElementById("surah-tab"),
    juz: document.getElementById("juz-tab"),
    ayah: document.getElementById("ayah-tab"),
}
const logo = document.getElementById("site-logo");
logo.addEventListener('click', () => window.location.reload());

Object.values(tabs).forEach(btn => btn.classList.remove('active'));
tabs.page.classList.add('active');
initPage();

tabs.page.onclick = () => { setActiveTab('page'); initPage(); }
tabs.surah.onclick = () => { setActiveTab('surah'); initSurah(); }
tabs.juz.onclick = () => { setActiveTab('juz'); initJuz(); }
tabs.ayah.onclick = () => { setActiveTab('ayah'); initAyah(); }

function setActiveTab(tab) {
    Object.values(tabs).forEach(btn => btn.classList.remove('active'));
    tabs[tab].classList.add('active');
    selectArea.innerHTML = "";
    displayArea.innerHTML = "";
}

// Sayfalar
function initPage() {
    selectArea.innerHTML = `
        <label>Sayfa No: 
            <select id="page-select">${[...Array(604)].map((_,i)=>`<option value="${i+1}">${i+1}</option>`).join("")}</select>
        </label>
        <button id="show-page-btn">Sayfayı Göster</button>
    `;
    document.getElementById("show-page-btn").onclick = async () => {
        const page = document.getElementById("page-select").value;
        displayArea.innerHTML = '<em>Sayfa yükleniyor...</em>';
        let ayahData = await getAyatByPage(page);
        displayAyatList(ayahData, `Sayfa No: ${page}`);
    }
}

// Sureler
async function initSurah() {
    selectArea.innerHTML = `<label>Sure: <select id="surah-select"></select></label>
    <button id="show-surah-btn">Sureyi Göster</button>`;
    const sures = await fetch(`${API_BASE}/Surer`, {headers:{'Authorization':`Bearer ${API_KEY}`}}).then(r=>r.json());
    document.getElementById("surah-select").innerHTML = sures.map(sure=>
        `<option value="${sure.id}">${sure.id}. ${sure.name}</option>`).join("");
    document.getElementById("show-surah-btn").onclick = async () => {
        const surahId = document.getElementById("surah-select").value;
        displayArea.innerHTML = '<em>Sure yükleniyor...</em>';
        const ayat = await fetch(`${API_BASE}/Surer/${surahId}/ayetler`, {headers:{'Authorization':`Bearer ${API_KEY}`}}).then(r=>r.json());
        displayAyatList(ayat, `Sure`);
    }
}

// Cüzler
function initJuz() {
    selectArea.innerHTML = `
        <label>Cüz No: 
            <select id="juz-select">${[...Array(30)].map((_,i)=>`<option value="${i+1}">${i+1}</option>`).join("")}</select>
        </label>
        <button id="show-juz-btn">Cüzü Göster</button>
    `;
    document.getElementById("show-juz-btn").onclick = async () => {
        const juz = document.getElementById("juz-select").value;
        displayArea.innerHTML = '<em>Cüz yükleniyor...</em>';
        let juzAyat = await fetch(`${API_BASE}/Cuzler/${juz}/verses`, {headers: {'Authorization': `Bearer ${API_KEY}`}}).then(r=>r.json());
        displayAyatList(juzAyat, `Cüz No: ${juz}`);
    }
}

// Ayetler
async function initAyah() {
    selectArea.innerHTML = `
        <label>Ayet Ara: <input id="ayah-input" type="number" min="1" placeholder="Ayet numarası"></label>
        <button id="show-ayah-btn">Ayetleri Göster</button>
    `;
    document.getElementById("show-ayah-btn").onclick = async () => {
        const num = document.getElementById("ayah-input").value;
        if(!num) return displayArea.innerHTML = "<em>Lütfen bir ayet numarası giriniz.</em>";
        displayArea.innerHTML = '<em>Ayet yükleniyor...</em>';
        let allAyah = [];
        try {
            for(let surah = 1; surah <= 114; ++surah) {
                let ayat = await fetch(`${API_BASE}/Surer/${surah}/ayetler`, {headers:{'Authorization':`Bearer ${API_KEY}`}}).then(r=>r.json());
                allAyah = allAyah.concat(ayat.filter(a => a.verseNumber == num));
            }
            displayAyatList(allAyah, `Ayet No: ${num} (Bütün Sureler)`);
        } catch(err) {
            displayArea.innerHTML = `<span style="color:red;">Veri alınamadı.</span>`;
        }
    }
}

// Ayetleri sayfa gibi göster
function displayAyatList(ayatList, title) {
    if(!Array.isArray(ayatList) || ayatList.length === 0)
        return displayArea.innerHTML = "<em>Herhangi bir ayet bulunamadı.</em>";
    displayArea.innerHTML = `<h2>${title}</h2>
    <div class="ayat-page-layout">
        ${ayatList.map(a=>`
            <div class="ayat-box">
                <span class="ayat-number">${a.verseNumber}</span> 
                <span class="surah">${a.surahName || (a.sureAdi || "-")}</span>
                <div class="ayat-text">${a.text || a.ayet || ""}</div>
            </div>
        `).join("")}
    </div>`;
}

// (Sayfa karşılığı ayet) -- Kendi datasetinizle zenginleştirilebilir
async function getAyatByPage(page) {
    let cüz = Math.ceil(page/20);
    let ayat = await fetch(`${API_BASE}/Cuzler/${cüz}/verses`, {headers: {'Authorization': `Bearer ${API_KEY}`}}).then(r=>r.json());
    return ayat.filter(a => Math.abs(page-cüz*20)<3); // Algoritmik, örnek için
}