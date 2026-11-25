/**
 * Business logic & multi-condition validation for Fitur 6 (RQ-006 / FS-006):
 * Pengelolaan Database BSU Terdaftar (WasteBank DLH Kota Batu).
 *
 * Extracted from src/pages/AdminDashboardPage.jsx (validateBankForm & handleAddBankSampah)
 * to enable isolated Unit Testing with Test Doubles.
 */

export const validateBankForm = (form) => {
  const errors = {}; // S1

  // 1. Multi-Condition: Kode BSU harus sesuai prefix kecamatan
  const prefixMap = { Batu: 'BATU-', Junrejo: 'JUN-', Bumiaji: 'BUM-' }; // S2
  const expectedPrefix = prefixMap[form.district] || 'BATU-'; // S3
  if (!form.code || !form.code.trim().toUpperCase().startsWith(expectedPrefix)) { // S4 (D1)
    errors.code = `Kecamatan ${form.district} mewajibkan kode BSU diawali "${expectedPrefix}" (contoh: ${expectedPrefix}01)`; // S5
  }

  // 2. Multi-Condition: Aturan berdasarkan Status Operasional
  if (form.status === 'Vakum' || form.status === 'Tidak Aktif') { // S6 (D2)
    if (!form.statusReason || form.statusReason.trim().length < 10) { // S7 (D3)
      errors.statusReason = `Untuk status "${form.status}", kolom Alasan / Kendala wajib diisi minimal 10 karakter.`; // S8
    }
  } else if (form.status === 'Aktif') { // S9 (D4)
    if (!form.manager || !form.manager.trim()) { // S10 (D5)
      errors.manager = 'Nama penanggung jawab wajib diisi untuk status Aktif.'; // S11
    }
    const cleanPhone = (form.phone || '').replace(/\D/g, ''); // S12
    if (!cleanPhone || cleanPhone.length < 10) { // S13 (D6)
      errors.phone = 'Nomor telepon wajib minimal 10 digit angka untuk unit Aktif.'; // S14
    }
    const hasWaste = // S15
      (parseFloat(form.plastic) || 0) > 0 ||
      (parseFloat(form.paper) || 0) > 0 ||
      (parseFloat(form.iron) || 0) > 0 ||
      (parseFloat(form.bottle) || 0) > 0 ||
      (parseFloat(form.glass) || 0) > 0 ||
      (parseFloat(form.oil) || 0) > 0;
    if (!hasWaste) { // S16 (D7)
      errors.waste = 'Unit berstatus Aktif wajib memiliki minimal satu jenis setoran sampah > 0 kg.'; // S17
    }
  }

  return errors; // S18
};

export const calculateWasteVolume = (form) => {
  const isInactive = form.status === 'Vakum' || form.status === 'Tidak Aktif';
  if (isInactive) {
    return 0;
  }
  return (
    (parseFloat(form.plastic) || 0) +
    (parseFloat(form.paper) || 0) +
    (parseFloat(form.iron) || 0) +
    (parseFloat(form.bottle) || 0) +
    (parseFloat(form.glass) || 0) +
    (parseFloat(form.oil) || 0)
  );
};

export const formatFullAddress = (address, district) => {
  if (address.toLowerCase().includes(district.toLowerCase())) {
    return address;
  }
  return `${address}, Kec. ${district}`;
};

/**
 * Registers a new Bank Sampah Unit (BSU) with injectable dependencies
 * (dbClient, storage, notifier) so external I/O can be isolated via Test Doubles.
 */
export const createBankSampah = async (newBank, { dbClient, storage, notifier }) => {
  const errors = validateBankForm(newBank);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  if (!newBank.code || !newBank.name || !newBank.address) {
    return { ok: false, message: 'Harap lengkapi Kode, Nama BSU, dan Alamat!' };
  }

  const isInactive = newBank.status === 'Vakum' || newBank.status === 'Tidak Aktif';
  const sumVolume = calculateWasteVolume(newBank);
  const fullAddress = formatFullAddress(newBank.address, newBank.district || 'Batu');

  const payload = {
    code: newBank.code,
    name: newBank.name,
    status: newBank.status || 'Aktif',
    address: fullAddress,
    manager: newBank.manager,
    coordinates: '-7.8716;112.5267',
    phone: newBank.phone,
    sk_number: newBank.sk_number || '',
    volume: sumVolume,
    members: parseInt(newBank.members, 10) || 0,
    is_custom: true,
  };

  const { data, error } = await dbClient.insertBankSampah(payload);
  if (error) {
    return { ok: false, message: `Gagal menambah bank sampah: ${error.message}` };
  }

  if (data && data.length > 0) {
    const savedBreakdowns = JSON.parse(storage.getItem('bank_sampah_breakdowns') || '{}');
    savedBreakdowns[data[0].id] = {
      established: newBank.established || '',
      statusReason: newBank.statusReason || '',
      plastic: isInactive ? '0' : (newBank.plastic || '0'),
      paper: isInactive ? '0' : (newBank.paper || '0'),
      iron: isInactive ? '0' : (newBank.iron || '0'),
      bottle: isInactive ? '0' : (newBank.bottle || '0'),
      glass: isInactive ? '0' : (newBank.glass || '0'),
      oil: isInactive ? '0' : (newBank.oil || '0'),
    };
    storage.setItem('bank_sampah_breakdowns', JSON.stringify(savedBreakdowns));
  }

  notifier.notify(`Unit Bank Sampah "${newBank.name}" berhasil didaftarkan secara resmi!`);
  return { ok: true, data: data[0], volume: sumVolume };
};
