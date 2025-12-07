// Diyanet API'sinin ana adresi
// Not: Swagger sayfasındaki API adresi bu şekilde tahmin edilmiştir. Çalışmazsa kontrol edilmelidir.
const API_BASE_URL = "https://acikkaynakkuran-dev.diyanet.gov.tr/api/v1/Cuzler";

// DOM öğelerini (input ve butonu) tanımla
const juzInput = document.getElementById('juz-input');
const fetchButton = document.getElementById('fetch-button');
const outputDiv = document.getElementById('verse-output');

// Butona tıklandığında çalışacak olay dinleyicisi
fetchButton.addEventListener('click', () => {
    const juzNumber = parseInt(juzInput.value);

    // Girişin 1 ile 30 arasında olup olmadığını kontrol et
    if (juzNumber >= 1 && juzNumber <= 30) {
        getVersesByJuz(juzNumber);
    } else {
        outputDiv.innerHTML = '<p style="color: red;">Lütfen 1 ile 30 arasında geçerli bir cüz numarası giriniz.</p>';
    }
});

/**
 * Belirtilen cüz numarasına ait ayetleri API'den çeker ve ekranda gösterir.
 * @param {number} juzNumber - Çekilecek cüz numarası (1-30).
 */
async function getVersesByJuz(juzNumber) {
    // Yükleme mesajı göster
    outputDiv.innerHTML = '<p>Veriler yükleniyor, lütfen bekleyiniz...</p>';

    // API'nin beklenen endpoint'i: /Cuzler/5/verses gibi
    const endpoint = `${API_BASE_URL}/${juzNumber}/verses`;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`API Hatası: Sunucudan ${response.status} kodu döndü.`);
        }

        const data = await response.json();
        
        // Veriyi ekrana bas
        displayVerses(data, juzNumber);

    } catch (error) {
        console.error("Ayetleri çekerken bir sorun oluştu:", error);
        outputDiv.innerHTML = `<p style="color: red;">Veri çekme hatası: ${error.message}</p>`;
    }
}

/**
 * Gelen ayet verilerini HTML olarak ekrana basar.
 * @param {Array<Object>} versesData - API'den gelen ayet listesi.
 * @param {number} juzNumber - Görüntülenen cüz numarası.
 */
function displayVerses(versesData, juzNumber) {
    let htmlContent = `<h2>Cüz Numarası: ${juzNumber}</h2>`;

    if (versesData && versesData.length > 0) {
        htmlContent += '<ul>';
        
        // Gelen veri formatına göre: her bir ayet nesnesini döngüye al
        versesData.forEach(verse => {
            // Diyanet API'sinden gelen JSON yapısının şu anahtarları içerdiği varsayılmıştır:
            // verse.surahNumber (sure numarası), verse.verseNumber (ayet numarası), verse.verseText (ayet metni)
            
            // Eğer JSON formatı farklıysa, örneğin `data.data` altında geliyorsa
            // bu kısım buna göre düzenlenmelidir.
            
            htmlContent += `<li><strong>(${verse.surahNumber}:${verse.verseNumber})</strong> ${verse.verseText}</li>`;
        });
        
        htmlContent += '</ul>';
    } else {
        htmlContent += '<p>Bu cüze ait ayet verisi bulunamadı.</p>';
    }

    outputDiv.innerHTML = htmlContent;
}