import { useEffect, useRef, useState, type ReactNode } from 'react'
import { bathCheckedOn, bathInfo, type BathInfo } from './bath-info'
import galleryCredits from './bath-photo-credits.json'
import type { Place } from './data'
import { fetchExchangeRate, useExchangeRate } from './exchange-rate'
import { externalUrl, mapSearch } from './maps'
import { Link } from './shared'

const images = import.meta.glob<string>('./assets/baths/*.jpg', { eager: true, query: '?url', import: 'default' })
const credits: Record<string, { source: string; author: string; license: string; licenseUrl: string }> = galleryCredits
const entries: Record<string, [string, string][]> = {
  s12: [
    ['sz-flow', '円形の流れる浴槽がある屋外プール'],
    ['sz-steam', '冬の夜、屋外浴槽に上がる湯気（2009年2月撮影）'],
    ['sz-in', '柱とアーチに囲まれた屋内浴槽'],
    ['sz-out', '黄色い建物に囲まれた大きな屋外浴場'],
    ['sz-in3', '高窓から光が入る屋内の温泉浴槽'],
  ],
  s13: [
    ['ru-classic', '八角形のトルコ浴槽とドーム（歴史写真）'],
    ['ru-roof-day', 'ドナウ川に面した屋上のパノラマ浴槽'],
    ['ru-swim', 'アーチに囲まれた屋内水泳プール'],
    ['ru-well', '屋内ウェルネスエリアの32℃浴槽'],
    ['ru-roof', '夜の屋上浴場と対岸の街明かり'],
    ['ru-hot', '屋内ウェルネスエリアの42℃浴槽'],
  ],
  'bath-lukacs': [
    ['lu-icon', '黄色い建物に囲まれた屋外の水泳プール'],
    ['lu-thermal', '屋内の36℃温泉浴槽（撮影時）'],
    ['lu-well', '屋内のウェルネス浴槽'],
    ['lu-swim', '湯気に包まれた屋外の水泳プール'],
    ['lu-cold', '小さな水風呂（撮影時20℃）'],
    ['lu-in2', '手すりの付いた屋内の治療用浴槽'],
  ],
  'bath-gellert': [
    ['ge-out', '柱廊と装飾窓が見える屋内大プール（休業前）'],
    ['ge-tiles', '装飾タイルと柱に囲まれた温泉浴槽（休業前）'],
    ['ge-thermal', 'ガラス屋根がかかる大きな屋内プール（休業前）'],
    ['ge-mosaictub', '装飾のある別の屋内浴槽（休業前）'],
    ['ge-mosaic', '屋外プールとテラス（休業前）'],
  ],
  'bath-veli': [['ve-dome', 'ガラス張りの通路から見えるトルコ浴場のドーム（外観）']],
  'bath-dandar': [['dd-archive', '高い窓と浴槽が見える屋内浴場（歴史写真）']],
  'bath-paskal': [['ps-icon', '屋外プールを含む施設全体の空撮']],
  'bath-palatinus': [['pa-icon', 'マルギット島の屋外プール（撮影時）']],
  'bath-csillaghegy': [['cs-icon2', '緑に囲まれた屋外プール（撮影時）']],
}

function photos(id: string) {
  return (entries[id] ?? []).flatMap(([key, caption]) => {
    const url = images[`./assets/baths/${key}.jpg`]
    const credit = credits[key]
    return url && credit ? [{ url, caption, credit }] : []
  })
}
type Photo = ReturnType<typeof photos>[number]

function Credit({ photo }: { photo: Photo }) {
  return <small className="bath-credit"><a href={photo.credit.source} target="_blank" rel="noopener noreferrer">{photo.credit.author || '写真の出典'}</a>
    {' · '}{photo.credit.licenseUrl ? <a href={photo.credit.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.credit.license}</a> : photo.credit.license}
    {' · 縮小・圧縮'}</small>
}
export function BathCover({ place, open }: { place: Place; open: () => void }) {
  const cover = photos(place.id)[0]
  const info = bathInfo[place.id]
  return <>
    {cover ? <><button className={place.id === 's13' ? 'bath-cover bath-cover-historic' : 'bath-cover'} onClick={open} aria-label={place.name + 'の写真を拡大'}>
      <img src={cover.url} alt={cover.caption} loading="lazy" decoding="async"/>
    </button>{place.id !== 's12' && <small className="bath-cover-caption">{cover.caption}</small>}<Credit photo={cover}/></> : <div className="bath-photo-empty">浴槽写真未登録</div>}
    {info?.visitStatus && info.closed && <p className="bath-closed">{info.visitStatus}</p>}
  </>
}

