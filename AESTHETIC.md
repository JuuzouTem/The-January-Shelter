# AESTHETIC.md

## 1. Project Overview (REVISED: AESTHETIC FOCUS)
**Mevcut Durum:** Projenin iskeleti çalışıyor ancak görsel hiyerarşi, oranlar (scaling), asset yerleşimi ve atmosfer eksik.
**Yeni Hedef:** Kodun mantığını değiştirmeden, **CSS, Tailwind ve Framer Motion** kullanarak "High-End", pürüzsüz ve estetik bir görünüm elde etmek.
**Anahtar Kelimeler:** Responsive Design, Absolute Positioning, Glassmorphism, Particle Effects, Smooth Transitions.

## 2. Updated Tech Instructions
-   **CSS Konumlandırma:** Tüm oda elemanları (Radyo, Çay, Kitap) `absolute` positioning ile yerleştirilecek. Yüzdelik (`top-[50%] left-[20%]`) değerler kullanılarak ekran boyutuna göre orantılı kalmaları sağlanacak.
-   **Görsel Boyutları:** Hiçbir görsel ham boyutuyla kullanılmayacak. Hepsi `w-24`, `w-32` gibi sınırlı genişliklere sahip olacak.
-   **Fontlar:** Google Fonts'tan `Inter` (UI için) ve `Dancing Script` veya `Handlee` (Mektup ve notlar için) eklenecek.

## 3. Directory Structure Update
*(Mevcut yapı korunuyor, sadece yeni bileşenler eklenecek)*
```ascii
src/components/
├── UI/
│   ├── PolaroidGallery.tsx  # (Yeni) Fotoğraf sergileme alanı
│   └── BackButton.tsx       # (Yeni) Şık geri dön butonu
```

## 4. Aesthetic Correction Roadmap (The 12-Step Plan)

Geliştirici, aşağıdaki maddeleri sırasıyla ve **görsel onayı alarak** uygulamalıdır:

### Phase 1: Global Atmosphere & Entry
- [ ] **1. Giriş Ekranı Düzenlemesi:**
    -   Butonu kaldır.
    -   Tüm ekrana görünmez bir `div` (overlay) koy. Kullanıcı ekranda **herhangi bir yere** tıkladığında giriş yapılsın.
    -   "Sığınağa Gir" yazısı yerine, ekranın altında yanıp sönen (pulse animation) *"[Girmek için dokun]"* yazısı olsun.
- [ ] **2. Background Fix:**
    -   `page.tsx` ana kapsayıcısına `bg-[url('/images/room-bg.png')] bg-cover bg-center bg-no-repeat h-screen w-screen overflow-hidden` classlarını ver.
    -   Resmin yüklendiğinden emin ol (Public klasör yolu kontrolü).

### Phase 2: Object Placement & Sizing (The Room)
- [ ] **3. Nesne Boyutlandırma:**
    -   Tüm nesneler (Radyo, Çay, Kitap) ekranı kaplamamalı.
    -   Maksimum genişlikleri sınırla (Örn: Radyo `w-40`, Çay `w-20`, Kitaplar `w-32`).
- [ ] **4. Yerleşim (Absolute Layout):**
    -   Flexbox yerine `relative` ana container içinde `absolute` pozisyonlama kullan.
    -   Örnek: Kitaplar `bottom-10 right-10`, Çay `bottom-20 left-1/4`. Görsellerin havada uçuşmadığından, masanın veya rafın üzerindeymiş gibi durduğundan emin ol.
- [ ] **5. Baykuş Entegrasyonu:**
    -   CSS çizimi yerine `public/images/owl.png` dosyasını kullan.
    -   Konum: Dolabın üstü veya bir dalın üstü (`top-10 right-20` vb.).
    -   Animasyon: `animate-bounce` yerine hafif bir `y` ekseni salınımı (floating) ekle.

### Phase 3: Interactive Components Polish
- [ ] **6. Radyo UI İyileştirmesi:**
    -   Mevcut "sarı kutu" görünümünü daha minimal yap veya asset kullanıyorsan gölge (`drop-shadow-2xl`) ekle.
    -   Player kontrolleri (Play/Pause) radyo görselinin üzerine hover yapınca görünsün ya da çok şık, ufak butonlar olsun.
- [ ] **7. Çay İçme Animasyonu (Liquid Effect):**
    -   5 farklı resim kullanmak yerine CSS Masking kullan.
    -   Çay bardağı görselinin (PNG) içinde, çayın olduğu kısma denk gelen kırmızı bir `div` koy.
    -   Tıklandıkça bu kırmızı `div`'in `height` değerini azalt (`transition-all duration-500`).
- [ ] **8. Kitap/Not Defteri Modal:**
    -   Modal açıldığında ekranı kaplamasın (`max-w-lg`).
    -   Arka plan: "Kağıt dokusu" (Paper texture) rengi (`bg-[#fdfbf7]`).
    -   Font: El yazısı fontu (`Dancing Script`).
    -   Kenarlıklar: Hafif yırtık kağıt efekti veya `rounded-sm` + `shadow-xl`.

### Phase 4: The Finale (Constellation & Letter)
- [ ] **9. Constellation (Takımyıldız) Estetiği:**
    -   Flins C6 görselini referans olarak arkaya silik (`opacity-30`) koy.
    -   Üzerine gelen noktalar (yıldızlar) "Glowing Dot" (parlayan nokta) şeklinde CSS efektiyle olsun (`box-shadow` ile glow ver).
    -   Çizgiler svg `stroke` animasyonu ile çizilsin.
    -   "Odaya Dön" butonu: Ekranın ortasında değil, sol üst köşede şık, küçük bir `<` (Geri) ikonu olsun.
- [ ] **10. Parıltı ve Ses (Sparkle):**
    -   Şekil tamamlandığında `canvas-confetti` patlat.
    -   Tam o anda `sparkle.mp3` ve Genshin "Wish" sesi çalsın.
- [ ] **11. Mektup Ekranı (The Gift):**
    -   Basit beyaz div yerine, **Çift Sayfalı Kitap** veya **Parşömen** görünümü tasarla.
    -   Yazı tipi okunaklı bir tırnaklı font (Serif) veya el yazısı olsun.
    -   Metin, daktilo efektiyle (Typewriter effect) yavaşça yazılsın.

### Phase 5: Missing Details
- [ ] **12. Eksik Parçalar:**
    -   **Pencere:** Eğer arka plan resminde pencere yoksa, CSS ile yarı saydam bir "Pencere Çerçevesi" div'i oluştur ve `tsparticles` kar yağışını bu pencerenin arkasında (z-index) oynat.
    -   **Polaroids:** `public/images/polaroids` klasöründeki görselleri al. Odanın duvarına `rotate-6`, `-rotate-12` gibi rastgele açılarla asılmış gibi yerleştir (`PolaroidGallery` bileşeni). Tıklayınca büyüsünler (Lightbox).

---

### Geliştiriciye Not:
Lütfen yukarıdaki maddeleri **sırasıyla** yap. Önce 1, sonra 2... Her madde bittiğinde görsel veya onay iste. Estetik, kodun çalışmasından daha öncelikli şu an.
