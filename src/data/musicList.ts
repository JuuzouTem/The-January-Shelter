// dosya: src/data/musicList.ts

export interface Song {
  id: number; // ID'leri unique tutuyoruz
  title: string;
  artist: string;
  src: string;
}

// Standart Döngüde Çalacaklar
export const standardMusicList: Song[] = [
  { id: 1, title: "Telephone", artist: "Lady Gaga ft. Beyoncé", src: "/sounds/telephone.mp3" },
  { id: 2, title: "Like Him", artist: "Tyler, The Creator", src: "/sounds/like-him.mp3" },
  { id: 3, title: "Furina Theme", artist: "HoyoMix", src: "/sounds/furina-theme.mp3" },
  { id: 4, title: "LoveGame", artist: "Lady Gaga", src: "/sounds/love-game.mp3" },
  { id: 5, title: "No One Noticed", artist: "The Marías", src: "/sounds/no-one-noticed.mp3" },
  { id: 6, title: "High", artist: "Arctic Monkeys", src: "/sounds/high.mp3" },
  { id: 7, title: "Do I Wanna Know?", artist: "Arctic Monkeys", src: "/sounds/do-i-wanna-know.mp3" },
  { id: 8, title: "Stereo Love", artist: "Edward Maya", src: "/sounds/stereo-love.mp3" },
  { id: 9, title: "Furina Demo", artist: "HoyoMix", src: "/sounds/furina-demo.mp3" },
];

// Özel Şarkılar (Haberci ve Easter Egg)
export const easterEggSongs = {
  intro: { 
    id: 998, 
    title: "Cigarettes Out the Window", 
    artist: "TV Girl", 
    src: "/sounds/cigarettes-out-window.mp3" 
  },
  main: { 
    id: 999, 
    title: "Masquerade", 
    artist: "Dangerously Yours", 
    src: "/sounds/masquerade.mp3" 
  }
};