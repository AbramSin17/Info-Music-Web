// lib/api.ts

// Pastikan Anda mendapatkan API key dari variabel lingkungan
// Awalan NEXT_PUBLIC_ diperlukan agar variabel ini dapat diakses di sisi klien (browser)
const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const BANDSINTOWN_APP_ID = process.env.NEXT_PUBLIC_BANDSINTOWN_APP_ID;

// Fungsi untuk mendeteksi placeholder Last.fm (sama seperti di page.tsx)
const isLastFmKnownPlaceholder = (url: string): boolean => {
  if (!url) return false;
  return url.includes('2a96cbd8b46e442fc41c2b86b821562f.png') ||
         url.includes('default_avatar.png') ||
         url.includes('_avatar.png');
};

// Fungsi untuk mengambil detail artis dari Last.fm
export async function getAllArtistDetails(artistNameOrMbid: string): Promise<any | null> {
  if (!LASTFM_API_KEY) {
    console.error("LASTFM_API_KEY is not defined.");
    return null;
  }
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistNameOrMbid)}&api_key=${LASTFM_API_KEY}&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching artist details: ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    return data.artist;
  } catch (error) {
    console.error("Failed to fetch artist details:", error);
    return null;
  }
}

// Fungsi untuk mencari artis di Last.fm
export async function searchArtistLastFm(query: string): Promise<any[]> {
  if (!LASTFM_API_KEY) {
    console.error("LASTFM_API_KEY is not defined.");
    return [];
  }
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error searching artist: ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    return data.results?.artistmatches?.artist || [];
  } catch (error) {
    console.error("Failed to search artist:", error);
    return [];
  }
}

// Fungsi untuk mengambil detail beberapa artis dari Last.fm
export async function getMultipleArtistsDetails(artistNames: string[]): Promise<any[]> {
  if (!LASTFM_API_KEY) {
    console.error("LASTFM_API_KEY is not defined.");
    return [];
  }
  const promises = artistNames.map(name => getAllArtistDetails(name));
  const results = await Promise.all(promises);
  return results.filter(artist => artist !== null);
}

// Fungsi untuk mengambil gambar artis dari Bandsintown
export async function getArtistImageFromBandsintown(artistName: string): Promise<string | null> {
  if (!BANDSINTOWN_APP_ID) {
    console.error("BANDSINTOWN_APP_ID is not defined.");
    return null;
  }
  const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(artistName)}?app_id=${BANDSINTOWN_APP_ID}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching Bandsintown artist image for ${artistName}: ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    // Bandsintown API mengembalikan 'image_url' untuk gambar profil artis
    return data.image_url || null;
  } catch (error) {
    console.error(`Failed to fetch Bandsintown artist image for ${artistName}:`, error);
    return null;
  }
}

// Fungsi untuk mengambil top album dari Last.fm
export async function getArtistTopAlbumsLastFm(artistName: string, mbid?: string): Promise<any[]> {
  if (!LASTFM_API_KEY) {
    console.error("LASTFM_API_KEY is not defined.");
    return [];
  }
  const identifier = mbid ? `mbid=${mbid}` : `artist=${encodeURIComponent(artistName)}`;
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&${identifier}&api_key=${LASTFM_API_KEY}&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching top albums: ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    return data.topalbums?.album || [];
  } catch (error) {
    console.error("Failed to fetch top albums:", error);
    return [];
  }
}

// Fungsi untuk mengambil top track dari Last.fm
export async function getArtistTopTracksLastFm(artistName: string, mbid?: string): Promise<any[]> {
  if (!LASTFM_API_KEY) {
    console.error("LASTFM_API_KEY is not defined.");
    return [];
  }
  const identifier = mbid ? `mbid=${mbid}` : `artist=${encodeURIComponent(artistName)}`;
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&${identifier}&api_key=${LASTFM_API_KEY}&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching top tracks: ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    return data.toptracks?.track || [];
  } catch (error) {
    console.error("Failed to fetch top tracks:", error);
    return [];
  }
}

// Fungsi untuk mengambil event artis dari Bandsintown
export async function getArtistEventsFromBandsintown(artistName: string): Promise<any[]> {
  if (!BANDSINTOWN_APP_ID) {
    console.error("BANDSINTOWN_APP_ID is not defined.");
    return [];
  }
  const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(artistName)}/events?app_id=${BANDSINTOWN_APP_ID}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching Bandsintown events for ${artistName}: ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error(`Failed to fetch Bandsintown events for ${artistName}:`, error);
    return [];
  }
}
