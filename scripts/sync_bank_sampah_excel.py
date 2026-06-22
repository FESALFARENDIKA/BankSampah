#!/usr/bin/env python3
import argparse
import json
import re
import sys
from pathlib import Path
from urllib import parse, request, error

import pandas as pd

ENV_DEFAULT = Path('.env.local')
EXCEL_DEFAULT = Path('external/DatabaseLocal.xlsx')
SHEET_NAMES = ['Pengurangan Bumiaji', 'Pengurangan Batu', 'Pengurangan Junrejo']
HEADER_ROW = 9
DATA_START_ROW = HEADER_ROW + 3

# Excel field mapping for summary data
# - columns 10..18 are older semester summary and are ignored.
# - columns 19..27 are the latest yearly summary values.
# New Supabase columns should include only the latest year summary:
#   year_plastik_kg, year_kertas_kg, year_besi_logam_kg,
#   year_botol_kg, year_beling_kg, year_minyak_jelantah_l,
#   year_nasabah


def load_env(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(f'Missing env file: {path}')
    env = {}
    for raw in path.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        env[key.strip()] = value.strip()
    return env


def is_blank(value) -> bool:
    if value is None:
        return True
    text = str(value).strip()
    return text == '' or text.lower() in {'nan', 'none', 'na'}


def normalize_text(value):
    if is_blank(value):
        return ''
    text = str(value).strip()
    # Keep punctuation but normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    return text


def normalize_code(value):
    code = normalize_text(value)
    if not code:
        return ''
    code = code.replace('\u00A0', ' ').replace('\u2007', ' ').replace('\u202F', ' ')
    code = re.sub(r'\s+', ' ', code)
    code = re.sub(r'\s*[-–—]\s*', '-', code)
    # Final code values should not contain spaces inside the identifier.
    code = code.replace(' ', '')
    return code.upper()


def parse_status(value):
    status = normalize_text(value)
    if not status:
        return None
    lower = status.lower()
    if 'dihapus' in lower:
        return 'Dihapus'
    if 'digabung' in lower:
        return 'Digabung'
    if 'tidak aktif' in lower or ( 'tidak' in lower and 'aktif' in lower ):
        return 'Tidak Aktif'
    if 'aktif' in lower:
        return 'Aktif'
    return status.capitalize()


def parse_coordinates(value):
    if is_blank(value):
        return None
    text = str(value).strip()
    text = re.sub(r'[;,]+', ';', text)
    text = re.sub(r'\s*\.\s*', '.', text)
    # Replace comma separators between decimals with a dot if the token does not already contain one
    text = text.replace(' ,', '.').replace(', ', '.')
    numbers = re.findall(r'-?\d+(?:\.\d+)?', text)
    if len(numbers) < 2:
        return None
    lat = float(numbers[0])
    lng = float(numbers[1])
    if not (-90 <= lat <= 90 and -180 <= lng <= 180):
        return None
    return f"{lat};{lng}"


def parse_number(value):
    if is_blank(value):
        return None
    text = str(value).strip()
    text = text.replace(',', '.')
    try:
        return float(text)
    except ValueError:
        return None


def parse_integer(value):
    num = parse_number(value)
    if num is None:
        return None
    return int(num)


def load_excel(path: Path, sheets):
    if not path.exists():
        raise FileNotFoundError(f'Missing Excel file: {path}')
    wb = pd.ExcelFile(path)
    records = []
    for sheet in sheets:
        if sheet not in wb.sheet_names:
            print(f'Warning: sheet not found: {sheet}', file=sys.stderr)
            continue
        df = wb.parse(sheet, header=None)
        for idx in range(DATA_START_ROW, len(df)):
            row = df.iloc[idx]
            code = normalize_code(row[2])
            if not code or code.lower() == 'total':
                continue
            name = normalize_text(row[3])
            if not name:
                continue
            status = parse_status(row[4])
            address = normalize_text(row[5])
            manager = normalize_text(row[6])
            coordinates = parse_coordinates(row[7])
            phone = normalize_text(row[8])
            sk_number = normalize_text(row[9])
            members = parse_integer(row[18])
            volume = parse_number(row[16])

            # Ignore semester columns and use latest yearly summary only
            year_plastik_kg = parse_number(row[19])
            year_kertas_kg = parse_number(row[20])
            year_besi_logam_kg = parse_number(row[21])
            year_botol_kg = parse_number(row[22])
            year_beling_kg = parse_number(row[23])
            year_minyak_jelantah_l = parse_number(row[24])
            year_nasabah = parse_integer(row[27])

            if members is not None and members < 0:
                members = None
            if volume is not None and volume < 0:
                volume = None

            record = {
                'code': code,
                'name': name,
                'status': status,
                'address': address,
                'manager': manager,
                'coordinates': coordinates,
                'phone': phone,
                'sk_number': sk_number,
                'members': members,
                'volume': volume,
                'year_plastik_kg': year_plastik_kg,
                'year_kertas_kg': year_kertas_kg,
                'year_besi_logam_kg': year_besi_logam_kg,
                'year_botol_kg': year_botol_kg,
                'year_beling_kg': year_beling_kg,
                'year_minyak_jelantah_l': year_minyak_jelantah_l,
                'year_nasabah': year_nasabah,
                'sheet': sheet,
                'row': idx + 1,
            }
            records.append(record)
    return records


def clean_record(record: dict) -> dict:
    cleaned = {}
    for key, value in record.items():
        if key in {'sheet', 'row'}:
            continue
        if value is None:
            continue
        if isinstance(value, str) and value.strip() == '':
            continue
        cleaned[key] = value
    return cleaned


def supabase_request(url, method='GET', body=None, headers=None, timeout=30):
    headers = headers or {}
    data = None
    if body is not None:
        payload = json.dumps(body).encode('utf-8')
        headers['Content-Type'] = 'application/json'
        data = payload
    req = request.Request(url, data=data, method=method, headers=headers)
    try:
        with request.urlopen(req, timeout=timeout) as resp:
            text = resp.read().decode('utf-8')
            try:
                return resp.status, json.loads(text)
            except json.JSONDecodeError:
                return resp.status, text
    except error.HTTPError as exc:
        message = exc.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'HTTP {exc.code}: {message}')


