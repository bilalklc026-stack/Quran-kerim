const PAGE_API = "https://semarketir.github.io/quranjson-web/pages/index.json";
const JUZ_API = "https://semarketir.github.io/quranjson-web/juzs/index.json";
const SURAH_API = "https://semarketir.github.io/quranjson-web/surahs/index.json";
const AYAH_API_ROOT = "https://semarketir.github.io/quranjson-web/ayahs/";

const selectArea = document.getElementById("select-area");
const displayArea = document.getElementById("display-area");
const tabs = {
    page: document.getElementById("page-tab"),
    surah: document.getElementById("surah-tab"),
    juz: document.getElementById("juz-tab"),
    ayah: document.getElementById("ayah-tab"),
};
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
async function initPage() {
    selectArea.innerHTML = `<label>Sayfa No: <select id="page-select"></select></label>
    <button id="show-page-btn">Sayfayı Göster</button>`;
    const pages = await fetch(PAGE_API).then(r => r.json());
    document.getElementById("page-select").innerHTML = pages.map(p =>
        `<option value="${p.page}">${p.page}</option>`).join("");
    document.getElementById("show-page-btn").onclick = async () => {
        const pageNum = document.getElementById("page-select").value;
        displayArea.innerHTML = '<em>Sayfa yükleniyor...</em>';
        const page = pages.find(p => p.page == pageNum);
        let ayahList = [];
        for(let i=page.start; i<=page.end; i++) {
            let ayahData = await fetch(AYAH_API_ROOT + `${i}.json`).then(res=>res.json());
            ayahList.push(ayahData);
        }
        displayAyatList(ayahList, `Sayfa ${pageNum}`);
    }
}

// Sureler
async function initSurah() {
    selectArea.innerHTML = `<label>Sure: <select id="surah-select"></select></label>
    <button id="show-surah-btn">Sureyi Göster</button>`;
    const surahs = await fetch(SURAH_API).then(r => r.json());
    document.getElementById("surah-select").innerHTML = surahs.map(s =>
        `<option value="${s.id}">${s.id}. ${s.name}</option>`).join("");
    document.getElementById("show-surah-btn").onclick = async () => {
        const surahId = document.getElementById("surah-select").value;
        displayArea.innerHTML = '<em>Sure yükleniyor...</em>';
        const surahObj = surahs.find(s => s.id == surahId);
        let ayahList = [];
        for(let n = surahObj.start; n <= surahObj.end; n++) {
            let ayahData = await fetch(AYAH_API_ROOT + `${n}.json`).then(res=>res.json());
            ayahList.push(ayahData);
        }
        displayAyatList(ayahList, `${surahObj.name} Suresi`);
    }
}

// Cüzler
async function initJuz() {
    selectArea.innerHTML = `<label>Cüz No: <select id="juz-select"></select></label>
    <button id="show-juz-btn">Cüzü Göster</button>`;
    const juzList = await fetch(JUZ_API).then(r => r.json());
    document.getElementById("juz-select").innerHTML = juzList.map(j => `<option value="${j.id}">${j.id}</option>`).join("");
    document.getElementById("show-juz-btn").onclick = async () => {
        const juzId = document.getElementById("juz-select").value;
        displayArea.innerHTML = '<em>Cüz yükleniyor...</em>';
        const juzObj = juzList.find(j => j.id == juzId);
        let ayahList = [];
        for(let n = juzObj.start; n <= juzObj.end; n++) {
            let ayahData = await fetch(AYAH_API_ROOT + `${n}.json`).then(res=>res.json());
            ayahList.push(ayahData);
        }
        displayAyatList(ayahList, `Cüz ${juzId}`);
    }
}

// Ayetler
function initAyah() {
    selectArea.innerHTML = `
        <label>Ayet No: <input id="ayah-input" type="number" min="1" placeholder="Ayet numarası"></label>
        <button id="show-ayah-btn">Ayetleri Göster</button>
    `;
    document.getElementById("show-ayah-btn").onclick = async () => {
        const num = document.getElementById("ayah-input").value;
        if (!num || num < 1 || num > 6236) return displayArea.innerHTML = "<em>Doğru aralıkta ayet numarası giriniz (1-6236).</em>";
        displayArea.innerHTML = '<em>Ayet yükleniyor...</em>';
        let ayahData = await fetch(AYAH_API_ROOT + `${num}.json`).then(res=>res.json());
        displayAyatList([ayahData], `Ayet No: ${num}`);
    }
}

function displayAyatList(ayatList, title) {
    if (!Array.isArray(ayatList) || ayatList.length === 0)
        return displayArea.innerHTML = "<em>Herhangi bir ayet bulunamadı.</em>";
    displayArea.innerHTML = `<h2>${title}</h2>
    <div class="ayat-page-layout">
        ${ayatList.map(a => `<div class="ayat-box">
            <span class="ayat-number">${a.verse_number}</span>
            <span class="surah">${a.surah_name}</span>
            <div class="ayat-text">${a.text}</div>
        </div>`).join("")}
    </div>`;
}