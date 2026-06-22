import React from 'react';
import { Download } from 'lucide-react';

export default function WasteBreakdown({ bankId, bank }) {
  const saved = JSON.parse(localStorage.getItem('bank_sampah_breakdowns') || '{}');
  const stored = saved[bankId] || null;
  const remote = bank || {};

  const types = [
    { key: 'plastic', label: 'Plastik (kg)', field: 'year_plastik_kg' },
    { key: 'paper', label: 'Kertas (kg)', field: 'year_kertas_kg' },
    { key: 'iron', label: 'Besi/Logam (kg)', field: 'year_besi_logam_kg' },
    { key: 'bottle', label: 'Botol (kg)', field: 'year_botol_kg' },
    { key: 'glass', label: 'Beling (kg)', field: 'year_beling_kg' },
    { key: 'oil', label: 'Minyak Jelantah (L)', field: 'year_minyak_jelantah_l' },
  ];

  const values = types.map((t) => ({
    key: t.key,
    label: t.label,
    value: stored?.[t.key] ?? remote[t.field] ?? 0,
  }));

  const materials = stored?.materials ?? remote.materials ?? remote.accepted_materials ?? remote.waste_types ?? [];
  const materialTypes = Array.isArray(materials)
    ? materials
    : String(materials || '').split(/[,;]+/).map((item) => item.trim()).filter(Boolean);
  const hasAnyData = values.some((v) => parseFloat(v.value) > 0);
  const showMaterials = materialTypes.length > 0;

  if (!stored && !hasAnyData && !showMaterials) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-slate-900 font-semibold">
        Tidak ada data rinci. Admin dapat menambahkan rincian jenis sampah pada konsol.
      </div>
    );
  }

  const nonZeroCount = values.filter((t) => parseFloat(t.value) > 0).length;

  const handleDownload = () => {
    const headers = ['Jenis', 'Jumlah'];
    const rows = values.map((t) => [t.label, t.value]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `Breakdown_BankSampah_${bankId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-900 font-bold">
          Jumlah jenis tercatat: <span className="text-emerald-600">{nonZeroCount}</span>
        </div>
        <button onClick={handleDownload} className="btn-outline text-xs flex items-center gap-2">
          <Download className="w-3.5 h-3.5" />Export
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {values.map((t) => (
          <div key={t.key} className="p-2 rounded border border-emerald-100 bg-white text-slate-900 text-xs">
            <div className="font-semibold">{t.label}</div>
            <div className="text-slate-700">{t.value ?? 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
