const BASE = 'https://psgc.cloud/api'

export interface PsgcRegion { code: string; name: string }
export interface PsgcProvince { code: string; name: string }
export interface PsgcCity { code: string; name: string; type: string }

/** Derives the parent region code from a province code (first 2 digits + 8 zeros) */
export function regionCodeOf(province: PsgcProvince): string {
  return province.code.substring(0, 2).padEnd(10, '0')
}

let _regions: PsgcRegion[] | null = null
let _provinces: PsgcProvince[] | null = null
const _citiesByProvince = new Map<string, PsgcCity[]>()

export async function getRegions(): Promise<PsgcRegion[]> {
  if (!_regions) {
    const res = await fetch(`${BASE}/regions`)
    const data: PsgcRegion[] = await res.json()
    _regions = data.sort((a, b) => a.name.localeCompare(b.name))
  }
  return _regions
}

export async function getProvinces(): Promise<PsgcProvince[]> {
  if (!_provinces) {
    const res = await fetch(`${BASE}/provinces`)
    const data: PsgcProvince[] = await res.json()
    _provinces = data.sort((a, b) => a.name.localeCompare(b.name))
  }
  return _provinces
}

export async function getCitiesByProvince(provinceCode: string): Promise<PsgcCity[]> {
  if (!_citiesByProvince.has(provinceCode)) {
    const res = await fetch(`${BASE}/provinces/${provinceCode}/cities-municipalities`)
    const data: PsgcCity[] = await res.json()
    _citiesByProvince.set(provinceCode, data.sort((a, b) => a.name.localeCompare(b.name)))
  }
  return _citiesByProvince.get(provinceCode)!
}
