import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { addedBaths, categorizeSavedPlace, days, galleryBaths, latestRestaurants, placeDisplayName, places, restaurantIdentity, type Place } from './data'
import { directions, externalUrl, mapSearch, type Mode } from './maps'
import { Tools, type RestaurantTopic } from './tools'
import { TransferQuickView } from './flight-guide'
import { flightGuideTitle } from './flight-guide-data'
import { Link, useSaved } from './shared'
import { ReservationDirectory, ReservationLinks } from './restaurant-reservations'
import { CandidatePhotos, candidateNotes, restaurantMenus } from './candidate-photos'
import { RestaurantHighlights, restaurantShowcases } from './restaurant-showcase'
import { BathComparison, BathCover, BathDetails } from './bath-gallery'
import { bathInfo } from './bath-info'
import { HomeMap, type MapCategory, type MapPlace } from './home-map'
import { defaultCoordinates, mapCoordinates } from './map-coordinates'
import './style.css'

type Visit = { id: string; placeId: string; time: string; note: string; done: boolean; skipped?: boolean }
type Trip = { hotel: string; hotelMap: string; arrival: string; departure: string; flightNote: string }
type Tab = 'ホーム' | '移動' | '旅程' | '候補' | 'ツール'
const defaultHotelMapName = 'Hotel Rum Budapest'
const defaultHotelName = 'ホテル・ラム・ブダペスト'
const initialTrip = { hotel: defaultHotelName, hotelMap: 'https://maps.app.goo.gl/9ZmmA5YdwQtzotwZA', arrival: '09:15', departure: '14:25', flightNote: '' }
const glyphs = { 'ホーム': '⌂', '移動': '↗', '旅程': '▤', '候補': '◇', 'ツール': '⊞' }
const modes: [Mode, string][] = [['walking', '徒歩'], ['transit', '公共交通'], ['driving', '車']]
const hotelId = '@hotel'
const airportId = '@airport'
const mapKinds: Record<Place['kind'], MapCategory> = { '観光': 'sightseeing', '食事': 'restaurant', '温泉': 'bath' }
function dayLabel(day: string) { return '2月' + Number(day.slice(-2)) + '日' }

