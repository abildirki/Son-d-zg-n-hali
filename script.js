// Performans optimizasyonu için DOM yüklendikten sonra çalıştır
document.addEventListener('DOMContentLoaded', () => {
    // Kullanıcı durumunu kontrol et
    const kullanici = JSON.parse(localStorage.getItem('kullanici'));
    
    // Menü görünürlüğünü güncelle
    menuGorunurlugunuGuncelle(!!kullanici);

    // Eğer kullanıcı giriş yapmışsa profili göster
    if (kullanici) {
        kullaniciProfiliniGoster(kullanici);
        
        // Ana sayfayı gizle ve dashboard'u göster
        const anasayfa = document.getElementById('anasayfa');
        const ozellikler = document.getElementById('ozellikler');
        const dashboard = document.getElementById('ruya-gunlugu');
        
        if (anasayfa) anasayfa.style.display = 'none';
        if (ozellikler) ozellikler.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        
        // Rüyaları göster
        ruyalariGoster();
        
        // İstatistikleri güncelle
        istatistikleriGuncelle();
    } else {
        // Kullanıcı giriş yapmamışsa ana sayfayı göster
        const anasayfa = document.getElementById('anasayfa');
        const ozellikler = document.getElementById('ozellikler');
        const dashboard = document.getElementById('ruya-gunlugu');
        
        if (anasayfa) anasayfa.style.display = 'block';
        if (ozellikler) ozellikler.style.display = 'block';
        if (dashboard) dashboard.style.display = 'none';
    }

    // Logo tıklama işleyicisi
    const logo = document.querySelector('.logo a');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            const kullanici = JSON.parse(localStorage.getItem('kullanici'));
            sayfaGoster(kullanici ? 'ruya-gunlugu' : 'anasayfa');
        });
    }

    // Smooth scroll için tüm linkleri seç
    const links = document.querySelectorAll('a[href^="#"]');
    
    // Event listener'ları optimize et
    links.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll olayını throttle ile optimize et
    let ticking = false;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPosition = window.scrollY;
                
                if (scrollPosition > 50) {
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                } else {
                    header.style.backgroundColor = '#ffffff';
                    header.style.boxShadow = 'none';
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // Lazy loading için Intersection Observer kullan
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Mobil menü için touch olaylarını ekle
    const nav = document.querySelector('nav');
    let touchStartX = 0;
    let touchEndX = 0;

    nav.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    nav.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchEndX < touchStartX && window.innerWidth <= 768) {
            // Sola kaydırma - menüyü aç
            document.querySelector('.nav-links').style.display = 'flex';
        }
    }

    // Sayfa yüklendiğinde performans metriklerini topla
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Sayfa yüklenme süresi: ${loadTime}ms`);
        });
    }

    // Modal ve Form Elementleri
    const modal = document.getElementById('authModal');
    const kayitForm = document.getElementById('kayitForm');
    const girisForm = document.getElementById('girisForm');
    const girisBtn = document.getElementById('girisBtn');
    const kayitBtn = document.getElementById('kayitBtn');
    const closeBtn = document.querySelector('.close');
    const girisFormGoster = document.getElementById('girisFormGoster');
    const kayitFormGoster = document.getElementById('kayitFormGoster');

    // Varsayılan profil resmi URL'si (Kullanıcı placeholder)
    const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRINmE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==';

    // Modal Kontrolleri
    function modalAc() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function modalKapat() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Form Geçişleri
    function girisFormunuGoster() {
        kayitForm.style.display = 'none';
        girisForm.style.display = 'flex';
    }

    function kayitFormunuGoster() {
        girisForm.style.display = 'none';
        kayitForm.style.display = 'flex';
    }

    // Event Listeners
    girisBtn.addEventListener('click', () => {
        modalAc();
        girisFormunuGoster();
    });

    kayitBtn.addEventListener('click', () => {
        modalAc();
        kayitFormunuGoster();
    });

    closeBtn.addEventListener('click', modalKapat);

    girisFormGoster.addEventListener('click', (e) => {
        e.preventDefault();
        girisFormunuGoster();
    });

    kayitFormGoster.addEventListener('click', (e) => {
        e.preventDefault();
        kayitFormunuGoster();
    });

    // Form Submit İşleyicileri
    kayitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const ad = document.getElementById('kayitAd').value;
        const email = document.getElementById('kayitEmail').value;
        const sifre = document.getElementById('kayitSifre').value;
        const sifreTekrar = document.getElementById('kayitSifreTekrar').value;

        // Şifre kontrolü
        if (sifre !== sifreTekrar) {
            alert('Şifreler eşleşmiyor!');
            return;
        }

        // Kullanıcı oluştur
        const yeniKullanici = {
            id: Date.now(),
            ad: ad,
            email: email,
            sifre: sifre, // Gerçek uygulamada şifre hash'lenmelidir
            avatar: DEFAULT_AVATAR,
            ruyalar: []
        };

        // Kullanıcıyı kaydet
        localStorage.setItem('kullanici', JSON.stringify(yeniKullanici));
        
        // Modalı kapat ve sayfayı yenile
        modalKapat();
        location.reload();
    });

    girisForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('girisEmail').value;
        const sifre = document.getElementById('girisSifre').value;

        // Kullanıcıyı kontrol et
        const kullanici = JSON.parse(localStorage.getItem('kullanici'));
        
        if (kullanici && kullanici.email === email && kullanici.sifre === sifre) {
            // Giriş başarılı
            localStorage.setItem('kullanici', JSON.stringify(kullanici));
            modalKapat();
            location.reload();
        } else {
            alert('E-posta veya şifre hatalı!');
        }
    });

    // Çıkış yap
    function cikisYap() {
        localStorage.removeItem('kullanici');
        location.reload();
    }

    // Menü görünürlüğünü güncelle
    function menuGorunurlugunuGuncelle(girisYapildi) {
        const authOnlyElements = document.querySelectorAll('.auth-only');
        const guestOnlyElements = document.querySelectorAll('.guest-only');
        
        authOnlyElements.forEach(element => {
            element.style.display = girisYapildi ? 'block' : 'none';
        });
        
        guestOnlyElements.forEach(element => {
            element.style.display = girisYapildi ? 'none' : 'block';
        });
    }

    // Kullanıcı profilini göster
    function kullaniciProfiliniGoster(kullanici) {
        const profilAd = document.getElementById('profilAd');
        const profilEmail = document.getElementById('profilEmail');
        const profilResmi = document.getElementById('profilResmi');
        const toplamRuya = document.getElementById('toplamRuya');
        const buAyRuya = document.getElementById('buAyRuya');

        if (profilAd) profilAd.textContent = kullanici.ad;
        if (profilEmail) profilEmail.textContent = kullanici.email;
        if (profilResmi) profilResmi.src = kullanici.avatar || DEFAULT_AVATAR;

        // İstatistikleri güncelle
        const buAyRuyaSayisi = kullanici.ruyalar ? kullanici.ruyalar.filter(ruya => {
            const ruyaTarihi = new Date(ruya.tarih);
            const simdi = new Date();
            return ruyaTarihi.getMonth() === simdi.getMonth() &&
                   ruyaTarihi.getFullYear() === simdi.getFullYear();
        }).length : 0;

        if (toplamRuya) toplamRuya.textContent = kullanici.ruyalar ? kullanici.ruyalar.length : 0;
        if (buAyRuya) buAyRuya.textContent = buAyRuyaSayisi;

        // Menü görünürlüğünü güncelle
        menuGorunurlugunuGuncelle(true);
    }

    // Sayfa gösterme fonksiyonları
    function sayfaGoster(sayfaId) {
        const sayfalar = ['anasayfa', 'ozellikler', 'ruya-gunlugu', 'ruya-analiz', 'profilim'];
        
        sayfalar.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = id === sayfaId ? 'block' : 'none';
            }
        });

        // Rüya günlüğü sayfası gösteriliyorsa rüyaları güncelle
        if (sayfaId === 'ruya-gunlugu') {
            ruyalariGoster();
        }
    }

    // Sayfa yönlendirme işleyicileri
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            sayfaGoster(targetId);
        });
    });

    // Yeni Rüya Ekleme Modalı
    const yeniRuyaModal = document.createElement('div');
    yeniRuyaModal.className = 'modal';
    yeniRuyaModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <form id="yeniRuyaForm" class="auth-form">
                <h2>Yeni Rüya Ekle</h2>
                <div class="form-group">
                    <label for="ruyaBaslik">Başlık</label>
                    <input type="text" id="ruyaBaslik" required>
                </div>
                <div class="form-group">
                    <label for="ruyaIcerik">Rüya İçeriği</label>
                    <textarea id="ruyaIcerik" rows="6" required></textarea>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="lucidRuya">
                        Lucid Rüya mı?
                    </label>
                </div>
                <button type="submit" class="submit-btn">Kaydet</button>
            </form>
        </div>
    `;
    document.body.appendChild(yeniRuyaModal);

    // Yeni Rüya Modalı Kapatma İşleyicisi
    const yeniRuyaModalCloseBtn = yeniRuyaModal.querySelector('.close');
    yeniRuyaModalCloseBtn.addEventListener('click', () => {
        yeniRuyaModal.style.display = 'none';
        yeniRuyaForm.reset(); // Formu sıfırla
    });

    // Modal dışına tıklandığında kapatma
    yeniRuyaModal.addEventListener('click', (e) => {
        if (e.target === yeniRuyaModal) {
            yeniRuyaModal.style.display = 'none';
            yeniRuyaForm.reset(); // Formu sıfırla
        }
    });

    // Yeni Rüya Ekleme İşleyicisi
    const yeniRuyaBtn = document.getElementById('yeniRuyaBtn');
    const yeniRuyaForm = document.getElementById('yeniRuyaForm');
    
    yeniRuyaBtn.addEventListener('click', () => {
        yeniRuyaModal.style.display = 'block';
    });

    yeniRuyaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const baslik = document.getElementById('ruyaBaslik').value;
        const icerik = document.getElementById('ruyaIcerik').value;
        const lucid = document.getElementById('lucidRuya').checked;
        
        const yeniRuya = {
            id: Date.now(),
            baslik,
            icerik,
            lucid,
            tarih: new Date().toISOString()
        };
        
        ruyaEkle(yeniRuya);
        yeniRuyaModal.style.display = 'none';
        yeniRuyaForm.reset();
    });

    // Çıkış Yapma İşleyicisi
    const cikisYapBtn = document.getElementById('cikisYapBtn');
    cikisYapBtn.addEventListener('click', () => {
        localStorage.removeItem('kullanici');
        location.reload();
    });

    // Rüya Ekleme Fonksiyonu
    function ruyaEkle(ruya) {
        const kullanici = JSON.parse(localStorage.getItem('kullanici'));
        if (kullanici) {
            kullanici.ruyalar = kullanici.ruyalar || [];
            kullanici.ruyalar.unshift(ruya);
            localStorage.setItem('kullanici', JSON.stringify(kullanici));
            
            // Rüyaları ve istatistikleri güncelle
            ruyalariGoster();
            istatistikleriGuncelle();
            
            // İstatistik kartlarını güncelle
            const toplamRuya = document.getElementById('toplamRuya');
            const buAyRuya = document.getElementById('buAyRuya');
            
            if (toplamRuya) {
                toplamRuya.textContent = kullanici.ruyalar.length;
            }
            
            if (buAyRuya) {
                const buAyRuyaSayisi = kullanici.ruyalar.filter(r => {
                    const ruyaTarihi = new Date(r.tarih);
                    const simdi = new Date();
                    return ruyaTarihi.getMonth() === simdi.getMonth() &&
                           ruyaTarihi.getFullYear() === simdi.getFullYear();
                }).length;
                buAyRuya.textContent = buAyRuyaSayisi;
            }
        }
    }

    // Rüyaları Gösterme Fonksiyonu
    function ruyalariGoster() {
        const kullanici = JSON.parse(localStorage.getItem('kullanici'));
        const ruyalarContainer = document.querySelector('.ruya-cards');
        
        if (!kullanici || !kullanici.ruyalar || kullanici.ruyalar.length === 0) {
            ruyalarContainer.innerHTML = `
                <div class="empty-state">
                    <p>Henüz rüya eklenmemiş.</p>
                    <p>Yeni bir rüya eklemek için "Yeni Rüya Ekle" butonuna tıklayın.</p>
                </div>
            `;
            return;
        }

        ruyalarContainer.innerHTML = kullanici.ruyalar.map(ruya => `
            <div class="ruya-card" data-id="${ruya.id}">
                <div class="ruya-header">
                    <h4>${ruya.baslik}</h4>
                    ${ruya.lucid ? '<span class="lucid-badge">Lucid</span>' : ''}
                </div>
                <div class="ruya-date">${new Date(ruya.tarih).toLocaleDateString('tr-TR')}</div>
                <div class="ruya-preview">${ruya.icerik.substring(0, 150)}...</div>
                <div class="ruya-actions">
                    <button class="auth-btn" onclick="ruyaDetaylariniGoster(${ruya.id})">Detaylar</button>
                    <button class="auth-btn error" onclick="ruyaSil(${ruya.id})">Sil</button>
                </div>
            </div>
        `).join('');
    }

    // Rüya Silme Fonksiyonu
    window.ruyaSil = function(ruyaId) {
        if (confirm('Bu rüyayı silmek istediğinizden emin misiniz?')) {
            const kullanici = JSON.parse(localStorage.getItem('kullanici'));
            if (kullanici) {
                kullanici.ruyalar = kullanici.ruyalar.filter(ruya => ruya.id !== ruyaId);
                localStorage.setItem('kullanici', JSON.stringify(kullanici));
                
                // Rüyaları ve istatistikleri güncelle
                ruyalariGoster();
                istatistikleriGuncelle();
                
                // İstatistik kartlarını güncelle
                const toplamRuya = document.getElementById('toplamRuya');
                const buAyRuya = document.getElementById('buAyRuya');
                
                if (toplamRuya) {
                    toplamRuya.textContent = kullanici.ruyalar.length;
                }
                
                if (buAyRuya) {
                    const buAyRuyaSayisi = kullanici.ruyalar.filter(r => {
                        const ruyaTarihi = new Date(r.tarih);
                        const simdi = new Date();
                        return ruyaTarihi.getMonth() === simdi.getMonth() &&
                               ruyaTarihi.getFullYear() === simdi.getFullYear();
                    }).length;
                    buAyRuya.textContent = buAyRuyaSayisi;
                }
            }
        }
    };

    // Rüya Detaylarını Gösterme Fonksiyonu
    window.ruyaDetaylariniGoster = function(ruyaId) {
        const kullanici = JSON.parse(localStorage.getItem('kullanici'));
        const ruya = kullanici.ruyalar.find(r => r.id === ruyaId);
        
        if (ruya) {
            const detayModal = document.createElement('div');
            detayModal.className = 'modal';
            detayModal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <div class="ruya-detay">
                        <h2>${ruya.baslik}</h2>
                        <div class="ruya-meta">
                            <span class="ruya-tarih">${new Date(ruya.tarih).toLocaleDateString('tr-TR')}</span>
                            ${ruya.lucid ? '<span class="lucid-badge">Lucid</span>' : ''}
                        </div>
                        <div class="ruya-icerik">
                            ${ruya.icerik.split('\n').map(p => `<p>${p}</p>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(detayModal);
            detayModal.style.display = 'block';
            
            const closeBtn = detayModal.querySelector('.close');
            closeBtn.onclick = () => {
                document.body.removeChild(detayModal);
            };
        }
    };

    // İstatistikleri güncelle
    function istatistikleriGuncelle() {
        const kullanici = JSON.parse(localStorage.getItem('kullanici'));
        if (!kullanici || !kullanici.ruyalar) return;
        
        const toplamRuya = document.getElementById('toplamRuya');
        const buAyRuya = document.getElementById('buAyRuya');
        
        if (toplamRuya) {
            toplamRuya.textContent = kullanici.ruyalar.length;
        }
        
        if (buAyRuya) {
            const buAyRuyaSayisi = kullanici.ruyalar.filter(ruya => {
                const ruyaTarihi = new Date(ruya.tarih);
                const simdi = new Date();
                return ruyaTarihi.getMonth() === simdi.getMonth() &&
                       ruyaTarihi.getFullYear() === simdi.getFullYear();
            }).length;
            buAyRuya.textContent = buAyRuyaSayisi;
        }
    }

    // Google Gemini API ile rüya analizi
    const GEMINI_API_KEY = 'AIzaSyBPuwulZAmR-u4TxOWBm0tffFINOINS5hk';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    // Rüya seçimi için modal oluştur
    const ruyaSecimModal = document.createElement('div');
    ruyaSecimModal.className = 'modal';
    ruyaSecimModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Analiz Edilecek Rüyayı Seçin</h2>
            <div class="ruya-secim-liste">
                <!-- Rüyalar JavaScript ile buraya eklenecek -->
            </div>
        </div>
    `;
    document.body.appendChild(ruyaSecimModal);

    // Rüya seçim modalını kapatma işleyicisi
    const ruyaSecimModalCloseBtn = ruyaSecimModal.querySelector('.close');
    ruyaSecimModalCloseBtn.addEventListener('click', () => {
        ruyaSecimModal.style.display = 'none';
    });

    // Modal dışına tıklandığında kapatma
    ruyaSecimModal.addEventListener('click', (e) => {
        if (e.target === ruyaSecimModal) {
            ruyaSecimModal.style.display = 'none';
        }
    });
    
    // Gemini API ile kapsamlı rüya analizi yapma fonksiyonu
    async function kapsamliRuyaAnalizi(ruyaMetni, ruyaId) {
        const kullanici = JSON.parse(localStorage.getItem('kullanici'));
        
        // Önceden yapılmış analiz var mı kontrol et
        if (kullanici && kullanici.analizler) {
            const analizKey = `${ruyaId}-kapsamli`;
            if (kullanici.analizler[analizKey]) {
                return kullanici.analizler[analizKey];
            }
        }
        
        const prompt = `Aşağıdaki rüyanın kapsamlı bir analizini yap. Analizi üç bölümde gerçekleştir:

1. SEMBOL ANALİZİ:
Rüyada geçen önemli sembolleri tespit et ve her birinin psikolojik anlamını açıkla. En önemli 3-5 sembolü seç.

2. DUYGU ANALİZİ:
Rüyada ifade edilen veya ima edilen duyguları analiz et. Hangi duygular ön planda ve bu duyguların kişinin iç dünyasıyla ilişkisi nedir?

3. TEMA ANALİZİ:
Rüyanın ana temalarını belirle ve bu temaların kişinin hayatındaki olası yansımalarını açıkla.

Her bölüm için detaylı ama özlü açıklamalar yap. Yanıt Türkçe olmalı ve her bölüm açıkça belirtilmeli.

İşte analiz edilecek rüya:

${ruyaMetni}`;
        
        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });
            
            const data = await response.json();
            
            if (response.status !== 200) {
                console.error("API Hatası:", data);
                console.log("Gönderilen prompt:", prompt);
                return `Rüya analizi sırasında bir API hatası oluştu: ${data.error?.message || JSON.stringify(data.error) || 'Bilinmeyen hata'}`;
            }
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const sonuc = data.candidates[0].content.parts[0].text;
                
                // Sonucu sakla
                if (kullanici) {
                    if (!kullanici.analizler) {
                        kullanici.analizler = {};
                    }
                    
                    const analizKey = `${ruyaId}-kapsamli`;
                    kullanici.analizler[analizKey] = sonuc;
                    localStorage.setItem('kullanici', JSON.stringify(kullanici));
                }
                
                return sonuc;
            } else {
                console.error("API Yanıt Hatası:", data);
                return "Rüya analizi sırasında bir hata oluştu. API yanıtı beklenen formatta değil.";
            }
        } catch (error) {
            console.error("Gemini API hatası:", error);
            return "Rüya analizi yapılırken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.";
        }
    }
    
    // Analiz sonuçlarını formatlama fonksiyonu
    function formatAnalizSonucu(sonuc) {
        // Bölüm başlıklarını ve maddeleri HTML formatına dönüştür
        let formatlananSonuc = sonuc
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>')
            .replace(/(\d+\.\s*SEMBOL ANALİZİ:)/g, '<div class="analiz-bolum-baslik">$1</div>')
            .replace(/(\d+\.\s*DUYGU ANALİZİ:)/g, '<div class="analiz-bolum-baslik">$1</div>')
            .replace(/(\d+\.\s*TEMA ANALİZİ:)/g, '<div class="analiz-bolum-baslik">$1</div>')
            .replace(/•\s(.*?)(?=<br>|$)/g, '<div class="analiz-madde"><strong>•</strong> $1</div>')
            .replace(/(\d+)\.\s(.*?)(?=<br>|$)/g, '<div class="analiz-madde"><strong>$1.</strong> $2</div>');
            
        return formatlananSonuc;
    }
    
    // Rüya seçim listesini göster
    function ruyaSecimListesiniGoster() {
        const kullanici = JSON.parse(localStorage.getItem('kullanici'));
        const ruyaSecimListe = ruyaSecimModal.querySelector('.ruya-secim-liste');
        
        if (!kullanici || !kullanici.ruyalar || kullanici.ruyalar.length === 0) {
            ruyaSecimListe.innerHTML = `
                <div class="empty-state">
                    <p>Henüz rüya kaydınız bulunmuyor. Analiz yapabilmek için önce rüyalarınızı kaydetmelisiniz.</p>
                    <button class="auth-btn primary" onclick="sayfaGoster('ruya-gunlugu'); ruyaSecimModal.style.display = 'none';">Rüya Ekle</button>
                </div>
            `;
        } else {
            ruyaSecimListe.innerHTML = kullanici.ruyalar.map(ruya => `
                <div class="ruya-secim-item" data-id="${ruya.id}">
                    <div class="ruya-secim-header">
                        <h4>${ruya.baslik}</h4>
                        <span>${new Date(ruya.tarih).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <p>${ruya.icerik.substring(0, 100)}${ruya.icerik.length > 100 ? '...' : ''}</p>
                    <button class="auth-btn primary ruya-secim-btn" data-id="${ruya.id}">Analiz Et</button>
                </div>
            `).join('');
            
            // Rüya seçim butonlarına tıklama işleyicisi ekle
            const ruyaSecimBtns = ruyaSecimListe.querySelectorAll('.ruya-secim-btn');
            ruyaSecimBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const ruyaId = Number(btn.getAttribute('data-id'));
                    ruyaSecimModal.style.display = 'none';
                    ruyaAnalizEt(ruyaId);
                });
            });
        }
        
        ruyaSecimModal.style.display = 'block';
    }
    
    // Belirli rüyayı analiz et
    async function ruyaAnalizEt(ruyaId) {
        const analizSonuc = document.querySelector('.analiz-sonuc');
        const kullanici = JSON.parse(localStorage.getItem('kullanici'));
        
        if (!kullanici || !kullanici.ruyalar) {
            return;
        }
        
        const ruya = kullanici.ruyalar.find(r => r.id === ruyaId);
        
        if (!ruya) {
            analizSonuc.innerHTML = `
                <div class="analiz-baslik">Rüya Analizi</div>
                <div class="analiz-icerik">
                    <p>Seçilen rüya bulunamadı. Lütfen tekrar deneyin.</p>
                </div>
            `;
            return;
        }
        
        // Yükleniyor göster
        analizSonuc.innerHTML = `
            <div class="analiz-baslik">Rüya Analizi - ${ruya.baslik}</div>
            <div class="analiz-icerik">
                <p>Rüyanız analiz ediliyor...</p>
                <div class="loader"></div>
            </div>
        `;
        
        const ruyaMetni = `Rüya: ${ruya.baslik}\n${ruya.icerik}`;
        
        try {
            const sonuc = await kapsamliRuyaAnalizi(ruyaMetni, ruyaId);
            const formatlananSonuc = formatAnalizSonucu(sonuc);
            
            analizSonuc.innerHTML = `
                <div class="analiz-baslik">Rüya Analizi - ${ruya.baslik}</div>
                <div class="analiz-icerik">
                    <div class="kapsamli-analiz">
                        ${formatlananSonuc}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error("Analiz hatası:", error);
            analizSonuc.innerHTML = `
                <div class="analiz-baslik">Rüya Analizi</div>
                <div class="analiz-icerik">
                    <p>Analiz sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
                    <p>Hata detayı: ${error.message || 'Bilinmeyen hata'}</p>
                </div>
            `;
        }
    }
    
    // Analiz butonuna tıklama işleyicisi
    const analizBtn = document.getElementById('analizBtn');
    if (analizBtn) {
        analizBtn.addEventListener('click', () => {
            ruyaSecimListesiniGoster();
        });
    }

    // Sayfa değişikliklerinde kullanmak için global fonksiyon
    window.sayfaGoster = sayfaGoster;
});