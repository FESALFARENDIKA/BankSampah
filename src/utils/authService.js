/**
 * Authentication business logic for:
 * - Fitur 1 (RQ-001 / FS-001): Login Administrator DLH
 * - Fitur 2 (RQ-002 / FS-002): Register Akun Pengguna Baru
 * - Fitur 3 (RQ-003 / FS-003): Forgot Password (2 Langkah)
 *
 * Extracted from src/pages/LoginPage.jsx (handleAuthSubmit, handleForgotSearch, handleForgotReset)
 * with inline Statement (S) and Decision (D) annotations for White-Box Testing.
 */

// ── FITUR 1 (RQ-001): LOGIN ──────────────────────────────────────────────────
export const loginUser = async (usernameOrEmail, password, { dbClient, storage, onSuccess }) => {
  if (!usernameOrEmail || !password) { // S1 (D1)
    return { ok: false, errorMsg: 'Harap isi username/email dan password!' }; // S2
  }
  try {
    const { data, error } = await dbClient.findUser(usernameOrEmail, password); // S3
    if (error) { // S4 (D2)
      return { ok: false, errorMsg: 'Database query error!' }; // S5
    }
    if (!data || data.length === 0) { // S6 (D3)
      return { ok: false, errorMsg: 'Username/Email atau Password salah!' }; // S7
    }
    storage.setItem('wastebank-user', JSON.stringify(data[0])); // S8
    onSuccess('/'); // S9
    return { ok: true, user: data[0] }; // S10
  } catch {
    return { ok: false, errorMsg: 'Koneksi ke server gagal!' }; // S11
  }
};

// ── FITUR 2 (RQ-002): REGISTER ───────────────────────────────────────────────
export const registerUser = async (
  { fullName, usernameOrEmail, password, confirmPassword },
  { dbClient, storage, onSuccess }
) => {
  if (!usernameOrEmail || !password || !fullName) { // S1 (D1)
    return { ok: false, errorMsg: 'Harap isi semua bidang input!' }; // S2
  }
  if (password !== confirmPassword) { // S3 (D2)
    return { ok: false, errorMsg: 'Password dan konfirmasi password tidak cocok!' }; // S4
  }
  try {
    const { data: existing } = await dbClient.findExistingUser(usernameOrEmail); // S5
    if (existing) { // S6 (D3)
      return { ok: false, errorMsg: 'Username atau Email sudah terdaftar!' }; // S7
    }
    const email = usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@wastebank.id`; // S8
    const { data, error } = await dbClient.insertUser({ // S9
      username: usernameOrEmail,
      full_name: fullName,
      email,
      password,
      role: 'citizen',
    });
    if (error) { // S10 (D4)
      return { ok: false, errorMsg: `Registrasi gagal: ${error.message}` }; // S11
    }
    storage.setItem('wastebank-user', JSON.stringify(data[0])); // S12
    onSuccess('/'); // S13
    return { ok: true, user: data[0] }; // S14
  } catch {
    return { ok: false, errorMsg: 'Koneksi ke database gagal!' }; // S15
  }
};

// ── FITUR 3 (RQ-003): FORGOT PASSWORD (LANGKAH 1 & 2) ────────────────────────
export const searchForgotUser = async (forgotUser, { dbClient }) => {
  if (!forgotUser) { // S1 (D1)
    return { ok: false, errorMsg: 'Masukkan username atau email Anda!' }; // S2
  }
  try {
    const { data, error } = await dbClient.findUserByIdentifier(forgotUser); // S3
    if (error || !data) { // S4 (D2)
      return { ok: false, errorMsg: 'Pengguna tidak ditemukan!' }; // S5
    }
    return { ok: true, targetUser: data, nextStep: 2 }; // S6
  } catch {
    return { ok: false, errorMsg: 'Gagal mencari data user!' }; // S7
  }
};

export const resetUserPassword = async (targetUser, newPassword, confirmNewPassword, { dbClient }) => {
  if (!newPassword || !confirmNewPassword) { // S1 (D1)
    return { ok: false, errorMsg: 'Harap lengkapi semua input password!' }; // S2
  }
  if (newPassword !== confirmNewPassword) { // S3 (D2)
    return { ok: false, errorMsg: 'Password baru dan konfirmasi tidak cocok!' }; // S4
  }
  try {
    const { error } = await dbClient.updatePassword(targetUser.id, newPassword); // S5
    if (error) { // S6 (D3)
      return { ok: false, errorMsg: 'Gagal memperbarui password!' }; // S7
    }
    return { ok: true, resetSuccess: true }; // S8
  } catch {
    return { ok: false, errorMsg: 'Koneksi ke server gagal!' }; // S9
  }
};
