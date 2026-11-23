import { useEffect, useState, type ReactNode } from 'react'

export function useSaved<T,>(key: string, initial: T) {
  const storageKey = 'budapest-navi:' + key
  const [value, setValue] = useState<T>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) ?? 'null') ?? initial }
    catch { return initial }
  })
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(value)) }
    catch { window.dispatchEvent(new Event('travel-storage-error')) }
  }, [storageKey, value])
  return [value, setValue] as const
}
export function Link({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return <a className={'button' + (primary ? ' primary' : '')} href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a>
}
