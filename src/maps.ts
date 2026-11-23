export type Mode = 'walking' | 'transit' | 'driving'

export function mapSearch(query: string) {
  return 'https://www.google.com/maps/search/?' + new URLSearchParams({ api: '1', query })
}

export function directions(destination: string, travelmode: Mode, origin = '', navigate = false) {
  const params = new URLSearchParams({ api: '1', destination, travelmode })
  if (origin) params.set('origin', origin)
  if (navigate) params.set('dir_action', 'navigate')
  return 'https://www.google.com/maps/dir/?' + params
}

export function externalUrl(value = '') {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined
  } catch {
    return undefined
  }
}
