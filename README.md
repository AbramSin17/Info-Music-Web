# ArtistHub: Platform Penemuan Artis Musik

[](https://www.google.com/search?q=https://github.com/abramsin17/info-music-web/actions)
[](https://www.google.com/search?q=LICENSE)
[](https://v0-info-music.vercel.app/)

## ✨ Deskripsi Proyek

**ArtistHub** adalah platform penemuan artis musik yang inovatif dan interaktif, dirancang khusus untuk para pecinta musik sejati. Jelajahi dunia musisi favorit Anda dengan detail mendalam, temukan konser dan acara mendatang, catat kenangan pribadi Anda tentang event, dan kelola daftar artis favorit Anda dengan mudah. Dengan antarmuka pengguna yang responsif, visual yang memukau, dan pengalaman yang intuitif, ArtistHub adalah teman terbaik Anda dalam perjalanan musik.

## 🚀 Live Demo

Rasakan sendiri pengalaman ArtistHub secara langsung\!

**🔗 [Kunjungi ArtistHub Live Demo](https://v0-info-music.vercel.app/)**

## 💡 Fitur-Fitur Utama

  * **🎤 Penemuan Artis Interaktif:** Jelajahi daftar artis populer atau cari artis spesifik berdasarkan nama atau genre dengan debounce pencarian real-time untuk pengalaman yang mulus.
  * **Detailed Artist Profiles:** Dapatkan informasi mendalam tentang artis, termasuk biografi, genre, album teratas, dan lagu teratas./page.tsx]
  * **❤️ Artis Favorit (Likes):** Simpan artis favorit Anda ke daftar "Liked Artists" untuk akses cepat. Status "disukai" akan bertahan di browser Anda bahkan setelah me-refresh halaman.
  * **🗓️ Event & Konser Mendatang:** Temukan daftar lengkap acara dan konser musik yang akan datang dari berbagai artis.
  * **📝 Catatan Event Pribadi (CRUD):** Buat, baca, perbarui, dan hapus catatan pribadi untuk setiap acara atau konser yang Anda temukan, memungkinkan Anda menyimpan kenangan dan pemikiran.
  * **🎨 Desain Responsif & Modern:** Antarmuka pengguna yang dioptimalkan untuk berbagai ukuran layar (desktop, tablet, mobile) dengan estetika visual yang menonjol.
  * **🌙 Dukungan Tema Gelap:** Beralih antara tema terang dan gelap untuk pengalaman visual yang nyaman.

## 🛠️ Teknologi yang Digunakan

  * **Next.js:** Framework React untuk aplikasi web siap produksi.
  * **React:** Pustaka JavaScript untuk membangun antarmuka pengguna.
  * **TypeScript:** Superset JavaScript yang menambahkan pengetikan statis.
  * **Tailwind CSS:** Framework CSS utility-first untuk styling cepat dan konsisten.
  * **shadcn/ui:** Kumpulan komponen UI yang dapat di-custom, dibangun di atas Radix UI dan Tailwind CSS.
  * **Lucide React:** Kumpulan ikon.
  * **Date-fns:** Pustaka utilitas tanggal modern.
  * **Last.fm API:** Sumber data untuk detail artis, album, dan lagu.
  * **Bandsintown API:** Sumber data untuk event/konser artis dan gambar artis tambahan.

## 🏗️ Struktur Proyek & Komponen

Proyek ArtistHub mengadopsi arsitektur komponen yang modular dan terorganisir untuk memfasilitasi pengembangan dan pemeliharaan:

  * **`app/`**: Direktori utama Next.js App Router yang mendefinisikan rute dan halaman aplikasi.
      * `page.tsx`: Halaman utama "Discover Artists".
      * `artist/[id]/page.tsx`: Halaman detail artis dinamis./page.tsx]
      * `events/page.tsx`: Halaman "Events & Concerts".
      * `notes/page.tsx`: Halaman "My Notes".
      * `likes/page.tsx`: Halaman "Liked Artists".
      * `api/`: Direktori untuk API Routes internal (misalnya, `artists/route.ts`).
  * **`components/`**: Berisi komponen React yang spesifik untuk aplikasi.
      * `ui/`: Subdirektori untuk komponen UI yang dapat digunakan kembali, sebagian besar berasal dari `shadcn/ui` (misalnya, `button.tsx`, `card.tsx`, `input.tsx`, `dialog.tsx`).
      * Komponen aplikasi lainnya seperti `artist-card.tsx`, `event-note-modal.tsx`, `sidebar-layout.tsx`.
  * **`lib/`**: Berisi fungsi utilitas dan logika API (misalnya, `api.ts`, `utils.ts`).
  * **`hooks/`**: Berisi React hooks kustom (misalnya, `use-toast.ts`, `use-mobile.ts`).

## 🚀 Getting Started (Pengembangan Lokal)

Untuk menjalankan proyek ini di lingkungan pengembangan lokal Anda, ikuti langkah-langkah berikut:

### Prasyarat

  * **Node.js**: Pastikan Anda telah menginstal Node.js (versi LTS direkomendasikan, seperti `v18.x` atau lebih baru) dan `npm` atau `yarn`.

### 1\. Kloning Repositori

```bash
git clone https://github.com/abramsin17/info-music-web.git
cd info-music-web
```

### 2\. Instal Dependensi

Gunakan `npm` atau `yarn` untuk menginstal semua dependensi proyek:

```bash
npm install
# atau
yarn install
```

### 3\. Konfigurasi API Keys

Buat file `.env.local` di root proyek dan tambahkan API key Anda:

```env
NEXT_PUBLIC_LASTFM_API_KEY=YOUR_LASTFM_API_KEY
NEXT_PUBLIC_BANDSINTOWN_APP_ID=YOUR_BANDSINTOWN_APP_ID
```

*Pastikan untuk mengganti `YOUR_LASTFM_API_KEY` dan `YOUR_BANDSINTOWN_APP_ID` dengan kunci API Anda yang sebenarnya.*

### 4\. Jalankan Server Pengembangan

Mulai server pengembangan Next.js:

```bash
npm run dev
# atau
yarn dev
```

### 5\. Akses Aplikasi

Buka browser Anda dan navigasikan ke `http://localhost:3000`.

## 🌐 Deployment

Proyek ArtistHub telah di-deploy dan dapat diakses secara publik.

### Lingkungan Hosting

Aplikasi ini di-deploy di **Vercel**.

### Tautan Demo Langsung

**🔗 [ArtistHub Live Demo](https://v0-info-music.vercel.app/)**
