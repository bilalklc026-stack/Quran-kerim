// app.js - Tek Dosya Çözümü

// =========================================================
// I. VERİ YAPISI (Data Structure)
// Kuran'daki Sure ve Cüz bilgilerini navigasyon için tutar.
// =========================================================

const quranData = [
    // Sure: No, Adı, Ayet Sayısı, Başlangıç Sayfası, Cüz No
    { sureNo: 1, sureAdi: "Fâtiha", ayetSayisi: 7, baslangicSayfa: 1, baslangicCuz: 1 },
    { sureNo: 2, sureAdi: "Bakara", ayetSayisi: 286, baslangicSayfa: 2, baslangicCuz: 1 },
    { sureNo: 3, sureAdi: "Âl-i İmrân", ayetSayisi: 200, baslangicSayfa: 50, baslangicCuz: 3 },
    { sureNo: 4, sureAdi: "Nisâ", ayetSayisi: 176, baslangicSayfa: 77, baslangicCuz: 4 },
    // ... DİKKAT: Diğer 110 sure buraya eklenmelidir ...
    { sureNo: 114, sureAdi: "Nâs", ayetSayisi: 6, baslangicSayfa: 604, baslangicCuz: 30 } 
];

const cuzData = [
    // Cüz: No, Başlangıç Sayfası
    { cuzNo: 1, baslangicSayfa: 1 },
    { cuzNo: 2, baslangicSayfa: 22 },
    { cuzNo: 3, baslangicSayfa: 42 },
    // ... DİKKAT: Diğer 27 cüz buraya eklenmelidir ...
    { cuzNo: 30, baslangicSayfa: 582 } 
];

// =========================================================
// II. UYGULAMA MANTIK (Application Logic)
// HTML elemanlarını seçer, doldurur ve kaydırma yapar.
// =========================================================

// HTML elemanlarını seçme
const pageSelect = document.getElementById('page-select');
const sureSelect = document.getElementById('sure-select');
const cuzSelect = document.getElementById('cuz-select');
const ayahSelect = document.getElementById('ayah-select');

// Tüm seçim kutularını dolduran ana fonksiyon
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
    
    // Sayfa yüklendiğinde Ayet seçimini ilk sure (Fatiha) için doldur
    updateAyahSelection(); 
}

// 4. Ayetler: Seçilen Sureye göre Ayet listesini günceller
function updateAyahSelection() {
    // Sure seçili değilse varsayılan olarak Fatiha'yı kullan
    const selectedSureNo = parseInt(sureSelect.value || 1); 
    const sure = quranData.find(s => s.sureNo === selectedSureNo);
    
    ayahSelect.innerHTML = ''; 

    if (sure) {
        for (let i = 1; i <= sure.ayetSayisi; i++) {
            ayahSelect.innerHTML += `<option value="${i}">Ayet ${i}</option>`;
        }
    }
}

// Seçilen ID'ye yumuşak kaydırma yapan temel fonksiyon
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
    scrollToTarget(`page-${pageNo}`); // Hedef ID: page-1
});

document.getElementById('go-to-sure').addEventListener('click', () => {
    const sureNo = parseInt(sureSelect.value);
    const sure = quranData.find(s => s.sureNo === sureNo);
    if (sure) {
        scrollToTarget(`page-${sure.baslangicSayfa}`); // Sure'nin başladığı sayfaya git
    }
});

document.getElementById('go-to-cuz').addEventListener('click', () => {
    const cuzNo = parseInt(cuzSelect.value);
    const cuz = cuzData.find(c => c.cuzNo === cuzNo);
    if (cuz) {
        scrollToTarget(`page-${cuz.baslangicSayfa}`); // Cüz'ün başladığı sayfaya git
    }
});

document.getElementById('go-to-ayah').addEventListener('click', () => {
    const sureNo = sureSelect.value;
    const ayetNo = ayahSelect.value;
    // Ayet ID formatı: s[SureNo]a[AyetNo] Örn: s2a255
    const targetId = `s${sureNo}a${ayetNo}`; 
    scrollToTarget(targetId);
});

// Sure seçimi değiştiğinde Ayet listesini otomatik güncelle
sureSelect.addEventListener('change', updateAyahSelection);

// Sayfa tamamen yüklendiğinde fonksiyonları çalıştır
document.addEventListener('DOMContentLoaded', populateSelections);