function Gallery({ place, zoom }: { place: Place; zoom: boolean }) {
  const items = photos(place.id)
  const [index, setIndex] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const start = useRef<{ x: number; y: number } | null>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  useEffect(() => { if (zoom && !dialog.current?.open) dialog.current?.showModal() }, [zoom])
  function advance(delta: number) {
    setIndex(current => (current + delta + items.length) % items.length)
  }
  if (!items.length) return <p className="bath-photo-empty">浴槽写真未登録</p>
  const current = items[index]
  return <>
    <div className="bath-thumbnails">{items.map((photo, i) => <figure key={photo.url}>
      <button className="bath-cover" onClick={e => { setIndex(i); trigger.current = e.currentTarget; dialog.current?.showModal() }} aria-label={photo.caption + 'を拡大'}>
        <img src={photo.url} alt={photo.caption} loading="lazy" decoding="async"/>
      </button>
      <figcaption>{photo.caption}<Credit photo={photo}/></figcaption>
    </figure>)}</div>
    <dialog ref={dialog} className="bath-dialog" aria-label={place.name + 'の拡大写真'} onClose={() => trigger.current?.focus()} onKeyDown={e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); advance(e.key === 'ArrowLeft' ? -1 : 1) }
    }}>
      <div className="row bath-dialog-top"><button onClick={() => dialog.current?.close()} autoFocus>閉じる</button></div>
      <figure>
        <img src={current.url} alt={current.caption} draggable={false} onTouchStart={e => {
          const touch = e.touches[0]
          start.current = e.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null
        }} onTouchCancel={() => { start.current = null }} onTouchEnd={e => {
          if (!start.current) return
          const { clientX, clientY } = e.changedTouches[0]
          const dx = clientX - start.current.x
          const dy = clientY - start.current.y
          start.current = null
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) advance(dx < 0 ? 1 : -1)
        }}/>
        <figcaption aria-live="polite">{current.caption} · {index + 1} / {items.length}<Credit photo={current}/></figcaption>
      </figure>
      {items.length > 1 && <div className="row bath-dialog-nav"><button onClick={() => advance(-1)}>← 前の写真</button><button onClick={() => advance(1)}>次の写真 →</button></div>}
    </dialog>
  </>
}

const amount = new Intl.NumberFormat('ja-JP')
function priceLabel(info: BathInfo, rate?: number): ReactNode {
  if (!info.price) return info.closed ? '休業中' : '未確認'
  const { min, max, label, url } = info.price
  const range = (lower: number, upper: number) => lower === upper ? amount.format(lower) : `${amount.format(lower)}〜${amount.format(upper)}`
  return <><a href={url} target="_blank" rel="noopener noreferrer">{range(min, max)} HUF</a>
    {rate ? <span>（約 {range(Math.round(min * rate), Math.round(max * rate))} 円）</span> : <span>（円換算はレート未設定）</span>}
    <small className="bath-credit">{label}</small></>
}

function facts(info: BathInfo, rate?: number): [string, ReactNode][] {
  return [
    ['屋内浴槽', info.indoor], ['屋外浴槽', info.outdoor],
    ['浴槽の特徴', info.features], ['雰囲気', info.atmosphere], ['料金', priceLabel(info, rate)],
    ['営業時間', <a href={info.hoursUrl} target="_blank" rel="noopener noreferrer">{info.hours}</a>],
    ['男女別・混浴', info.access],
    ['水着', info.rulesUrl ? <a href={info.rulesUrl} target="_blank" rel="noopener noreferrer">{info.wear}</a> : info.wear],
    ['2027年2月', info.visitStatus ?? '未確認'],
  ]
}