def fetch_existing_banks(base_url, headers):
    url = f"{base_url}/rest/v1/bank_sampah?select=*&order=code.asc"
    status, result = supabase_request(url, method='GET', headers=headers)
    if status != 200:
        raise RuntimeError(f'Unexpected response status {status} while fetching existing banks')
    return {str(item.get('code')).strip(): item for item in result}


def update_record(base_url, headers, code, payload):
    query = parse.quote(f'code=eq.{code}', safe='=.,-')
    url = f"{base_url}/rest/v1/bank_sampah?{query}"
    headers = dict(headers)
    headers['Prefer'] = 'return=representation'
    return supabase_request(url, method='PATCH', body=payload, headers=headers)


def insert_record(base_url, headers, payload):
    url = f"{base_url}/rest/v1/bank_sampah?return=representation"
    headers = dict(headers)
    headers['Prefer'] = 'return=representation'
    return supabase_request(url, method='POST', body=payload, headers=headers)


def run(args):
    env = load_env(Path(args.env))
    supabase_url = env.get('VITE_SUPABASE_URL')
    supabase_key = env.get('VITE_SUPABASE_ANON_KEY')
    if not supabase_url or not supabase_key:
        raise RuntimeError('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in env file')

    base_url = supabase_url.rstrip('/')
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}',
        'Accept': 'application/json'
    }

    sheets = args.sheets or SHEET_NAMES
    records = load_excel(Path(args.excel), sheets)
    if not records:
        print('No records extracted from Excel. Check sheet names and row layout.', file=sys.stderr)
        return 1

    print(f'Loaded {len(records)} records from Excel: {sheets}')
    if args.preview or args.preview_only:
        for item in records[:min(15, len(records))]:
            print(item)
        if args.preview_only:
            return 0

    if not args.sync:
        print('Dry run mode active. Use --sync to apply changes to Supabase.')

    existing = fetch_existing_banks(base_url, headers)
    print(f'Fetched {len(existing)} existing bank_sampah records from Supabase.')

    inserted = 0
    updated = 0
    skipped = 0
    failed = 0

    for record in records:
        code = record['code']
        clean = clean_record(record)
        payload = {k: v for k, v in clean.items() if k not in {'code'}}
        if not payload:
            skipped += 1
            continue

        if code in existing:
            if args.sync:
                try:
                    status, resp = update_record(base_url, headers, code, payload)
                    if status in (200, 204):
                        updated += 1
                        print(f'Updated {code}: {payload}')
                    else:
                        failed += 1
                        print(f'Error updating {code}: status={status} resp={resp}')
                except Exception as exc:
                    failed += 1
                    print(f'Update failed for {code}: {exc}', file=sys.stderr)
            else:
                updated += 1
                print(f'[DRY RUN] Would update {code}: {payload}')
        else:
            if args.sync:
                try:
                    status, resp = insert_record(base_url, headers, payload | {'code': code})
                    if status in (201, 200):
                        inserted += 1
                        print(f'Inserted {code}: {payload}')
                    else:
                        failed += 1
                        print(f'Error inserting {code}: status={status} resp={resp}')
                except Exception as exc:
                    failed += 1
                    print(f'Insert failed for {code}: {exc}', file=sys.stderr)
            else:
                inserted += 1
                print(f'[DRY RUN] Would insert {code}: {payload | {"code": code}}')

    print('\nSummary:')
    print(f'  records processed: {len(records)}')
    print(f'  existing rows matched: {len([r for r in records if r["code"] in existing])}')
    print(f'  updates: {updated}')
    print(f'  inserts: {inserted}')
    print(f'  skipped: {skipped}')
    print(f'  failed: {failed}')
    return 0 if failed == 0 else 2


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Sync Excel bank_sampah master data into Supabase')
    parser.add_argument('--env', default=str(ENV_DEFAULT), help='Path to .env.local with Supabase credentials')
    parser.add_argument('--excel', default=str(EXCEL_DEFAULT), help='Path to local Excel workbook')
    parser.add_argument('--sheets', nargs='+', help='Sheet names to process')
    parser.add_argument('--preview', action='store_true', help='Print extracted records and exit')
    parser.add_argument('--preview-only', action='store_true', help='Print preview and stop before any Supabase operations')
    parser.add_argument('--sync', action='store_true', help='Actually perform inserts/updates in Supabase')
    parser.add_argument('--supabase-schema', action='store_true', help='Print recommended Supabase ALTER TABLE statements for new columns')
    args = parser.parse_args()

    if args.supabase_schema:
        print('Recommended Supabase column additions for bank_sampah:')
        print('''
ALTER TABLE public.bank_sampah
  ADD COLUMN year_plastik_kg numeric,
  ADD COLUMN year_kertas_kg numeric,
  ADD COLUMN year_besi_logam_kg numeric,
  ADD COLUMN year_botol_kg numeric,
  ADD COLUMN year_beling_kg numeric,
  ADD COLUMN year_minyak_jelantah_l numeric,
  ADD COLUMN year_nasabah integer;''')
        sys.exit(0)

    sys.exit(run(args))
