export const statsData = {
  totalCollected: { value: 1245, unit: 'Tons', change: 12.98, period: 'Oct 16 - Nov 14' },
  successfullyRecycled: { value: 850, unit: 'Tons', change: 8.45, period: 'Oct 16 - Nov 14' },
  processedForEnergy: { value: 395, unit: 'Tons', change: 15.20, period: 'Oct 16 - Nov 14' },
  activeWasteBanks: { value: 142, unit: 'Units', change: 2.15, label: 'Across 3 Districts' },
};

export const monthlyTrends = [
  { month: 'Jan', collected: 780, recycled: 520 },
  { month: 'Feb', collected: 820, recycled: 560 },
  { month: 'Mar', collected: 850, recycled: 590 },
  { month: 'Apr', collected: 870, recycled: 610 },
  { month: 'May', collected: 910, recycled: 640 },
  { month: 'Jun', collected: 940, recycled: 670 },
  { month: 'Jul', collected: 980, recycled: 700 },
  { month: 'Aug', collected: 1020, recycled: 730 },
  { month: 'Sep', collected: 1080, recycled: 760 },
  { month: 'Oct', collected: 1245, recycled: 850 },
];

export const wasteCategories = [
  { name: 'Plastic', value: 35, color: '#10b981' },
  { name: 'Paper', value: 28, color: '#3b82f6' },
  { name: 'Organic', value: 22, color: '#34d399' },
  { name: 'Metal/Glass', value: 15, color: '#94a3b8' },
];

export const wasteBankLocations = [
  { id: 1, name: 'Bank Sampah Melati', district: 'Kec. Batu, Kel. Sisir', volume: 45.2, lastCollection: 'Today, 09:30 AM' },
  { id: 2, name: 'Bank Sampah Tunas Hijau', district: 'Kec. Bumiaji, Kel. Punten', volume: 32.8, lastCollection: 'Yesterday' },
  { id: 3, name: 'Bank Sampah Berseri', district: 'Kec. Junrejo, Kel. Pendem', volume: 28.5, lastCollection: 'Nov 12, 2023' },
];
