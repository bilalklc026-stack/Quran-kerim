// Diyanet API'sinin ana adresi
const API_BASE_URL = "https://acikkaynakkuran-dev.diyanet.gov.tr/api/v1/Cuzler";

// *** BURAYI GÜNCELLEYİNİZ ***
// API Anahtarınızı buraya tanımlayın
const API_KEY = "218|0iV4nIwFhzy9DMtDq1cZcyLu4Kz8F3s7SiltlP43482ed659"; 

// ... (kodun devamı) ...
// (juzInput, fetchButton, outputDiv tanımlamaları değişmiyor)
// ... (addEventListener kısmı değişmiyor) ...


/**
 * Belirtilen cüz numarasına ait ayetleri API'den çeker ve ekranda gösterir.
 * @param {number} juzNumber - Çekilecek cüz numarası (1-30).
 */
async function getVersesByJuz(juzNumber) {
    outputDiv.innerHTML = '<p>Veriler yükleniyor, lütfen bekleyiniz...</p>';

    const endpoint = `${API_BASE_URL}/${juzNumber}/verses`;

    try {
        // *** GÜNCELLEME BURADA YAPILIYOR ***
        // 'Authorization' başlığına API Anahtarını ekliyoruz.
        // Genellikle 'Bearer' ön eki kullanılır. 
        // Eğer API dökümantasyonunda farklı bir başlık (örneğin 'X-API-KEY') 
        // veya farklı bir ön ek isteniyorsa burayı değiştirmeniz gerekebilir.
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (!response.ok) {
            // Hata mesajına ek bilgi verelim
            let errorMessage = `API Hatası: Sunucudan ${response.status} kodu döndü.`;
            if (response.status === 401 || response.status === 403) {
                errorMessage += " (Yetkilendirme Başarısız. API Anahtarınızı kontrol edin.)";
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        displayVerses(data, juzNumber);

    } catch (error) {
        console.error("Ayetleri çekerken bir sorun oluştu:", error);
        outputDiv.innerHTML = `<p style="color: red;">Veri çekme hatası: ${error.message}</p>`;
    }
}

// ... (displayVerses fonksiyonu değişmiyor) ...