function Order({ index, length, move }: { index: number; length: number; move: (delta: number) => void }) {
  return <><button disabled={!index} onClick={() => move(-1)} aria-label="上に移動">↑</button><button disabled={index === length - 1} onClick={() => move(1)} aria-label="下に移動">↓</button></>
}
function moveItem<T>(items: T[], index: number, delta: number) {
  const next = [...items]
  next.splice(index + delta, 0, ...next.splice(index, 1))
  return next
}
function App() {
  const [tab, setTab] = useState<Tab>('ホーム')
  const [trip, setTrip] = useSaved('trip', initialTrip)
  const [savedPlaces, savePlaces] = useSaved<Place[] | { items: Place[]; galleryAdded?: boolean; restaurantsAdded?: boolean }>('places', { items: places, galleryAdded: true, restaurantsAdded: true })
  const legacy = Array.isArray(savedPlaces)
  const savedList = legacy ? savedPlaces.map(categorizeSavedPlace) : savedPlaces.items
  const bathAdditions = legacy ? [...addedBaths, ...galleryBaths] : savedPlaces.galleryAdded ? [] : galleryBaths
  const restaurantAdditions = legacy || !savedPlaces.restaurantsAdded ? latestRestaurants : []
  const list = [...savedList,
    ...bathAdditions.filter(bath => !savedList.some(place => place.id === bath.id || place.map === bath.map)),
    ...restaurantAdditions.filter(restaurant => !savedList.some(place => restaurantIdentity(place) === restaurant.id)),
  ]
  const setList = (items: Place[]) => savePlaces({ items, galleryAdded: true, restaurantsAdded: true })
  const [schedule, setSchedule] = useSaved<Record<string, Visit[]>>('schedule', {})
  const [day, setDay] = useSaved('day', days[0])
  const [mode, setMode] = useSaved<Mode>('mode', 'transit')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState(hotelId)
  const [kind, setKind] = useState<Place['kind']>('観光')
  const [bathFavorites, setBathFavorites] = useSaved<string[]>('bath-favorites', [])
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [bathSelection, setBathSelection] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [bathView, setBathView] = useState<{ id: string; zoom: boolean } | null>(null)
  const bathDetail = list.find(place => place.id === bathView?.id)
  const comparison = list.filter(place => bathSelection.includes(place.id))
  const [newName, setNewName] = useState('')
  const [toAdd, setToAdd] = useState('')
  const [tool, setTool] = useState('交通・空港')
  const [transferQuick, setTransferQuick] = useState(false)
  const [phraseTopic, setPhraseTopic] = useState<RestaurantTopic>('すべて')
  const [storageError, setStorageError] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)
  const [offlineReady, setOfflineReady] = useState(false)
  const [notice, setNotice] = useState('')
  const main = useRef<HTMLElement>(null)
  const hotelName = trip.hotel.trim() === defaultHotelMapName ? defaultHotelName : trip.hotel
  const hotelQuery = hotelName.trim() === defaultHotelName ? defaultHotelMapName : hotelName.trim()
  const hotel = hotelQuery ? hotelQuery + ', Budapest' : ''
  const mapValue = (id: string) => {
    if (id === hotelId) return hotel
    if (id === airportId) return 'Budapest Ferenc Liszt International Airport'
    const place = list.find(p => p.id === id)
    return place ? place.map.trim() || place.name + ', Budapest' : ''
  }
  const homeMapPlaces: MapPlace[] = [
    ...(hotel ? [{ id: hotelId, name: hotelName, query: hotel, kind: 'hotel' as const, coordinates: hotelQuery === defaultHotelMapName ? defaultCoordinates.hotel : undefined }] : []),
    ...list.map(place => ({
      id: place.id, name: placeDisplayName(place.name), query: mapValue(place.id),
      kind: mapKinds[place.kind], coordinates: mapCoordinates(place),
    })),
  ]
  const visitList = schedule[day] ?? []
  const isPending = (visit: Visit) => !visit.done && !visit.skipped && !!mapValue(visit.placeId)
  const next = visitList.find(isPending)
  const label = (id: string) => {
    if (id === hotelId) return hotelName || 'ホテル'
    if (id === airportId) return 'ブダペスト空港'
    const place = list.find(item => item.id === id)
    return place && placeDisplayName(place.name)
  }
  const editDay = (visits: Visit[]) => setSchedule({ ...schedule, [day]: visits })
  function go(page: Tab) { setBathView(null); setTab(page); setNotice(''); window.scrollTo(0, 0); main.current?.focus({ preventScroll: true }) }
  function openOrderPhrases(topic: RestaurantTopic) { setPhraseTopic(topic); setTool('会話集'); go('ツール') }
  function openFlightGuide() { setTransferQuick(false); setTool(flightGuideTitle); go('ツール') }
  function openCurrency() { setTool('通貨換算'); go('ツール') }
  function showBath(id: string | null, zoom = false) {
    setBathView(id ? { id, zoom } : null)
    setNotice('')
    window.scrollTo(0, 0)
    main.current?.focus({ preventScroll: true })
  }
  function toggleFavorite(id: string) {
    setBathFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }
  function bathFavoriteButton(place: Place) {
    const active = bathFavorites.includes(place.id)
    return <button aria-pressed={active} onClick={() => toggleFavorite(place.id)}>{active ? '★ お気に入り' : '☆ お気に入り'}</button>
  }
  function route(from: string, to: string) { setOrigin(from); setDestination(to); go('移動') }
  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    const onStorageError = () => setStorageError(true)
    addEventListener('online', update)
    addEventListener('offline', update)
    addEventListener('travel-storage-error', onStorageError)
    function checkForUpdate() {
      if (document.visibilityState === 'visible' && navigator.onLine && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(reg => reg?.update()).catch(() => {})
      }
    }
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      const base = new URL(import.meta.env.BASE_URL, document.baseURI)
      document.addEventListener('visibilitychange', checkForUpdate)
      navigator.serviceWorker.register(new URL('sw.js', base), { updateViaCache: 'none' })
        .then(reg => { if (navigator.onLine) void reg.update().catch(() => {}); return navigator.serviceWorker.ready })
        .then(() => setOfflineReady(true)).catch(() => {})
    }
    return () => {
      document.removeEventListener('visibilitychange', checkForUpdate)
      removeEventListener('online', update)
      removeEventListener('offline', update)
      removeEventListener('travel-storage-error', onStorageError)
    }
  }, [])
  const placeOptions = (includeClosed = true) => <>
    <option value={hotelId}>{label(hotelId)}</option><option value={airportId}>ブダペスト空港</option>
    {list.filter(place => includeClosed || !bathInfo[place.id]?.closed).map(place =>
      <option key={place.id} value={place.id}>{placeDisplayName(place.name)}</option>)}
  </>
  const options = placeOptions()
  const dayPicker = <div className="segments days" aria-label="旅程の日付">{days.map((date, i) => <button key={date} aria-pressed={day === date} onClick={() => setDay(date)}>{dayLabel(date)}<small>{['水', '木', '金', '土'][i]}</small></button>)}</div>
  function addVisit(placeId: string) {
    if (!mapValue(placeId) || bathInfo[placeId]?.closed) return
    editDay([...visitList, { id: crypto.randomUUID(), placeId, time: '', note: '', done: false }])
    setNotice(dayLabel(day) + 'の旅程に「' + label(placeId) + '」を追加しました。')
  }

  return <>
    <header className="mast"><div className="wrap brand"><span className="seal" aria-hidden="true">ブ</span><div>ブダペスト旅行ナビ</div><span className="status">{!online ? 'オフライン' : offlineReady ? 'オフライン準備済み' : 'オンライン'}</span></div></header>
    <main ref={main} tabIndex={-1} className="wrap content">
      {storageError && <p role="alert" className="hint">端末に変更を保存できませんでした。Safariの設定や空き容量を確認してください。</p>}
      {tab === 'ホーム' && <>
        <section className="hero">
          <div className="hero-copy"><p>2027年2月10日 – 13日 ・ 3泊4日</p><h1>ブダペスト</h1></div>
        </section>
        <button className="primary home-transfer" onClick={() => setTransferQuick(true)}>✈ 乗り継ぎ中</button>
        <HomeMap places={homeMapPlaces} online={online} route={id => route('', id)}/>
        <section className="home-actions">
          <article className="card shortcut"><span className="square" aria-hidden="true">⌂</span><h2>ホテルに戻る</h2><p>{hotelName || 'ホテル未設定'} · 要確認</p><div className="row">{hotel && <Link primary href={directions(hotel, mode, '', true)}>Google マップで移動</Link>}{externalUrl(trip.hotelMap) && <Link href={externalUrl(trip.hotelMap)!}>ホテルの地図</Link>}</div></article>
          <article className="card shortcut"><span className="square" aria-hidden="true">↗</span><h2>次の目的地</h2><p>{dayLabel(day)} · {next ? label(next.placeId) : '未訪問の予定はありません'}</p>{next ? <Link primary href={directions(mapValue(next.placeId), mode, '', true)}>次の目的地へ移動</Link> : <button className="primary" onClick={() => go('旅程')}>旅程を開く →</button>}</article>
        </section>
        <section className="card"><h2>旅程を確認</h2>{dayPicker}<button onClick={() => go('旅程')}>{dayLabel(day)}の旅程を開く →</button></section>
        <section className="card"><h2>ホテル・航空便</h2><div className="summary"><div><small>2月10日 · 到着予定</small><strong>{trip.arrival || '未入力'}</strong></div><div><small>2月13日 · 出発予定</small><strong>{trip.departure || '未入力'}</strong></div></div>
          {trip.flightNote && <p className="pre">{trip.flightNote}</p>}
          <button onClick={openFlightGuide}>フライト・空港乗り継ぎガイド →</button>
          <details><summary>ホテル・航空便を編集</summary><div className="fields">
            <label>ホテル名（要確認）<input value={hotelName} onChange={e => setTrip({ ...trip, hotel: e.target.value })}/></label>
            <label>ホテルの地図URL<input type="url" value={trip.hotelMap} onChange={e => setTrip({ ...trip, hotelMap: e.target.value })}/></label>
            <label>2月10日 到着予定（現地時刻）<input type="time" value={trip.arrival} onChange={e => setTrip({ ...trip, arrival: e.target.value })}/></label>
            <label>2月13日 出発予定（現地時刻）<input type="time" value={trip.departure} onChange={e => setTrip({ ...trip, departure: e.target.value })}/></label>
            <label>航空会社・便名・メモ<textarea value={trip.flightNote} onChange={e => setTrip({ ...trip, flightNote: e.target.value })}/></label>
          </div></details>
        </section>
      </>}
      {tab === '移動' && <>
        <h1>移動ナビ</h1>
        <section className="card"><h2>経路を検索</h2><div className="fields">
          <label>出発地<select value={origin} onChange={e => setOrigin(e.target.value)}><option value="">現在地（Google マップ）</option>{options}</select></label>
          <label>目的地<select value={destination} onChange={e => setDestination(e.target.value)}>{options}</select></label>
          <div className="segments" aria-label="移動方法">{modes.map(([key, text]) => <button key={key} aria-pressed={mode === key} onClick={() => setMode(key)}>{text}</button>)}</div>
        </div>
        {mapValue(destination) && <div className="row"><Link href={directions(mapValue(destination), mode, mapValue(origin))}>経路を確認</Link><Link primary href={directions(mapValue(destination), mode, mapValue(origin), true)}>ナビを起動</Link></div>}
        <p className="hint">経路・所要時間は Google マップで確認できます。指定した出発地や移動方法によっては経路プレビューが開きます。</p></section>
        <section className="card"><h2>周辺を探す</h2><label>検索の基準<select value={origin} onChange={e => setOrigin(e.target.value)}><option value="">現在地（Google マップで位置情報を許可）</option>{options}</select></label><div className="row">{[['観光地', 'tourist attractions'], ['レストラン', 'restaurants']].map(([name, query]) => <Link key={name} href={mapSearch(query + ' near ' + (mapValue(origin) || 'me'))}>{name}</Link>)}</div></section>
      </>}
      {tab === '旅程' && <>
        <h1>旅程</h1>{dayPicker}
        <section className="card"><h2>{dayLabel(day)}の予定</h2>
          <p className="hint" role="status">{notice || (!visitList.length ? '候補を追加して、この日の訪問順を決められます。' : '『あとで行く』は当日の予定の最後に移動します。見送った予定はホームの次の目的地から外れます。')}</p>
          {visitList.map((visit, i) => {
            const following = visitList.slice(i + 1).find(isPending)
            const update = (change: Partial<Visit>) => editDay(visitList.map(item => item.id === visit.id ? { ...item, ...change } : item))
            return <article key={visit.id} className="entry">
              <h3>{label(visit.placeId) || '削除された候補'}</h3>
              <div className="fields"><label>予約時刻<input type="time" value={visit.time} onChange={e => update({ time: e.target.value })}/></label><label>メモ<textarea value={visit.note} onChange={e => update({ note: e.target.value })}/></label></div>
              {visit.skipped && <p className="hint">今日は見送り</p>}
              <label className="check"><input type="checkbox" checked={visit.done} disabled={visit.skipped} onChange={e => update({ done: e.target.checked })}/>訪問済み</label>
              <div className="row"><Order index={i} length={visitList.length} move={delta => editDay(moveItem(visitList, i, delta))}/>{following && !visit.skipped && mapValue(visit.placeId) && <button onClick={() => route(visit.placeId, following.placeId)}>次の訪問先への経路</button>}{!visit.done && !visit.skipped && <button disabled={!following} onClick={() => {
                editDay([...visitList.filter(item => item.id !== visit.id), visit])
                setNotice('「' + label(visit.placeId) + '」を当日の予定の最後に移動しました。')
              }}>あとで行く</button>}
              {!visit.done && <button onClick={() => {
                update({ skipped: !visit.skipped })
                setNotice(visit.skipped ? '予定に戻しました。' : '今日は見送ります。予定からいつでも戻せます。')
              }}>{visit.skipped ? '予定に戻す' : '今日は見送る'}</button>}<button onClick={() => editDay(visitList.filter(item => item.id !== visit.id))}>旅程から削除</button></div>
            </article>
          })}
          <form className="row" onSubmit={e => { e.preventDefault(); addVisit(toAdd); setToAdd('') }}>
            <label>訪問先<select required value={toAdd} onChange={e => setToAdd(e.target.value)}><option value="">訪問先を選択</option>{placeOptions(false)}</select></label><button className="primary" disabled={!mapValue(toAdd)}>旅程に追加</button>
          </form>
        </section>
      </>}
      {tab === '候補' && <>
        <h1>観光・レストラン・温泉候補</h1>
        <div className="segments">{(['観光', '食事', '温泉'] as const).map(key => <button key={key} aria-pressed={kind === key} onClick={() => { setKind(key); setBathView(null); setNotice('') }}>{key === '食事' ? 'レストラン' : key}</button>)}</div>
        {dayPicker}<p className="hint" role="status">{notice || (kind === '食事' ? '料理の提供・営業・予約状況は各店舗でご確認ください。' : kind === '温泉' ? '営業時間・料金・入場条件は公式サイトでご確認ください。' : '候補から訪問先を選んで旅程に追加できます。')}</p>
        {kind === '食事' && <ReservationDirectory places={list.filter(place => place.kind === '食事')} identify={restaurantIdentity}/>}
        {kind === '温泉' && bathDetail ? <BathDetails place={bathDetail} zoom={bathView?.zoom ?? false} back={() => showBath(null)} currency={openCurrency}>
          <div className="row">{bathFavoriteButton(bathDetail)}
            {!bathInfo[bathDetail.id]?.closed && <button className="primary" onClick={() => addVisit(bathDetail.id)}>{dayLabel(day)}に追加</button>}
          </div>
        </BathDetails> : <>
        {kind === '温泉' && <>
          <div className="row bath-toolbar">
            <button aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(!favoritesOnly)}>お気に入りのみ</button>
            <button disabled={comparison.length < 2} onClick={() => setShowComparison(!showComparison)}>選んだ温泉を比較（{comparison.length}件）</button>
          </div>
          {showComparison && <BathComparison places={comparison} close={() => setShowComparison(false)} currency={openCurrency}/>}
        </>}
        <section className={kind === '温泉' ? 'bath-list' : 'card'}>
          {kind === '温泉' && favoritesOnly && !list.some(place => place.kind === '温泉' && bathFavorites.includes(place.id)) && <p className="hint">お気に入りの温泉はまだありません。</p>}
          {list.filter(place => place.kind === kind).map((place, index, visible) => {
            if (kind === '温泉' && favoritesOnly && !bathFavorites.includes(place.id)) return null
            const restaurantId = restaurantIdentity(place)
            const hasHighlights = place.kind === '食事' && Boolean(restaurantShowcases[restaurantId])
            const update = (change: Partial<Place>) => setList(list.map(item => item.id === place.id ? { ...item, ...change } : item))
            return <article key={place.id} className="entry">
              {kind === '温泉' && <BathCover place={place} open={() => showBath(place.id, true)}/>}
              <h3>{placeDisplayName(place.name)}</h3>
              {kind === '温泉' ? <>
                {bathInfo[place.id] && <small lang="en">{bathInfo[place.id]?.english}</small>}
                <div className="row">{bathFavoriteButton(place)}
                  <button onClick={() => showBath(place.id)}>浴槽写真・詳細</button>
                  {bathInfo[place.id] && <label className="check"><input type="checkbox" checked={bathSelection.includes(place.id)} onChange={e => setBathSelection(e.target.checked ? [...bathSelection, place.id] : bathSelection.filter(id => id !== place.id))}/>比較に入れる</label>}
                </div>
              </> : <CandidatePhotos place={place} restaurantId={restaurantId}/>}
              {hasHighlights && <RestaurantHighlights id={restaurantId}/>}
              {!hasHighlights && candidateNotes[restaurantId] && <p className="hint">{candidateNotes[restaurantId]}</p>}
              {place.kind === '食事' && <details className="order-memo"><summary>予約する</summary><ReservationLinks place={place} id={restaurantId}/></details>}
              <div className="row"><Link href={mapSearch(mapValue(place.id))}>地図</Link><button onClick={() => route('', place.id)}>経路</button>{!bathInfo[place.id]?.closed && <button onClick={() => addVisit(place.id)}>{dayLabel(day)}に追加</button>}</div>
              {place.kind === '食事' && <details className="order-memo">
                <summary>注文メモ</summary>
                <div className="fields">
                  <label>食べたい一品<input value={place.dish ?? ''} onChange={e => update({ dish: e.target.value })}/></label>
                  <label>一緒に頼みたいワイン<input value={place.orderWine ?? ''} onChange={e => update({ orderWine: e.target.value })}/></label>
                  <label>店員さんに聞くこと<textarea value={place.orderQuestion ?? ''} onChange={e => update({ orderQuestion: e.target.value })}/></label>
                </div>
                <div className="row">
                  <button onClick={() => openOrderPhrases('おすすめ料理')}>おすすめ料理の英会話</button>
                  <button onClick={() => openOrderPhrases('ワイン')}>ワインの英会話</button>
                </div>
              </details>}
              <details><summary>詳細・並べ替え</summary><div className="fields">
                <label>表示名<input value={placeDisplayName(place.name)} onChange={e => update({ name: e.target.value })}/></label>
                <label>地図の検索語（現地表記）<input value={place.map} onChange={e => update({ map: e.target.value })}/></label>
                {place.kind !== '観光' && <>
                  <label>公式サイトURL<input type="url" value={place.site ?? ''} onChange={e => update({ site: e.target.value })}/></label>
                  <label>予約URL<input type="url" value={place.booking ?? ''} onChange={e => update({ booking: e.target.value })}/></label>
                </>}
                <label>メモ<textarea value={place.note ?? ''} onChange={e => update({ note: e.target.value })}/></label>
              </div><div className="row"><Order index={index} length={visible.length} move={delta => {
                const reordered = moveItem(visible, index, delta)
                let cursor = 0
                setList(list.map(item => item.kind === kind ? reordered[cursor++] : item))
              }}/><button onClick={() => {
                if (Object.values(schedule).some(visits => visits.some(item => item.placeId === place.id))) {
                  if (!confirm('この候補と、各日の旅程にある同じ訪問先を削除しますか？')) return
                  setSchedule(Object.fromEntries(Object.entries(schedule).map(([date, visits]) => [date, visits.filter(item => item.placeId !== place.id)])))
                }
                setList(list.filter(item => item.id !== place.id))
                setBathFavorites(current => current.filter(id => id !== place.id))
                setBathSelection(current => current.filter(id => id !== place.id))
                if (origin === place.id) setOrigin('')
                if (destination === place.id) setDestination(hotelId)
              }}>候補を削除</button></div></details>
              {place.kind !== '観光' && <div className="row">{externalUrl(place.site) ? <Link href={externalUrl(place.site)!}>公式サイト</Link> : <small>公式サイト未登録</small>}{!hasHighlights && restaurantMenus[restaurantId] && <Link href={restaurantMenus[restaurantId]}>{place.id === 'r4' ? '過去のメニュー' : '公式メニュー'}</Link>}{place.kind === '温泉' && externalUrl(place.booking) && <Link href={externalUrl(place.booking)!}>予約</Link>}</div>}
            </article>
          })}
          <form className="row" onSubmit={e => {
            e.preventDefault()
            const name = newName.trim()
            if (!name) return
            setList([...list, { id: crypto.randomUUID(), kind, name, map: name + ', Budapest' }])
            setNewName('')
          }}><label>{kind === '食事' ? '店舗名' : kind === '温泉' ? '温泉名' : '観光地名'}<input required value={newName} onChange={e => setNewName(e.target.value)}/></label><button className="primary" disabled={!newName.trim()}>候補を追加</button></form>
        </section></>}
      </>}
      {tab === 'ツール' && <><h1>旅行ツール</h1><Tools tool={tool} setTool={value => { setPhraseTopic('すべて'); setTool(value) }} phraseTopic={phraseTopic}/></>}
    </main>
    {transferQuick && <TransferQuickView close={() => setTransferQuick(false)} fullGuide={openFlightGuide}/>}
    <nav className="dock" aria-label="メインメニュー"><div className="wrap dock-inner">{(Object.keys(glyphs) as Tab[]).map(page => <button key={page} aria-current={tab === page ? 'page' : undefined} onClick={() => go(page)}><span aria-hidden="true">{glyphs[page]}</span>{page}</button>)}</div></nav>
  </>
}
createRoot(document.getElementById('root')!).render(<App/>)
