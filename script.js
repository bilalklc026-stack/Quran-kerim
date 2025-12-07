// script.js - Tüm Veri ve Uygulama Mantığı Bir Arada

// =========================================================
// I. VERİ YAPISI (Data Structure)
// Tamamen işlevsel olması için bu verilerin tamamlanması gerekir.
// =========================================================

const quranData = [
    // Örnek Veri: Sure No, Adı, Ayet Sayısı, Başlangıç Sayfası, Cüz No
    { sureNo: 1, sureAdi: "Fâtiha", ayetSayisi: 7, baslangicSayfa: 1, baslangicCuz: 1 },
    { sureNo: 2, sureAdi: "Bakara", ayetSayisi: 286, baslangicSayfa: 2, baslangicCuz: 1 },
    { sureNo: 3, sureAdi: "Âl-i İmrân", ayetSayisi: 200, baslangicSayfa: 50, baslangicCuz: 3 },
    // ... Diğer 111 sure buraya eklenmelidir ...
    { sureNo: 114, sureAdi: "Nâs", ayetSayisi: 6, baslangicSayfa: 604, baslangicCuz: 30 } 
];

const cuzData = [
    // Örnek Veri: Cüz No, Başlangıç Sayfası
    { cuzNo: 1, baslangicSayfa: 1 },
    { cuzNo: 2, baslangicSayfa: 22 },
    { cuzNo: 3, baslangicSayfa: 42 },
    // ... Diğer 27 cüz buraya eklenmelidir ...
    { cuzNo: 30, baslangicSayfa: 582 } 
];

// =========================================================
// II. UYGULAMA MANTIK (Application Logic)
// =========================================================

const pageSelect = document.getElementById('page-select');
const sureSelect = document.getElementById('sure-select');
const cuzSelect = document.getElementById('cuz-select');
const ayahSelect = document.getElementById('ayah-select');

function populateSelections() {
    // 1. Sayfalar (1'den 604'e kadar)
    for (let i = 1; i <= 604; i++) {
        pageSelect.innerHTML += `<option value="${i}">Sayfa ${i}</option>`;
    }

    // 2. Sureler (quranData'dan çekilir)
    quranData.forEach(sure => {
        sureSelect.innerHTML += `<option value="${sure.sureNo}">${sure.sureNo}. ${sure.sureAdi}</option>`;
    });

    // 3. Cüzler (cuzData'dan çekilir)
    cuzData.forEach(cuz => {
        cuzSelect.innerHTML += `<option value="${cuz.cuzNo}">${cuz.cuzNo}. Cüz</option>`;
    });
    
    // Varsayılan olarak Fatiha Suresi için Ayetleri doldur
    updateAyahSelection(); 
}

function updateAyahSelection() {
    const selectedSureNo = parseInt(sureSelect.value || 1); 
    const sure = quranData.find(s => s.sureNo === selectedSureNo);
    
    ayahSelect.innerHTML = ''; 

    if (sure) {
        for (let i = 1; i <= sure.ayetSayisi; i++) {
            ayahSelect.innerHTML += `<option value="${i}">Ayet ${i}</option>`;
        }
    }
}

function scrollToTarget(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'      
        });
    } else {
        alert(`Hata: Hedef ID (${targetId}) bulunamadı. Lütfen Kuran metninin doğru ID'ler ile yüklendiğinden emin olun.`);
    }
}

// --- NAVİGASYON (GIT BUTONLARI) İŞLEMLERİ ---

document.getElementById('go-to-page').addEventListener('click', () => {
    const pageNo = pageSelect.value;
    scrollToTarget(`page-${pageNo}`); 
});

document.getElementById('go-to-sure').addEventListener('click', () => {
    const sureNo = parseInt(sureSelect.value);
    const sure = quranData.find(s => s.sureNo === sureNo);
    if (sure) {
        scrollToTarget(`page-${sure.baslangicSayfa}`); 
    }
});

document.getElementById('go-to-cuz').addEventListener('click', () => {
    const cuzNo = parseInt(cuzSelect.value);
    const cuz = cuzData.find(c => c.cuzNo === cuzNo);
    if (cuz) {
        scrollToTarget(`page-${cuz.baslangicSayfa}`); 
    }
});

document.getElementById('go-to-ayah').addEventListener('click', () => {
    const sureNo = sureSelect.value;
    const ayetNo = ayahSelect.value;
    const targetId = `s${sureNo}a${ayetNo}`; 
    scrollToTarget(targetId);
});

// Olay Dinleyicileri
sureSelect.addEventListener('change', updateAyahSelection);
document.addEventListener('DOMContentLoaded', populateSelections);
