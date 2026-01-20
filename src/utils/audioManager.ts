

export const CACHE_NAME = 'january-shelter-music-v1';

export const getAudioSource = async (src: string): Promise<{ url: string; isBlob: boolean }> => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(src);

    if (cachedResponse) {
      const blob = await cachedResponse.blob();
      return { url: URL.createObjectURL(blob), isBlob: true };
    }
  } catch (error) {
    console.warn('Cache erişim hatası:', error);
  }

  return { url: src, isBlob: false };
};

export const downloadToCache = async (src: string) => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(src);
    
    if (!match) {
        await cache.add(src);
        console.log(`[Cache] İndirildi: ${src}`);
        return true;
    }
    return false;
  } catch (e) {
    console.error(`[Cache] İndirme hatası (${src}):`, e);
    return false;
  }
};