# The-January-Shelter

## 1. Project Overview
**Proje Adı:** The January Shelter (Ocak Sığınağı)
**Amaç:** Yakın bir arkadaş için (INTP, Genshin/Naruto seven, duygusal ama mizahi yönü kuvvetli) doğum günü hediyesi olarak tasarlanmış, interaktif bir web deneyimi.
**Konsept:** Kullanıcı, karlı bir Ocak gecesinde sıcak bir ağaç evin içindedir. Bu oda onun "Güvenli Alanı"dır (Comfort Zone). Odadaki eşyalarla etkileşime girerek anıları canlandırır. Finalde teleskopla gökyüzüne bakıp özel bir takımyıldızı birleştirerek ana hediyeye (Mektup) ulaşır.

**Ana Atmosfer:**
-   **Renk Paleti:** Koyu Lacivert (Navy Blue), Mor (Genshin Electro), Altın Sarısı (Işıltılar).
-   **Vibe:** Cozy, Nostaljik, Loş, "High-End" Animasyonlar.

## 2. Tech Stack & Dependencies
Bu proje, görsel akıcılık ve etkileşim odaklı olduğu için modern React ekosistemi kullanılacaktır.

-   **Framework:** Next.js 14 (App Router)
-   **Dil:** TypeScript
-   **Styling:** Tailwind CSS (Hızlı stil ve layout)
-   **Animasyon:** Framer Motion (Sahne geçişleri, hover efektleri, bouncy animasyonlar için *kritik*)
-   **Efektler:**
    -   `react-confetti` veya `canvas-confetti` (Final kutlaması için)
    -   `react-tsparticles` (Dışarıdaki kar yağışı ve gökyüzü yıldızları için)
-   **Ses:** `howler.js` (Müzik player ve SFX yönetimi için)
-   **State Management:** React Context API (Basit state yönetimi: Müzik çalıyor mu? Hangi sahne? Çay bitti mi?)
-   **Icons:** Lucide React

## 3. Directory Structure

```ascii
/
├── public/
│   ├── images/
│   │   ├── room-bg.png       # Ağaç ev illüstrasyonu (veya CSS ile yapılacak)
│   │   ├── flins-c6.png      # Referans takımyıldız görseli
│   │   ├── items/            # Baykuş, Radyo, Kitap, Çay görselleri
│   │   └── polaroids/        # Arkadaşının fotoğrafları
│   └── sounds/
│       ├── bg-music.mp3      # Tyler/Lady Gaga playlist
│       ├── wind.mp3          # Dış ses
│       ├── glitch.mp3        # Bitki şakası sesi
│       └── hoot.mp3          # Baykuş sesi
├── src/
│   ├── app/
│   │   ├── page.tsx          # Ana giriş (Loading + Scene Switcher)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Room/
│   │   │   ├── RoomScene.tsx     # Ana oda container'ı
│   │   │   ├── InteractiveItem.tsx # Tıklanabilir nesne bileşeni
│   │   │   ├── RadioPlayer.tsx   # Winamp tarzı player
│   │   │   ├── PlantGlitch.tsx   # Bitki şakası mantığı
│   │   │   └── TeaCup.tsx        # İçildikçe azalan bardak
│   │   ├── Sky/
│   │   │   ├── SkyScene.tsx      # Teleskop görünümü
│   │   │   └── ConstellationGame.tsx # Yıldız birleştirme oyunu
│   │   ├── UI/
│   │   │   ├── LetterModal.tsx   # Defter/Mektup açılır penceresi
│   │   │   └── BookQuotes.tsx    # Rastgele söz baloncukları
│   │   └── Effects/
│   │       ├── SnowFall.tsx      # Pencere arkası kar efekti
│   │       └── GlitchEffect.tsx  # Bitki için görsel bozulma
│   ├── data/
│   │   ├── quotes.ts         # Kitaplıktan çıkacak sözler/TikTok şakaları
│   │   ├── musicList.ts      # Şarkı listesi
│   │   └── letterContent.ts  # Uzun doğum günü mektubu
│   └── context/
│       └── GameContext.tsx   # Global state (Ses, Sahne durumu)
└── PROJECT_MASTER.md
```

## 4. Development Rules

1.  **Mobile First değil, "Experience First":** Site mobilde çalışmalı ama tasarımın asıl gücü Desktop'ta ortaya çıkmalı. Mobilde yatay (landscape) uyarı verilebilir.
2.  **Renk Kodları:**
    -   Background: `#0a0f1e` (Çok koyu lacivert)
    -   Accent: `#7c3aed` (Electro Purple - Flins için)
    -   Text: `#e2e8f0` (Yumuşak beyaz)
3.  **Etkileşim Hissi:** Her tıklanabilir nesne, mouse üzerine geldiğinde (hover) hafifçe büyümeli veya parlamalı (Genshin Impact etkileşimleri gibi).
4.  **Ses Politikası:** Tarayıcılar otomatik ses oynatmayı engeller. Giriş ekranında "Odaya Gir" butonu olmalı, tıklandığında müzik başlamalı.
5.  **Clean Code:** Bileşenleri küçük parçalara böl. `page.tsx` içinde 1000 satır kod olmasın.

## 5. Roadmap & Status

- [ ] **Phase 1: Setup & Atmosphere**
  - [ ] Next.js projesini kur (Tailwind + Framer Motion).
  - [ ] Varlık (Asset) yönetimi: Görselleri ve sesleri `public` klasörüne hazırla.
  - [ ] Giriş Ekranı: "She was born in January..." yazısı ve "Giriş" butonu.

- [ ] **Phase 2: The Treehouse (Interactive Room)**
  - [ ] Arka plan ve pencere (Dışarıda yağan kar efekti - Particles.js).
  - [ ] **Radyo:** Winamp benzeri mini player. (Şarkılar: Tyler - Like Him, Lady Gaga).
  - [ ] **Çay/Ayran:** Tıkladıkça opacity/doluluk oranı azalan bardak bileşeni.
  - [ ] **Bitki (Easter Egg):** Tıklayınca ekranı sarsan (shake), sesi bozan ve "BİTKİ PORNOSU!" yazan glitch efekti.
  - [ ] **Baykuş:** Tıklayınca göz kırpıp "Hoot hoot" diyen ve baloncuk çıkaran animasyon.
  - [ ] **Kitaplık:** Tıklayınca `data/quotes.ts`'den rastgele bir string seçip ekranda gösteren modal.

- [ ] **Phase 3: The Sky & The Gift (Finale)**
  - [ ] **Teleskop:** Tıklayınca `RoomScene` kapanır, `SkyScene` (Uzay) açılır (Fade transition).
  - [ ] **Constellation Game:** Ekrana "Flins" (Mor şişe/kılıç şekli) takımyıldızının noktaları sönük halde gelir.
  - [ ] Kullanıcı noktaları sırayla tıklar/sürükler.
  - [ ] Şekil tamamlanınca mor bir patlama olur ve **"Mektup Defteri"** açılır.

- [ ] **Phase 4: Content & Polish**
  - [ ] Mektup içeriğini (Defter görünümünde) ekle.
  - [ ] Fotoğraf slaytlarını duvara ekle.
  - [ ] Ses efektlerini (SFX) senkronize et.
  - [ ] Deploy (Vercel).