function useBathRate() {
  const { rate, setSaved } = useExchangeRate()
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState('')
  async function load() {
    setPending(true)
    setStatus('')
    try {
      setSaved(await fetchExchangeRate())
    } catch {
      setStatus('円換算レートを取得できませんでした。')
    } finally {
      setPending(false)
    }
  }
  return { rate, load, pending, status }
}

function RateNote({ open, exchange, showRate }: { open: () => void; exchange: ReturnType<typeof useBathRate>; showRate: boolean }) {
  const { rate, load, pending, status } = exchange
  const rateLabel = rate?.date ? ` · 換算レート基準日 ${rate.date}` : rate ? ' · 手動設定レート' : ''
  return <div className="row">
    <small>公式情報の確認日　{bathCheckedOn}{showRate ? rateLabel : ''}</small>
    {showRate && !rate && <button onClick={load} disabled={pending}>{pending ? '取得中…' : '円換算レートを取得'}</button>}
    {showRate && <button onClick={open}>通貨換算を開く</button>}
    {status && <small role="status">{status}</small>}
  </div>
}

export function BathDetails({ place, zoom, back, children, currency }: { place: Place; zoom: boolean; back: () => void; children: ReactNode; currency: () => void }) {
  const exchange = useBathRate()
  const { rate } = exchange
  const info = bathInfo[place.id]
  return <section className="card bath-detail" aria-labelledby="bath-detail-title">
    <button onClick={back}>← 温泉一覧</button>
    <h2 id="bath-detail-title">{place.name}</h2>
    {info && <p className="hint" lang="en">{info.english}</p>}
    {info?.closed && <p className="bath-closed">{info.visitStatus}</p>}
    <Gallery key={place.id} place={place} zoom={zoom}/>
    {info?.galleryUrl && <div className="row"><Link href={info.galleryUrl}>外部の浴場写真を見る</Link></div>}
    {info ? <>
      <dl className="bath-facts">{facts(info,rate?.value).map(([name,value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>
      <RateNote open={currency} exchange={exchange} showRate={!!info.price}/>
    </> : <p className="hint">設備・料金・営業時間は未確認です。</p>}
    {children}
    <div className="row">{externalUrl(place.site) && <Link href={externalUrl(place.site)!}>公式サイト</Link>}<Link href={mapSearch(place.map || place.name + ', Budapest')}>Google マップ</Link></div>
  </section>
}

export function BathComparison({ places, close, currency }: { places: Place[]; close: () => void; currency: () => void }) {
  const exchange = useBathRate()
  const { rate } = exchange
  const available = places.flatMap(place => {
    const info = bathInfo[place.id]
    return info ? [{ place, info, rows: facts(info, rate?.value) }] : []
  })
  if (available.length < 2) return null
  return <section className="card" aria-labelledby="bath-compare-title">
    <h2 id="bath-compare-title">温泉を比較</h2>
    <p className="hint">表は横にスクロールできます。</p>
    <div className="bath-table" tabIndex={0} aria-label="温泉比較表。横にスクロールできます。">
      <table><thead><tr><th scope="col">項目</th>{available.map(({place,info}) => <th scope="col" key={place.id}>{place.name}<small lang="en">{info.english}</small></th>)}</tr></thead>
        <tbody>{available[0].rows.map(([name], i) => <tr key={name}><th scope="row">{name}</th>{available.map(({place,rows}) => <td key={place.id}>{rows[i][1]}</td>)}</tr>)}
          <tr><th scope="row">リンク</th>{available.map(({place}) => <td key={place.id}>{externalUrl(place.site) && <a href={externalUrl(place.site)} target="_blank" rel="noopener noreferrer">公式サイト</a>}<br/><a href={mapSearch(place.map || place.name + ', Budapest')} target="_blank" rel="noopener noreferrer">Google マップ</a></td>)}</tr>
        </tbody>
      </table>
    </div>
    <RateNote open={currency} exchange={exchange} showRate={available.some(({ info }) => !!info.price)}/>
    <div className="row"><button onClick={close}>比較を閉じる</button></div>
  </section>
}
