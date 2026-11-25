/**
 * Administrator operations logic for:
 * - Fitur 4 (RQ-004 / FS-004): Verifikasi Permohonan Registrasi BSU Warga
 * - Fitur 5 (RQ-005 / FS-005): Verifikasi & Tindak Lanjut Pengaduan Sampah Liar
 * - Fitur 7 (RQ-007 / FS-007): Pengelolaan Permohonan Layanan & Ulasan Buku Tamu
 * - Fitur 8 (RQ-008 / FS-008): Pengelolaan Jadwal Truk Pickup Sampah
 *
 * Extracted from src/pages/AdminDashboardPage.jsx with inline Statement (S) and Decision (D) annotations.
 */

// ── FITUR 4 (RQ-004): VERIFIKASI PERMOHONAN REGISTRASI BSU WARGA ─────────────
export const updateApplicationStatus = async (id, newStatus, { dbClient, notifier, reload }) => {
  const allowedStatuses = ['Pending', 'Approved', 'Ditolak']; // S1
  if (!id || !allowedStatuses.includes(newStatus)) { // S2 (D1)
    return { ok: false, message: 'ID atau status permohonan tidak valid!' }; // S3
  }
  const { error } = await dbClient.updateApplication(id, newStatus); // S4
  if (error) { // S5 (D2)
    return { ok: false, message: `Gagal mengubah status permohonan: ${error.message}` }; // S6
  }
  notifier.notify(`Permohonan status diubah menjadi: ${newStatus}`); // S7
  reload(); // S8
  return { ok: true, status: newStatus }; // S9
};

// ── FITUR 5 (RQ-005): VERIFIKASI & TINDAK LANJUT PENGADUAN SAMPAH LIAR ───────
export const updateReportStatus = async (id, newStatus, { dbClient, notifier, reload }) => {
  const allowedStatuses = ['Baru', 'Diproses', 'Selesai', 'Ditolak']; // S1
  if (!id || !allowedStatuses.includes(newStatus)) { // S2 (D1)
    return { ok: false, message: 'ID atau status pengaduan tidak valid!' }; // S3
  }
  const { error } = await dbClient.updateReport(id, newStatus); // S4
  if (error) { // S5 (D2)
    return { ok: false, message: `Gagal merubah status aduan: ${error.message}` }; // S6
  }
  notifier.notify(`Laporan pengaduan diubah statusnya menjadi: ${newStatus}`); // S7
  reload(); // S8
  return { ok: true, status: newStatus }; // S9
};

// ── FITUR 7 (RQ-007): PENGELOLAAN LAYANAN & ULASAN BUKU TAMU ─────────────────
export const deleteGuestbookEntry = async (id, { confirmFn, dbClient, notifier, reload }) => {
  if (!confirmFn('Hapus ulasan buku tamu ini?')) { // S1 (D1)
    return { ok: false, cancelled: true }; // S2
  }
  const { error } = await dbClient.deleteGuestbook(id); // S3
  if (error) { // S4 (D2)
    return { ok: false, message: `Gagal menghapus ulasan: ${error.message}` }; // S5
  }
  notifier.notify('Komentar buku tamu berhasil dihapus.'); // S6
  reload(); // S7
  return { ok: true, deletedId: id }; // S8
};

// ── FITUR 8 (RQ-008): PENGELOLAAN JADWAL TRUK PICKUP SAMPAH ──────────────────
export const addPickupSchedule = async (newSchedule, { dbClient, notifier, reload }) => {
  if (!newSchedule.title || !newSchedule.date || !newSchedule.location) { // S1 (D1)
    return { ok: false, message: 'Harap lengkapi judul, tanggal, dan lokasi!' }; // S2
  }
  const payload = { // S3
    title: newSchedule.title,
    type: newSchedule.type || 'organic',
    date: newSchedule.date,
    time: newSchedule.time || '08:00 - 12:00',
    district: newSchedule.district || 'Batu',
    location: newSchedule.location,
  };
  const { error } = await dbClient.insertSchedule(payload); // S4
  if (error) { // S5 (D2)
    return { ok: false, message: `Gagal menambahkan jadwal: ${error.message}` }; // S6
  }
  notifier.notify('Jadwal pengangkutan baru berhasil ditambahkan!'); // S7
  reload(); // S8
  return { ok: true, schedule: payload }; // S9
};
