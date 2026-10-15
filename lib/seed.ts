import bcrypt from "bcryptjs"
import type { PrismaClient } from "./generated/prisma/client"

// Data contoh awal. Foto memakai gambar publik (Unsplash & randomuser.me)
// sebagai placeholder sampai siswa mengunggah foto aslinya.

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?w=1400&q=75&auto=format&fit=crop`

const PHOTO = {
  arduino: unsplash("photo-1553406830-ef2513450d76"),
  pcb: unsplash("photo-1518770660439-4636190af475"),
  wiring: unsplash("photo-1558346490-a72e53ae2d4f"),
  kitBlue: unsplash("photo-1603732551658-5fabbafa84eb"),
  lampTeal: unsplash("photo-1513506003901-1e6a229e2d15"),
  lampGrey: unsplash("photo-1565814329452-e1efa11c5b89"),
  sketch: unsplash("photo-1581092160562-40aa08e78837"),
  pcbGreen: unsplash("photo-1517077304055-6e89abbf09b0"),
  parts: unsplash("photo-1555664424-778a1e5e1b48"),
  solder: unsplash("photo-1563770660941-20978e870e26"),
  panel: unsplash("photo-1544724569-5f546fd6f2b5"),
  pcbBlue: unsplash("photo-1592659762303-90081d34b277"),
  phone: unsplash("photo-1586953208448-b95a79798f07"),
}

const VIDEO = {
  streetLight: "https://www.youtube.com/watch?v=WZTcUlsMG3c",
  ldrRelay: "https://www.youtube.com/watch?v=lP21i1iaAEc",
  wifiRelay: "https://www.youtube.com/watch?v=wdgWdxV60dg",
  arduinoLdr: "https://www.youtube.com/watch?v=OapZNPaKrmA",
  espRelay: "https://www.youtube.com/watch?v=gvciRSFcaWQ",
}

type Template = {
  title: string
  tagline: string
  description: string
  how: string
  components: string[]
  steps: { title: string; detail: string }[]
  remoteLabel: string
  remoteUrl: string
  remoteNote: string
  media: { kind: "image" | "youtube"; url: string; caption: string }[]
}

const TEMPLATES: Template[] = [
  {
    title: "LumiSense — Lampu Pintar Sensor Cahaya",
    tagline: "Lampu menyala sendiri saat hari mulai gelap.",
    description:
      "LumiSense adalah miniatur saklar lampu otomatis yang membaca intensitas cahaya menggunakan sensor LDR. Saat cahaya di sekitar rumah meredup, ESP32 menyalakan lampu lewat relay, dan semua status bisa dipantau dari aplikasi Blynk di HP.",
    how: "Sensor LDR mengirim nilai analog ke ESP32. Jika nilai berada di bawah ambang (threshold) yang bisa diatur dari aplikasi, ESP32 mengaktifkan relay sehingga lampu menyala. Status lampu dan nilai cahaya dikirim ke Blynk Cloud setiap 2 detik.",
    components: ["ESP32 DevKit V1", "Sensor LDR + resistor 10kΩ", "Modul relay 1 channel 5V", "Lampu LED 5V", "Breadboard & kabel jumper", "Adaptor 5V 2A", "Miniatur rumah (karton/akrilik)"],
    steps: [
      { title: "Sambungkan daya", detail: "Colokkan adaptor 5V ke port daya miniatur. Lampu indikator biru pada ESP32 akan menyala." },
      { title: "Hubungkan ke Wi-Fi", detail: "Tunggu ±10 detik sampai ESP32 tersambung ke hotspot \"IOT-LAB\". LED indikator berkedip 2 kali tanda sukses." },
      { title: "Uji sensor cahaya", detail: "Tutup sensor LDR dengan jari. Lampu akan menyala otomatis, lalu padam saat sensor dibuka kembali." },
      { title: "Kontrol dari HP", detail: "Buka tautan akses remote, login, lalu gunakan tombol MODE untuk beralih antara Otomatis dan Manual." },
    ],
    remoteLabel: "Blynk Dashboard",
    remoteUrl: "https://blynk.cloud",
    remoteNote: "Minta akun demo ke ketua kelompok. Gunakan tab \"Device\" → LumiSense.",
    media: [
      { kind: "image", url: PHOTO.kitBlue, caption: "Rangkaian ESP32, LDR, dan relay sebelum dirakit" },
      { kind: "image", url: PHOTO.lampTeal, caption: "Lampu menyala otomatis saat ruangan gelap" },
      { kind: "youtube", url: VIDEO.streetLight, caption: "Video referensi: lampu otomatis ESP8266 + LDR" },
      { kind: "image", url: PHOTO.wiring, caption: "Proses wiring di breadboard" },
    ],
  },
  {
    title: "GerakNyala — Saklar Otomatis Sensor Gerak",
    tagline: "Ada orang lewat? Lampu langsung menyala.",
    description:
      "GerakNyala memakai sensor PIR untuk mendeteksi gerakan di dalam ruangan. Lampu menyala ketika ada orang dan padam otomatis setelah 30 detik tidak ada gerakan. Cocok untuk lorong dan kamar mandi agar hemat listrik.",
    how: "Sensor PIR HC-SR501 mengirim sinyal HIGH saat mendeteksi gerakan. NodeMCU ESP8266 menyalakan relay dan memulai timer 30 detik. Setiap gerakan baru me-reset timer. Notifikasi dikirim ke bot Telegram kelompok.",
    components: ["NodeMCU ESP8266", "Sensor PIR HC-SR501", "Modul relay 1 channel", "Lampu LED strip 5V", "Buzzer (opsional)", "Kabel jumper", "Miniatur lorong rumah"],
    steps: [
      { title: "Nyalakan prototype", detail: "Sambungkan kabel USB ke power bank atau adaptor 5V." },
      { title: "Tunggu kalibrasi PIR", detail: "Diamkan prototype ±30 detik agar sensor PIR selesai kalibrasi." },
      { title: "Lambaikan tangan", detail: "Gerakkan tangan di depan sensor. Lampu menyala dan bot Telegram mengirim pesan \"Gerakan terdeteksi\"." },
      { title: "Kendalikan dari Telegram", detail: "Kirim perintah /on, /off, atau /status ke bot kelompok lewat tautan akses remote." },
    ],
    remoteLabel: "Bot Telegram",
    remoteUrl: "https://web.telegram.org",
    remoteNote: "Cari bot @GerakNyalaBot lalu ketik /start.",
    media: [
      { kind: "image", url: PHOTO.parts, caption: "Komponen yang kami gunakan" },
      { kind: "image", url: PHOTO.lampGrey, caption: "Lampu menyala saat ada gerakan" },
      { kind: "youtube", url: VIDEO.wifiRelay, caption: "Video referensi: kontrol relay NodeMCU lewat Wi-Fi" },
      { kind: "image", url: PHOTO.solder, caption: "Menyolder header modul relay" },
    ],
  },
  {
    title: "JadwalNyala — Saklar Terjadwal via Web",
    tagline: "Atur jam nyala-padam lampu dari browser.",
    description:
      "JadwalNyala adalah saklar lampu otomatis berbasis jadwal. ESP32 menjalankan web server lokal sehingga pengguna dapat mengatur jam menyala dan padam lampu teras langsung dari browser HP tanpa aplikasi tambahan.",
    how: "ESP32 mengambil waktu dari server NTP dan menyimpannya di modul RTC DS3231 sebagai cadangan. Jadwal disimpan di memori flash. Setiap menit ESP32 mencocokkan jam sekarang dengan jadwal untuk mengatur relay.",
    components: ["ESP32 DevKit V1", "Modul RTC DS3231", "Modul relay 2 channel", "2 lampu LED 5V", "LCD I2C 16x2", "Kabel jumper", "Miniatur teras rumah"],
    steps: [
      { title: "Hidupkan perangkat", detail: "Sambungkan adaptor 5V. LCD menampilkan jam dan status lampu." },
      { title: "Sambung ke Wi-Fi prototype", detail: "Hubungkan HP ke Wi-Fi \"JadwalNyala\" (password ada di stiker bawah miniatur)." },
      { title: "Buka panel kontrol", detail: "Buka tautan akses remote atau ketik alamat 192.168.4.1 di browser." },
      { title: "Atur jadwal", detail: "Isi jam nyala dan padam untuk tiap lampu, lalu tekan SIMPAN. LCD akan menampilkan jadwal baru." },
    ],
    remoteLabel: "Panel Web ESP32",
    remoteUrl: "http://192.168.4.1",
    remoteNote: "Hanya bisa diakses saat HP tersambung ke Wi-Fi prototype.",
    media: [
      { kind: "image", url: PHOTO.sketch, caption: "Merancang skema rangkaian" },
      { kind: "image", url: PHOTO.pcbBlue, caption: "Close-up modul ESP32" },
      { kind: "youtube", url: VIDEO.espRelay, caption: "Video referensi: relay ESP-01 untuk lampu" },
      { kind: "image", url: PHOTO.phone, caption: "Mengatur jadwal dari browser HP" },
    ],
  },
  {
    title: "DuoSmart — Lampu Otomatis LDR + PIR",
    tagline: "Hanya menyala saat gelap DAN ada orang.",
    description:
      "DuoSmart menggabungkan dua sensor sekaligus: LDR untuk mendeteksi gelap-terang dan PIR untuk mendeteksi keberadaan orang. Lampu hanya menyala ketika keduanya terpenuhi sehingga jauh lebih hemat energi. Data dipantau lewat Arduino IoT Cloud.",
    how: "Logika AND: relay aktif hanya jika nilai LDR < ambang DAN PIR = HIGH. Arduino Uno membaca sensor dan meneruskan status ke ESP-01 melalui serial, lalu ESP-01 mengirim data ke Arduino IoT Cloud.",
    components: ["Arduino Uno R3", "Modul Wi-Fi ESP-01", "Sensor LDR", "Sensor PIR HC-SR501", "Modul relay 1 channel", "Lampu LED 5V", "Miniatur kamar"],
    steps: [
      { title: "Sambungkan daya", detail: "Pasang baterai 9V atau kabel USB ke Arduino Uno." },
      { title: "Mode siang", detail: "Saat ruangan terang, lampu tetap mati walaupun ada gerakan." },
      { title: "Mode malam", detail: "Tutup LDR lalu gerakkan tangan di depan PIR. Lampu menyala selama ada gerakan." },
      { title: "Pantau dari cloud", detail: "Buka tautan akses remote untuk melihat grafik cahaya dan riwayat lampu menyala." },
    ],
    remoteLabel: "Arduino IoT Cloud",
    remoteUrl: "https://app.arduino.cc",
    remoteNote: "Dashboard bersifat publik — tidak perlu login.",
    media: [
      { kind: "image", url: PHOTO.arduino, caption: "Arduino Uno sebagai otak utama" },
      { kind: "image", url: PHOTO.panel, caption: "Inspirasi: panel saklar listrik rumah" },
      { kind: "youtube", url: VIDEO.arduinoLdr, caption: "Video referensi: Smart Light Arduino + LDR" },
      { kind: "image", url: PHOTO.pcbGreen, caption: "Jalur rangkaian pada PCB" },
    ],
  },
]

const NAMES = [
  ["Raka Pratama", "male"], ["Nabila Putri", "female"], ["Dimas Saputra", "male"], ["Aulia Rahma", "female"],
  ["Fajar Nugroho", "male"], ["Salsa Amelia", "female"], ["Rizky Ramadhan", "male"], ["Keisya Anindita", "female"],
  ["Bagas Wicaksono", "male"], ["Zahra Kirana", "female"], ["Andika Firmansyah", "male"], ["Nadia Safitri", "female"],
  ["Yoga Prasetyo", "male"], ["Citra Lestari", "female"], ["Ilham Maulana", "male"], ["Tiara Anggraini", "female"],
  ["Farhan Hidayat", "male"], ["Dinda Maharani", "female"], ["Arya Wirawan", "male"], ["Putri Ayuningtyas", "female"],
  ["Gilang Permana", "male"], ["Vania Oktaviani", "female"], ["Reza Kurniawan", "male"], ["Alya Nurhaliza", "female"],
  ["Daffa Alfarizi", "male"], ["Intan Permatasari", "female"], ["Hafiz Ardiansyah", "male"], ["Melati Wulandari", "female"],
  ["Rangga Saputro", "male"], ["Shafa Azzahra", "female"], ["Naufal Akbar", "male"], ["Laras Setyowati", "female"],
  ["Rafi Ahmad Fauzi", "male"], ["Kirana Dewi", "female"], ["Satria Pamungkas", "male"], ["Amira Zahrani", "female"],
  ["Bima Aditya", "male"], ["Nayla Khairunnisa", "female"], ["Fikri Haikal", "male"], ["Rara Sekar", "female"],
  ["Galih Setiawan", "male"], ["Anisa Fitriani", "female"], ["Ikhsan Pratama", "male"], ["Sekar Ayu", "female"],
  ["Kevin Adrian", "male"], ["Jihan Aurelia", "female"], ["Wahyu Hidayat", "male"], ["Febby Ramadhani", "female"],
] as const

const ROLES = ["Ketua & Programmer", "Perakit Hardware", "Desain Miniatur", "Dokumentasi & Video"]

const CLASSES = [
  { name: "XI TJKT 1", slug: "xi-tjkt-1" },
  { name: "XI TJKT 2", slug: "xi-tjkt-2" },
  { name: "XI TJKT 3", slug: "xi-tjkt-3" },
]

/** Isi database kosong dengan akun guru, 3 kelas × 4 kelompok, anggota, dan galeri contoh. */
export async function seedDatabase(db: PrismaClient) {
  const teacherHash = bcrypt.hashSync("guru123", 10)
  const studentHash = bcrypt.hashSync("siswa123", 10)

  await db.$transaction(async (tx) => {
    await tx.user.create({
      data: { username: "guru", password_hash: teacherHash, role: "teacher", name: "Mr. Iqbal" },
    })

    let nameIdx = 0
    for (const [ci, cls] of CLASSES.entries()) {
      const { id: classId } = await tx.class.create({ data: { name: cls.name, slug: cls.slug, sort: ci } })
      for (let n = 1; n <= 4; n++) {
        // Template diputar supaya tiap kelas punya variasi proyek.
        const t = TEMPLATES[(n - 1 + ci) % TEMPLATES.length]
        // Kelompok 4 di kelas 3 dibiarkan kosong untuk contoh "belum diisi".
        const empty = ci === 2 && n === 4
        const groupName = `Kelompok ${n}`

        const members = empty
          ? []
          : ROLES.map((role, m) => {
              const [name, gender] = NAMES[(nameIdx + m) % NAMES.length]
              const photo = `https://randomuser.me/api/portraits/${gender === "male" ? "men" : "women"}/${((nameIdx + m) * 7) % 90}.jpg`
              return { name, role, photo_url: photo, sort: m }
            })
        nameIdx += 4
        // Kelompok 3 kelas 3 hanya sebagian galeri untuk contoh progres.
        const media = empty ? [] : ci === 2 && n === 3 ? t.media.slice(0, 1) : t.media

        await tx.group.create({
          data: {
            class_id: classId,
            number: n,
            name: groupName,
            slug: `${cls.slug}-kelompok-${n}`,
            project_title: empty ? "" : t.title,
            tagline: empty ? "" : t.tagline,
            description: empty ? "" : t.description,
            how_it_works: empty ? "" : t.how,
            components: JSON.stringify(empty ? [] : t.components),
            usage_steps: JSON.stringify(empty ? [] : t.steps),
            remote_url: empty ? "" : t.remoteUrl,
            remote_label: empty ? "" : t.remoteLabel,
            remote_note: empty ? "" : t.remoteNote,
            teacher_note: n === 1 ? "Mantap! Tambahkan video demo saat lampu menyala malam hari ya." : "",
            users: {
              create: {
                username: `tjkt${ci + 1}-k${n}`,
                password_hash: studentHash,
                role: "student",
                name: `${groupName} · ${cls.name}`,
              },
            },
            members: { create: members },
            media: { create: media.map((md, i) => ({ ...md, sort: i })) },
          },
        })
      }
    }
  })
}
