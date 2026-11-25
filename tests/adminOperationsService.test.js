import { describe, it, expect, vi } from 'vitest';
import {
  updateApplicationStatus,
  updateReportStatus,
  deleteGuestbookEntry,
  addPickupSchedule,
} from '../src/utils/adminOperationsService';

// ── FITUR 4 (RQ-004): VERIFIKASI PERMOHONAN REGISTRASI BSU WARGA ─────────────
describe('Fitur 4 (RQ-004) - updateApplicationStatus (AAA Pattern)', () => {
  it('TC-A01 [Negative]: should reject invalid application ID or unsupported status', async () => {
    // Arrange
    const notifierMock = { notify: vi.fn() };
    const reloadMock = vi.fn();
    // Act
    const res = await updateApplicationStatus(1, 'InvalidStatus', { dbClient: {}, notifier: notifierMock, reload: reloadMock });
    // Assert
    expect(res).toEqual({ ok: false, message: 'ID atau status permohonan tidak valid!' });
    expect(notifierMock.notify).not.toHaveBeenCalled();
  });

  it('TC-A02 [Negative]: should return error message when DB Stub fails', async () => {
    // Arrange (STUB + MOCK)
    const dbStub = { updateApplication: async () => ({ error: { message: 'row locked' } }) };
    const notifierMock = { notify: vi.fn() };
    const reloadMock = vi.fn();
    // Act
    const res = await updateApplicationStatus(12, 'Approved', { dbClient: dbStub, notifier: notifierMock, reload: reloadMock });
    // Assert
    expect(res).toEqual({ ok: false, message: 'Gagal mengubah status permohonan: row locked' });
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it('TC-A03 [Positive]: should approve application, notify, and reload via Mocks', async () => {
    // Arrange
    const dbStub = { updateApplication: async () => ({ error: null }) };
    const notifierMock = { notify: vi.fn() };
    const reloadMock = vi.fn();
    // Act
    const res = await updateApplicationStatus(12, 'Approved', { dbClient: dbStub, notifier: notifierMock, reload: reloadMock });
    // Assert
    expect(res).toEqual({ ok: true, status: 'Approved' });
    expect(notifierMock.notify).toHaveBeenCalledWith('Permohonan status diubah menjadi: Approved');
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});

// ── FITUR 5 (RQ-005): VERIFIKASI & TINDAK LANJUT PENGADUAN SAMPAH LIAR ───────
describe('Fitur 5 (RQ-005) - updateReportStatus (AAA Pattern)', () => {
  it('TC-P01 [Negative]: should reject missing ID or invalid report status', async () => {
    const res = await updateReportStatus(null, 'Diproses', { dbClient: {}, notifier: { notify: vi.fn() }, reload: vi.fn() });
    expect(res).toEqual({ ok: false, message: 'ID atau status pengaduan tidak valid!' });
  });

  it('TC-P02 [Negative]: should handle database update error via Stub', async () => {
    const dbStub = { updateReport: async () => ({ error: { message: 'db error' } }) };
    const res = await updateReportStatus(7, 'Selesai', { dbClient: dbStub, notifier: { notify: vi.fn() }, reload: vi.fn() });
    expect(res).toEqual({ ok: false, message: 'Gagal merubah status aduan: db error' });
  });

  it('TC-P03 [Positive]: should update report status to Selesai and invoke Mocks', async () => {
    const dbStub = { updateReport: async () => ({ error: null }) };
    const notifierMock = { notify: vi.fn() };
    const reloadMock = vi.fn();
    const res = await updateReportStatus(7, 'Selesai', { dbClient: dbStub, notifier: notifierMock, reload: reloadMock });
    expect(res).toEqual({ ok: true, status: 'Selesai' });
    expect(notifierMock.notify).toHaveBeenCalledWith('Laporan pengaduan diubah statusnya menjadi: Selesai');
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});

// ── FITUR 7 (RQ-007): PENGELOLAAN LAYANAN & ULASAN BUKU TAMU ─────────────────
describe('Fitur 7 (RQ-007) - deleteGuestbookEntry (AAA Pattern)', () => {
  it('TC-G01 [Negative/Cancel]: should abort deletion when user cancels confirm Stub', async () => {
    const confirmStub = () => false;
    const dbMock = { deleteGuestbook: vi.fn() };
    const res = await deleteGuestbookEntry(5, { confirmFn: confirmStub, dbClient: dbMock, notifier: { notify: vi.fn() }, reload: vi.fn() });
    expect(res).toEqual({ ok: false, cancelled: true });
    expect(dbMock.deleteGuestbook).not.toHaveBeenCalled();
  });

  it('TC-G02 [Negative]: should return error when DB delete Stub fails', async () => {
    const dbStub = { deleteGuestbook: async () => ({ error: { message: 'permission denied' } }) };
    const res = await deleteGuestbookEntry(5, { confirmFn: () => true, dbClient: dbStub, notifier: { notify: vi.fn() }, reload: vi.fn() });
    expect(res).toEqual({ ok: false, message: 'Gagal menghapus ulasan: permission denied' });
  });

  it('TC-G03 [Positive]: should delete guestbook entry, notify, and reload via Mocks', async () => {
    const dbStub = { deleteGuestbook: async () => ({ error: null }) };
    const notifierMock = { notify: vi.fn() };
    const reloadMock = vi.fn();
    const res = await deleteGuestbookEntry(5, { confirmFn: () => true, dbClient: dbStub, notifier: notifierMock, reload: reloadMock });
    expect(res).toEqual({ ok: true, deletedId: 5 });
    expect(notifierMock.notify).toHaveBeenCalledWith('Komentar buku tamu berhasil dihapus.');
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});

// ── FITUR 8 (RQ-008): PENGELOLAAN JADWAL TRUK PICKUP SAMPAH ──────────────────
describe('Fitur 8 (RQ-008) - addPickupSchedule (AAA Pattern)', () => {
  it('TC-S01 [Negative]: should reject schedule with missing title, date, or location', async () => {
    const res = await addPickupSchedule({ title: '', date: '2026-11-26', location: 'Kec. Batu' }, { dbClient: {}, notifier: { notify: vi.fn() }, reload: vi.fn() });
    expect(res).toEqual({ ok: false, message: 'Harap lengkapi judul, tanggal, dan lokasi!' });
  });

  it('TC-S02 [Negative]: should handle database insert error via Stub', async () => {
    const dbStub = { insertSchedule: async () => ({ error: { message: 'insert failed' } }) };
    const res = await addPickupSchedule(
      { title: 'Pickup Organik Pagi', date: '2026-11-26', location: 'Jl. Diponegoro' },
      { dbClient: dbStub, notifier: { notify: vi.fn() }, reload: vi.fn() }
    );
    expect(res).toEqual({ ok: false, message: 'Gagal menambahkan jadwal: insert failed' });
  });

  it('TC-S03 [Positive]: should insert schedule with default fields and invoke Mocks', async () => {
    const dbStub = { insertSchedule: async () => ({ error: null }) };
    const notifierMock = { notify: vi.fn() };
    const reloadMock = vi.fn();
    const res = await addPickupSchedule(
      { title: 'Pickup Organik Pagi', date: '2026-11-26', location: 'Jl. Diponegoro' },
      { dbClient: dbStub, notifier: notifierMock, reload: reloadMock }
    );
    expect(res.ok).toBe(true);
    expect(res.schedule.type).toBe('organic');
    expect(res.schedule.district).toBe('Batu');
    expect(notifierMock.notify).toHaveBeenCalledWith('Jadwal pengangkutan baru berhasil ditambahkan!');
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
