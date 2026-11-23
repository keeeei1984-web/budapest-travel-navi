import { useEffect, useMemo, useRef, useState } from 'react'
import { divIcon, featureGroup, latLngBounds, map as createMap, marker, tileLayer, type FeatureGroup, type Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { mapSearch } from './maps'
import { Link } from './shared'

export const mapCategories = {
  sightseeing: { label: '観光', symbol: '観' },
  restaurant: { label: 'レストラン', symbol: '食' },
  bath: { label: '温泉', symbol: '湯' },
  hotel: { label: 'ホテル', symbol: '宿' },
} as const
export type MapCategory = keyof typeof mapCategories
export type MapCoordinates = [number, number]
export type MapPlace = { id: string; name: string; query: string; kind: MapCategory; coordinates?: MapCoordinates }
const categories = Object.keys(mapCategories) as MapCategory[]
const budapest: MapCoordinates = [47.5015, 19.057]

export function HomeMap({ places, online, route }: { places: MapPlace[]; online: boolean; route: (id: string) => void }) {
  const container = useRef<HTMLDivElement>(null)
  const view = useRef<LeafletMap | null>(null)
  const markers = useRef<FeatureGroup | null>(null)
  const [filters, setFilters] = useState<MapCategory[]>(categories)
  const [selectedId, setSelectedId] = useState('')
  const [tileError, setTileError] = useState(false)
  const visible = useMemo(() => places.filter(place => filters.includes(place.kind)), [places, filters])
  const selected = visible.find(place => place.id === selectedId)
  const unpinned = visible.filter(place => !place.coordinates)

  function fit(points: MapPlace[]) {
    const coordinates = points.flatMap(place => place.coordinates ? [place.coordinates] : [])
    if (coordinates.length) view.current?.fitBounds(latLngBounds(coordinates), { padding: [32, 32], maxZoom: 15 })
    else view.current?.setView(budapest, 13)
  }

  useEffect(() => {
    if (!container.current) return
    const instance = createMap(container.current, { scrollWheelZoom: false, zoomControl: false, fadeAnimation: false }).setView(budapest, 13)
    view.current = instance
    instance.attributionControl?.setPrefix(false)
    instance.attributionControl?.addAttribution('<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>')
    const overlay = featureGroup().addTo(instance)
    markers.current = overlay
    const resize = new ResizeObserver(() => instance.invalidateSize({ pan: false }))
    resize.observe(container.current)
    return () => {
      resize.disconnect()
      instance.remove()
      view.current = null
      markers.current = null
    }
  }, [])

  useEffect(() => {
    const instance = view.current
    if (!instance || !online) return
    const layer = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, keepBuffer: 1 })
    layer.on('tileerror', () => setTileError(true))
    layer.on('tileload', () => setTileError(false))
    layer.addTo(instance)
    return () => { layer.remove() }
  }, [online])

  useEffect(() => {
    const overlay = markers.current
    if (!overlay) return
    overlay.clearLayers()
    for (const place of visible) {
      if (!place.coordinates) continue
      const icon = divIcon({
        className: `trip-map-pin trip-map-${place.kind}`,
        html: mapCategories[place.kind].symbol,
        iconSize: [29, 29], iconAnchor: [14, 14],
      })
      const name = document.createElement('span')
      name.textContent = place.name
      marker(place.coordinates, { icon, title: place.name, alt: place.name, zIndexOffset: place.kind === 'hotel' ? 250 : 0 })
        .bindPopup(name, { offset: [0, -13] })
        .on('click', () => setSelectedId(place.id)).addTo(overlay)
    }
  }, [visible])


  function choose(id: string) {
    setSelectedId(id)
    const place = visible.find(item => item.id === id)
    if (place?.coordinates && view.current) {
      view.current.setView(place.coordinates, Math.max(15, view.current.getZoom()))
    }
  }

  return <section className="card home-map" aria-labelledby="home-map-title">
    <h2 id="home-map-title">ブダペストの地図</h2>
    <div className="segments trip-map-filters" role="group" aria-label="地図に表示する種類">
      {categories.map(kind => <button type="button" key={kind} aria-pressed={filters.includes(kind)} onClick={() => {
        setFilters(current => current.includes(kind) ? current.filter(value => value !== kind) : [...current, kind])
      }}><span aria-hidden="true" className={`trip-map-key trip-map-${kind}`}>{mapCategories[kind].symbol}</span>{mapCategories[kind].label}</button>)}
    </div>
    <div className="trip-map-frame">
      <div ref={container} className="trip-map-canvas" role="region" aria-label="ブダペストの地図。ピンを押すと場所を選べます。"/>
      <div className="trip-map-controls">
        <button onClick={() => view.current?.zoomIn()} aria-label="地図を拡大">＋</button>
        <button onClick={() => view.current?.zoomOut()} aria-label="地図を縮小">−</button>
        <button onClick={() => fit(visible)}>全体</button>
      </div>
    </div>
    {(!online || tileError) && <p className="hint">背景地図は通信が必要です。保存済みのピンは表示できます。</p>}
    <label className="trip-map-select">場所を選ぶ<select value={selected?.id ?? ''} onChange={e => choose(e.target.value)}>
      <option value="">ピンまたは場所を選択</option>
      {categories.map(kind => {
        const group = visible.filter(place => place.kind === kind)
        return group.length > 0 && <optgroup key={kind} label={mapCategories[kind].label}>
          {group.map(place => <option key={place.id} value={place.id}>{place.name}</option>)}
        </optgroup>
      })}
    </select></label>
    {selected && <div className="trip-map-selection" aria-live="polite">
      <strong>{selected.name}</strong>
      {!selected.coordinates && <small>地図上の位置は未登録です。</small>}
      <div className="row"><button onClick={() => route(selected.id)}>経路を見る</button><Link href={mapSearch(selected.query)}>Google マップ</Link></div>
    </div>}
    {unpinned.length > 0 && <p className="hint">位置が未登録の{unpinned.length}件は「場所を選ぶ」から確認できます。</p>}
  </section>
}
