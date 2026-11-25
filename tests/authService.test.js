import { describe, it, expect, vi } from 'vitest';
import { loginUser, registerUser, searchForgotUser, resetUserPassword } from '../src/utils/authService';

// FAKE: In-memory localStorage for testing session persistence without browser
class FakeLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
}

// ── FITUR 1 (RQ-001): LOGIN ──────────────────────────────────────────────────
describe('Fitur 1 (RQ-001) - loginUser (AAA Pattern)', () => {
  it('TC-L01 [Negative]: should reject empty username or password', async () => {
    // Arrange
    const deps = { dbClient: { findUser: vi.fn() }, storage: new FakeLocalStorage(), onSuccess: vi.fn() };
    // Act
    const res = await loginUser('', 'admin123', deps);
    // Assert
    expect(res).toEqual({ ok: false, errorMsg: 'Harap isi username/email dan password!' });
    expect(deps.dbClient.findUser).not.toHaveBeenCalled();
  });

  it('TC-L02 [Negative]: should handle database query error via Stub', async () => {
    // Arrange (STUB returning DB error)
    const dbStub = { findUser: async () => ({ data: null, error: { message: 'timeout' } }) };
    const storage = new FakeLocalStorage();
    const onSuccessMock = vi.fn();
    // Act
    const res = await loginUser('admin', 'admin123', { dbClient: dbStub, storage, onSuccess: onSuccessMock });
    // Assert
    expect(res).toEqual({ ok: false, errorMsg: 'Database query error!' });
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it('TC-L03 [Negative]: should reject wrong credentials when DB returns empty array', async () => {
    // Arrange (STUB returning empty data)
    const dbStub = { findUser: async () => ({ data: [], error: null }) };
    // Act
    const res = await loginUser('admin', 'wrongpass', {
      dbClient: dbStub,
      storage: new FakeLocalStorage(),
      onSuccess: vi.fn(),
    });
    // Assert
    expect(res).toEqual({ ok: false, errorMsg: 'Username/Email atau Password salah!' });
  });

  it('TC-L04 [Positive]: should store user in FakeLocalStorage and call onSuccess Mock', async () => {
    // Arrange (STUB + FAKE + MOCK)
    const user = { id: 1, username: 'admin', role: 'admin' };
    const dbStub = { findUser: async () => ({ data: [user], error: null }) };
    const fakeStorage = new FakeLocalStorage();
    const onSuccessMock = vi.fn();
    // Act
    const res = await loginUser('admin', 'admin123', {
      dbClient: dbStub,
      storage: fakeStorage,
      onSuccess: onSuccessMock,
    });
    // Assert
    expect(res).toEqual({ ok: true, user });
    expect(JSON.parse(fakeStorage.getItem('wastebank-user'))).toEqual(user);
    expect(onSuccessMock).toHaveBeenCalledWith('/');
  });

  it('TC-L05 [Negative]: should catch unexpected server connection exception', async () => {
    // Arrange (STUB throwing network error)
    const dbStub = { findUser: async () => { throw new Error('Network down'); } };
    // Act
    const res = await loginUser('admin', 'admin123', {
      dbClient: dbStub,
      storage: new FakeLocalStorage(),
      onSuccess: vi.fn(),
    });
    // Assert
    expect(res).toEqual({ ok: false, errorMsg: 'Koneksi ke server gagal!' });
  });
});

// ── FITUR 2 (RQ-002): REGISTER ───────────────────────────────────────────────
describe('Fitur 2 (RQ-002) - registerUser (AAA Pattern)', () => {
  it('TC-R01 [Negative]: should reject incomplete registration fields', async () => {
    // Arrange & Act
    const res = await registerUser(
      { fullName: '', usernameOrEmail: 'petugas1', password: 'secret', confirmPassword: 'secret' },
      { dbClient: {}, storage: new FakeLocalStorage(), onSuccess: vi.fn() }
    );
    // Assert
    expect(res).toEqual({ ok: false, errorMsg: 'Harap isi semua bidang input!' });
  });

  it('TC-R02 [Negative]: should reject mismatched password and confirmPassword', async () => {
    // Arrange & Act
    const res = await registerUser(
      { fullName: 'Budi', usernameOrEmail: 'budi', password: 'password1', confirmPassword: 'password2' },
      { dbClient: {}, storage: new FakeLocalStorage(), onSuccess: vi.fn() }
    );
    // Assert
    expect(res).toEqual({ ok: false, errorMsg: 'Password dan konfirmasi password tidak cocok!' });
  });

  it('TC-R03 [Negative]: should reject duplicate username/email via Stub', async () => {
    // Arrange
    const dbStub = { findExistingUser: async () => ({ data: { username: 'budi' } }) };
    // Act
    const res = await registerUser(
      { fullName: 'Budi', usernameOrEmail: 'budi', password: 'password1', confirmPassword: 'password1' },
      { dbClient: dbStub, storage: new FakeLocalStorage(), onSuccess: vi.fn() }
    );
    // Assert
    expect(res).toEqual({ ok: false, errorMsg: 'Username atau Email sudah terdaftar!' });
  });

  it('TC-R04 [Negative]: should handle insert error from database Stub', async () => {
    // Arrange
    const dbStub = {
      findExistingUser: async () => ({ data: null }),
      insertUser: async () => ({ data: null, error: { message: 'constraint error' } }),
    };
    // Act
    const res = await registerUser(
      { fullName: 'Budi', usernameOrEmail: 'budi@dlh.go.id', password: 'password1', confirmPassword: 'password1' },
      { dbClient: dbStub, storage: new FakeLocalStorage(), onSuccess: vi.fn() }
    );
    // Assert
    expect(res).toEqual({ ok: false, errorMsg: 'Registrasi gagal: constraint error' });
  });

  it('TC-R05 [Positive]: should register new user, persist to FakeLocalStorage, and navigate via Mock', async () => {
    // Arrange
    const dbStub = {
      findExistingUser: async () => ({ data: null }),
      insertUser: async (u) => ({ data: [{ id: 10, ...u }], error: null }),
    };
    const fakeStorage = new FakeLocalStorage();
    const onSuccessMock = vi.fn();
    // Act
    const res = await registerUser(
      { fullName: 'Siti Rahma', usernameOrEmail: 'sitirahma', password: 'password123', confirmPassword: 'password123' },
      { dbClient: dbStub, storage: fakeStorage, onSuccess: onSuccessMock }
    );
    // Assert
    expect(res.ok).toBe(true);
    expect(res.user.email).toBe('sitirahma@wastebank.id');
    expect(JSON.parse(fakeStorage.getItem('wastebank-user')).id).toBe(10);
    expect(onSuccessMock).toHaveBeenCalledWith('/');
  });

  it('TC-R06 [Negative]: should catch unexpected database exception', async () => {
    // Arrange
    const dbStub = { findExistingUser: async () => { throw new Error('DB offline'); } };
    // Act
    const res = await registerUser(
      { fullName: 'Siti', usernameOrEmail: 'siti', password: 'password123', confirmPassword: 'password123' },
      { dbClient: dbStub, storage: new FakeLocalStorage(), onSuccess: vi.fn() }
    );
    // Assert
    expect(res).toEqual({ ok: false, errorMsg: 'Koneksi ke database gagal!' });
  });
});

// ── FITUR 3 (RQ-003): FORGOT PASSWORD ────────────────────────────────────────
describe('Fitur 3 (RQ-003) - searchForgotUser & resetUserPassword (AAA Pattern)', () => {
  it('TC-F01 [Negative]: should reject empty identifier in Step 1', async () => {
    const res = await searchForgotUser('', { dbClient: {} });
    expect(res).toEqual({ ok: false, errorMsg: 'Masukkan username atau email Anda!' });
  });

  it('TC-F02 [Negative]: should return not found when user does not exist', async () => {
    const dbStub = { findUserByIdentifier: async () => ({ data: null, error: null }) };
    const res = await searchForgotUser('unknown', { dbClient: dbStub });
    expect(res).toEqual({ ok: false, errorMsg: 'Pengguna tidak ditemukan!' });
  });

  it('TC-F03 [Positive]: should proceed to Step 2 when user is found', async () => {
    const user = { id: 5, username: 'petugas' };
    const dbStub = { findUserByIdentifier: async () => ({ data: user, error: null }) };
    const res = await searchForgotUser('petugas', { dbClient: dbStub });
    expect(res).toEqual({ ok: true, targetUser: user, nextStep: 2 });
  });

  it('TC-F04 [Negative]: should catch search exception in Step 1', async () => {
    const dbStub = { findUserByIdentifier: async () => { throw new Error('err'); } };
    const res = await searchForgotUser('petugas', { dbClient: dbStub });
    expect(res).toEqual({ ok: false, errorMsg: 'Gagal mencari data user!' });
  });

  it('TC-F05 [Negative]: should reject empty or mismatched new password in Step 2', async () => {
    const emptyRes = await resetUserPassword({ id: 5 }, '', 'abc123', { dbClient: {} });
    const mismatchRes = await resetUserPassword({ id: 5 }, 'abc123', 'xyz789', { dbClient: {} });
    expect(emptyRes).toEqual({ ok: false, errorMsg: 'Harap lengkapi semua input password!' });
    expect(mismatchRes).toEqual({ ok: false, errorMsg: 'Password baru dan konfirmasi tidak cocok!' });
  });

  it('TC-F06 [Positive & Error]: should update password on success and handle DB error/exception', async () => {
    const okStub = { updatePassword: async () => ({ error: null }) };
    const errStub = { updatePassword: async () => ({ error: { message: 'failed' } }) };
    const throwStub = { updatePassword: async () => { throw new Error('net'); } };

    expect(await resetUserPassword({ id: 5 }, 'newpass123', 'newpass123', { dbClient: okStub })).toEqual({ ok: true, resetSuccess: true });
    expect(await resetUserPassword({ id: 5 }, 'newpass123', 'newpass123', { dbClient: errStub })).toEqual({ ok: false, errorMsg: 'Gagal memperbarui password!' });
    expect(await resetUserPassword({ id: 5 }, 'newpass123', 'newpass123', { dbClient: throwStub })).toEqual({ ok: false, errorMsg: 'Koneksi ke server gagal!' });
  });
});
