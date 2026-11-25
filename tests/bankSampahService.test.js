import { describe, it, expect, vi } from 'vitest';
import {
  validateBankForm,
  calculateWasteVolume,
  formatFullAddress,
  createBankSampah,
} from '../src/utils/bankSampahService';

// ============================================================================
// FAKE TEST DOUBLE: In-memory storage replacing browser localStorage
// ============================================================================
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

// ============================================================================
// 1. UNIT TESTING: validateBankForm (Statement & Branch Coverage TC-01..TC-05)
// ============================================================================
describe('validateBankForm - Statement & Branch Coverage (AAA Pattern)', () => {
  it('TC-01 [Positive]: should return empty errors for valid Aktif BSU', () => {
    // Arrange
    const form = {
      district: 'Batu',
      code: 'BATU-01',
      status: 'Aktif',
      manager: 'Budi Santoso',
      phone: '081234567890',
      plastic: '12',
      paper: '0',
      iron: '0',
      bottle: '0',
      glass: '0',
      oil: '0',
      statusReason: '',
    };

    // Act
    const result = validateBankForm(form);

    // Assert
    expect(result).toEqual({});
  });

  it('TC-02 [Negative]: should return 4 errors for Aktif BSU with wrong prefix, empty manager, short phone, and 0 waste', () => {
    // Arrange
    const form = {
      district: 'Junrejo',
      code: 'BATU-99',
      status: 'Aktif',
      manager: '   ',
      phone: '08123',
      plastic: '0',
      paper: '0',
      iron: '0',
      bottle: '0',
      glass: '0',
      oil: '0',
      statusReason: '',
    };

    // Act
    const result = validateBankForm(form);

    // Assert
    expect(result).toEqual({
      code: 'Kecamatan Junrejo mewajibkan kode BSU diawali "JUN-" (contoh: JUN-01)',
      manager: 'Nama penanggung jawab wajib diisi untuk status Aktif.',
      phone: 'Nomor telepon wajib minimal 10 digit angka untuk unit Aktif.',
      waste: 'Unit berstatus Aktif wajib memiliki minimal satu jenis setoran sampah > 0 kg.',
    });
  });

  it('TC-03 [Negative]: should return statusReason error for Vakum BSU with reason < 10 chars', () => {
    // Arrange
    const form = {
      district: 'Bumiaji',
      code: 'BUM-02',
      status: 'Vakum',
      statusReason: 'Tutup',
    };

    // Act
    const result = validateBankForm(form);

    // Assert
    expect(result).toEqual({
      statusReason:
        'Untuk status "Vakum", kolom Alasan / Kendala wajib diisi minimal 10 karakter.',
    });
  });

  it('TC-04 [Positive]: should return empty errors for Tidak Aktif BSU with valid reason >= 10 chars', () => {
    // Arrange
    const form = {
      district: 'Batu',
      code: 'BATU-05',
      status: 'Tidak Aktif',
      statusReason: 'Pengurus mengundurkan diri sementara',
    };

    // Act
    const result = validateBankForm(form);

    // Assert
    expect(result).toEqual({});
  });

  it('TC-05 [Edge Case]: should bypass status blocks when status is empty string', () => {
    // Arrange
    const form = {
      district: 'Batu',
      code: 'BATU-09',
      status: '',
    };

    // Act
    const result = validateBankForm(form);

    // Assert
    expect(result).toEqual({});
  });
});

// ============================================================================
// 2. UNIT TESTING: Helper Functions (calculateWasteVolume & formatFullAddress)
// ============================================================================
describe('BSU Helper Functions', () => {
  it('should sum all waste categories for Aktif unit and return 0 for Vakum unit', () => {
    // Arrange
    const activeUnit = { status: 'Aktif', plastic: '10', paper: '5.5', iron: '2', bottle: '1', glass: '0.5', oil: '1' };
    const vakumUnit = { status: 'Vakum', plastic: '10', paper: '5' };

    // Act
    const activeTotal = calculateWasteVolume(activeUnit);
    const vakumTotal = calculateWasteVolume(vakumUnit);

    // Assert
    expect(activeTotal).toBe(20);
    expect(vakumTotal).toBe(0);
  });

  it('should append Kec. district only when address does not already contain district name', () => {
    // Arrange & Act
    const withAppend = formatFullAddress('Jl. Panglima Sudirman 10', 'Batu');
    const alreadyHasDistrict = formatFullAddress('Jl. Raya Junrejo No. 5', 'Junrejo');

    // Assert
    expect(withAppend).toBe('Jl. Panglima Sudirman 10, Kec. Batu');
    expect(alreadyHasDistrict).toBe('Jl. Raya Junrejo No. 5');
  });
});

