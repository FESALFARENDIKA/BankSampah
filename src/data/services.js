export const publicServices = [
  {
    id: 1,
    title: 'Pendaftaran Bank Sampah',
    description: 'Layanan pendaftaran untuk pembentukan bank sampah baru di tingkat RT/RW atau kelurahan.',
    icon: 'Building2',
    link: '/layanan-publik' // Currently pointing to services page, can be external/modal in real app
  },
  {
    id: 2,
    title: 'Penjemputan Sampah Terjadwal',
    description: 'Layanan penjemputan sampah anorganik bagi bank sampah yang telah terdaftar dan memenuhi kuota.',
    icon: 'Truck',
    link: '/layanan-publik'
  },
  {
    id: 3,
    title: 'Edukasi & Sosialisasi',
    description: 'Permohonan narasumber untuk sosialisasi pengelolaan sampah di sekolah, kampus, atau masyarakat.',
    icon: 'Users',
    link: '/layanan-publik'
  },
  {
    id: 4,
    title: 'Laporan Tumpukan Sampah Liar',
    description: 'Layanan pelaporan masyarakat jika menemukan tumpukan sampah liar yang butuh penanganan segera.',
    icon: 'AlertTriangle',
    link: '/guest-book'
  }
];

export const serviceFlow = [
  {
    step: 1,
    title: 'Pilih Layanan',
    description: 'Tentukan jenis layanan publik yang Anda butuhkan melalui website.'
  },
  {
    step: 2,
    title: 'Isi Formulir',
    description: 'Lengkapi data diri dan detail permohonan layanan pada form yang disediakan.'
  },
  {
    step: 3,
    title: 'Verifikasi DLH',
    description: 'Tim DLH Kota Batu akan memverifikasi permohonan Anda maksimal 2x24 jam kerja.'
  },
  {
    step: 4,
    title: 'Pelaksanaan',
    description: 'Layanan akan dilaksanakan sesuai dengan jadwal atau respon yang diberikan.'
  }
];
