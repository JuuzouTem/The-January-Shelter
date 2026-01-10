

export interface Song {
  id: number;
  title: string;
  artist: string;
  src: string;
}


export const standardMusicList: Song[] = [
  { id: 1, title: "Do I Wanna Know?", artist: "Arctic Monkeys", src: "/sounds/do-i-wanna-know.mp3" },
  { id: 2, title: "High", artist: "Arctic Monkeys", src: "/sounds/high.mp3" },
  { id: 3, title: "No One Noticed", artist: "The Marías", src: "/sounds/no-one-noticed.mp3" },
  { id: 4, title: "Like Him", artist: "Tyler, The Creator", src: "/sounds/like-him.mp3" },
  { id: 5, title: "LoveGame", artist: "Lady Gaga", src: "/sounds/love-game.mp3" },
  { id: 6, title: "Telephone", artist: "Lady Gaga ft. Beyoncé", src: "/sounds/telephone.mp3" },
  { id: 7, title: "Stereo Love", artist: "Edward Maya", src: "/sounds/stereo-love.mp3" },
  { id: 8, title: "Furina Demo", artist: "HoyoMix", src: "/sounds/furina-demo.mp3" },
  { id: 9, title: "Furina Theme", artist: "HoyoMix", src: "/sounds/furina-theme.mp3" },
  { id: 10, title: "Home", artist: "Toby Fox", src: "/sounds/home.mp3" },
  { id: 11, title: "Undertale", artist: "Toby Fox", src: "/sounds/undertale.mp3" },
  { id: 12, title: "The Voice", artist: "Violet Evergarden", src: "/sounds/voice.mp3" },
];


export const easterEggSongs = {
  intro: { 
    id: 998, 
    title: "Cigarettes Out the Window", 
    artist: "TV Girl", 
    src: "/sounds/cigarettes-out-window.mp3" 
  },
  main: { 
    id: 999, 
    title: "The Masquerade", 
    artist: "Dangerously Yours", 
    src: "/sounds/masquerade.mp3" 
  }
};