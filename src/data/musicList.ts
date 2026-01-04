export interface Song {
  id: number;
  title: string;
  artist: string;
  src: string; // public/sounds/ klasöründeki dosya yolu
}

export const musicList: Song[] = [
  {
    id: 1,
    title: "Like Him",
    artist: "Tyler, The Creator",
    src: "/sounds/bg-music.mp3" // Demo için aynı dosya
  },
  {
    id: 2,
    title: "Judas",
    artist: "Lady Gaga",
    src: "/sounds/bg-music.mp3"
  },
  {
    id: 3,
    title: "Genshin Main Theme",
    artist: "Yu-Peng Chen",
    src: "/sounds/bg-music.mp3"
  }
];