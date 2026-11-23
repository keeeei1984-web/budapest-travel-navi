import { useSaved } from './shared'

type Rate = { value: number; date: string; updated: string; source: 'Frankfurter / ECB' | '手動' }

export function useExchangeRate() {
  const [saved, setSaved] = useSaved<Rate | null>('rate-online', null)
  const [manual, setManual] = useSaved<Rate | null>('rate-manual', null)
  const [preferManual, setPreferManual] = useSaved('rate-use-manual', false)
  const rate = preferManual ? manual ?? saved : saved ?? manual
  return { saved, setSaved, manual, setManual, preferManual, setPreferManual, rate }
}

export async function fetchExchangeRate(): Promise<Rate> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch('https://api.frankfurter.dev/v1/latest?base=HUF&symbols=JPY', { signal: controller.signal, cache: 'no-store' })
    if (!response.ok) throw new Error('rate request')
    const data = await response.json()
    const value = data.rates?.JPY
    if (data.base !== 'HUF' || typeof value !== 'number' || !Number.isFinite(value) || value <= 0
      || typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error('rate data')
    return { value, date: data.date, updated: new Date().toISOString(), source: 'Frankfurter / ECB' }
  } finally {
    window.clearTimeout(timeout)
  }
}