// ============================================================================
// 3. TEST DOUBLE IMPLEMENTATION: Stub, Fake, and Mock/Spy
// ============================================================================
describe('createBankSampah - Test Double Implementation (Stub, Fake, Mock)', () => {
  it('should register Aktif BSU, persist breakdown to FakeLocalStorage, and invoke Mock notifier', async () => {
    // Arrange
    const newBank = {
      district: 'Batu',
      code: 'BATU-10',
      name: 'BSU Melati Bersih',
      address: 'Jl. Diponegoro No. 12',
      status: 'Aktif',
      manager: 'Siti Aminah',
      phone: '081234567899',
      members: '45',
      plastic: '15',
      paper: '10',
      iron: '0',
      bottle: '5',
      glass: '0',
      oil: '0',
    };

    // Test Double 1: STUB (replaces Supabase database insert with predetermined success response)
    const dbStub = {
      insertBankSampah: async (payload) => ({
        data: [{ id: 101, ...payload }],
        error: null,
      }),
    };

    // Test Double 2: FAKE (in-memory FakeLocalStorage replacing browser localStorage)
    const fakeStorage = new FakeLocalStorage();

    // Test Double 3: MOCK (verifies notification interaction and exact message argument)
    const notifierMock = {
      notify: vi.fn(),
    };

    // Act
    const result = await createBankSampah(newBank, {
      dbClient: dbStub,
      storage: fakeStorage,
      notifier: notifierMock,
    });

    // Assert
    expect(result.ok).toBe(true);
    expect(result.volume).toBe(30);
    expect(result.data.address).toBe('Jl. Diponegoro No. 12, Kec. Batu');

    const saved = JSON.parse(fakeStorage.getItem('bank_sampah_breakdowns'));
    expect(saved['101'].plastic).toBe('15');
    expect(saved['101'].paper).toBe('10');

    expect(notifierMock.notify).toHaveBeenCalledTimes(1);
    expect(notifierMock.notify).toHaveBeenCalledWith(
      'Unit Bank Sampah "BSU Melati Bersih" berhasil didaftarkan secara resmi!'
    );
  });

  it('should handle database failure using Stub and NOT call notifier Mock', async () => {
    // Arrange
    const newBank = {
      district: 'Bumiaji',
      code: 'BUM-03',
      name: 'BSU Mawar',
      address: 'Desa Punten, Bumiaji',
      status: 'Vakum',
      statusReason: 'Sedang renovasi gudang penyimpanan',
    };

    // Test Double 1: STUB returning simulated Supabase error
    const dbErrorStub = {
      insertBankSampah: async () => ({
        data: null,
        error: { message: 'duplicate key value violates unique constraint' },
      }),
    };
    const fakeStorage = new FakeLocalStorage();
    const notifierMock = { notify: vi.fn() };

    // Act
    const result = await createBankSampah(newBank, {
      dbClient: dbErrorStub,
      storage: fakeStorage,
      notifier: notifierMock,
    });

    // Assert
    expect(result.ok).toBe(false);
    expect(result.message).toContain('Gagal menambah bank sampah');
    expect(fakeStorage.getItem('bank_sampah_breakdowns')).toBeNull();
    expect(notifierMock.notify).not.toHaveBeenCalled();
  });

  it('should reject invalid form before calling database (using Dummy dependencies)', async () => {
    // Arrange
    const invalidBank = {
      district: 'Batu',
      code: 'WRONG-01',
      name: 'BSU Invalid',
      address: 'Jl. Test',
      status: 'Aktif',
      manager: '',
      phone: '123',
      plastic: '0',
    };
    // DUMMY dependencies (required signature, never invoked because validation fails early)
    const dummyDeps = { dbClient: {}, storage: {}, notifier: {} };

    // Act
    const result = await createBankSampah(invalidBank, dummyDeps);

    // Assert
    expect(result.ok).toBe(false);
    expect(result.errors.code).toBeDefined();
    expect(result.errors.manager).toBeDefined();
    expect(result.errors.phone).toBeDefined();
    expect(result.errors.waste).toBeDefined();
  });

  it('should reject when required name or address is missing', async () => {
    // Arrange
    const missingFieldsBank = {
      district: 'Batu',
      code: 'BATU-11',
      name: '',
      address: '',
      status: 'Vakum',
      statusReason: 'Unit sedang tidak beroperasi sementara',
    };
    const dummyDeps = { dbClient: {}, storage: {}, notifier: {} };

    // Act
    const result = await createBankSampah(missingFieldsBank, dummyDeps);

    // Assert
    expect(result.ok).toBe(false);
    expect(result.message).toBe('Harap lengkapi Kode, Nama BSU, dan Alamat!');
  });

  it('should register Vakum BSU with 0 volume and save breakdown to FakeLocalStorage', async () => {
    // Arrange
    const vakumBank = {
      district: 'Bumiaji',
      code: 'BUM-04',
      name: 'BSU Kenanga',
      address: 'Desa Tulungrejo, Bumiaji',
      status: 'Vakum',
      statusReason: 'Sedang menunggu SK pengurus baru',
      plastic: '25',
    };
    const dbStub = {
      insertBankSampah: async (payload) => ({ data: [{ id: 202, ...payload }], error: null }),
    };
    const fakeStorage = new FakeLocalStorage();
    const notifierMock = { notify: vi.fn() };

    // Act
    const result = await createBankSampah(vakumBank, {
      dbClient: dbStub,
      storage: fakeStorage,
      notifier: notifierMock,
    });

    // Assert
    expect(result.ok).toBe(true);
    expect(result.volume).toBe(0);
    const saved = JSON.parse(fakeStorage.getItem('bank_sampah_breakdowns'));
    expect(saved['202'].plastic).toBe('0');
    expect(saved['202'].statusReason).toBe('Sedang menunggu SK pengurus baru');
    expect(notifierMock.notify).toHaveBeenCalledTimes(1);
  });
});
