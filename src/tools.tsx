import { useRef, useState } from 'react'
import { packing, phrases } from './data'
import { directions } from './maps'
import { Link, useSaved } from './shared'

const airport = 'Budapest Ferenc Liszt International Airport'
const tools = ['交通・空港', '会話集', '通貨換算', '持ち物']
export function Tools({ tool, setTool }: { tool: string; setTool: (tool: string) => void }) {
  return <>
    <div className="segments tool-tabs">{tools.map(item => <button key={item} aria-pressed={item === tool} onClick={() => setTool(item)}>{item}</button>)}</div>
    {tool === '交通・空港' && <Transit/>}
    {tool === '会話集' && <Phrasebook/>}
    {tool === '通貨換算' && <Currency/>}
    {tool === '持ち物' && <Packing/>}
    <details className="card"><summary>iPhoneのホーム画面に追加</summary><ol><li>公開URLをSafariで開く。</li><li>共有ボタンから「ホーム画面に追加」を選び、「追加」をタップ。</li><li>ホーム画面のアイコンからオンラインで一度起動し、「オフライン準備済み」を確認。</li></ol><p className="hint">会話集・旅程などはオフラインで閲覧できます。Google マップや外部サイト、最新レートの取得には通信が必要です。</p></details>
  </>
}
function Transit() {
  return <>
    <section className="card"><h2>地下鉄・トラム・バス</h2>
      <p>Google マップや ブダペストゴー で路線、行き先、乗り場を確認します。地下鉄では改札付近、トラム・バスでは乗車時に、券種に応じて有効化します。前扉乗車の案内があるバスでは運転手に有効な乗車券を提示します。</p>
      <h3>券種と購入</h3><p>1回券、時間制券、トラベルカードなどがあります。1回券は原則として乗り換えごとに必要です。地下鉄間の乗り換えなどの例外や利用範囲は BKK で確認してください。</p>
      <ol><li>券売機では画面の言語と券種・枚数を選び、画面に表示される方法で支払い、紙券を受け取ります。</li><li>ブダペストゴー ではアカウント登録後、券種を選び、利用者情報が求められた場合は入力し、アプリの案内に沿って支払います。</li></ol>
      <h3>有効化と検札</h3><p>紙の1回券は地下鉄の入口付近または車内の刻印機で有効化します。アプリの乗車券は券種と画面の案内に従い、QRコードのスキャン等で有効化し、必要な場面でアニメーションや検札画面を提示します。検札に備えて使用済みの紙券も移動の終了まで保管してください。</p>
      <div className="row"><Link href="https://bkk.hu/en/tickets-and-passes/prices/">券種・最新料金（BKK）</Link><Link href="https://bkk.hu/en/tickets-and-passes/budapestgo/">ブダペストゴー</Link><Link href="https://bkk.hu/en/timetables/I/">時刻表（BKK）</Link></div>
    </section>
    <section className="card"><h2>空港アクセス · 100E</h2><p>空港バス100Eは空港と市中心部のデアーク・フェレンツ広場 を結ぶ路線です。通常の市内用乗車券とは利用条件が異なります。専用券は ブダペストゴー や券売機で購入できます。乗車時は紙券を有効化し、アプリ券は画面の案内に従って提示します。車内の ブダペスト・ペイ＆ゴー を使える場合もあります。券の適用条件、乗り場、停車駅、発車時刻は利用前にBKK公式案内で確認してください。</p>
    <div className="row"><Link href="https://bkk.hu/en/travel-information/airport-express/">100E公式案内</Link><Link href="https://www.bud.hu/en">空港公式サイト</Link><Link href={directions(airport, 'transit')}>現在地から空港へ</Link><Link href={directions('Deák Ferenc tér, Budapest', 'transit', airport)}>空港から市中心部へ</Link></div></section>
  </>
}

function Phrasebook() {
  const [group, setGroup] = useState('すべて')
  const [favorites, setFavorites] = useSaved<number[]>('favorites', [])
  const [active, setActive] = useState<number | null>(null)
  const [audioMessage, setAudioMessage] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)
  const lastButton = useRef<HTMLButtonElement>(null)
  const groups = ['すべて', ...new Set(phrases.map(p => p[0])), 'お気に入り']
  function speak(text: string) {
    if (!('speechSynthesis' in window)) { setAudioMessage('この端末では読み上げを利用できません。'); return }
    setAudioMessage('')
    speechSynthesis.cancel()
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = 'en-US'
    speech.onerror = event => {
      if (!['interrupted', 'canceled'].includes(event.error)) setAudioMessage('音声を再生できませんでした。端末の音声設定を確認してください。')
    }
    speechSynthesis.speak(speech)
  }
  const matches = phrases.map((phrase, i) => ({ phrase, i })).filter(({ phrase, i }) => group === 'すべて' || group === phrase[0] || (group === 'お気に入り' && favorites.includes(i)))
  return <section className="card"><h2>旅行会話集</h2>
    <label>場面<select value={group} onChange={e => setGroup(e.target.value)}>{groups.map(item => <option key={item}>{item}</option>)}</select></label>
    <p role="status" className="hint">{audioMessage || '英文は端末の音声で読み上げられます。'}</p>
    {!matches.length && <p>お気に入りはまだありません。</p>}
    {matches.map(({ phrase: [category, ja, text, kana], i }) => <article key={i} className="entry">
      <small className="accent">{category}</small><h3>{ja}</h3><p className="foreign" lang={category === 'ハンガリー語' ? 'hu' : 'en'}>{text}</p><p className="hint">{kana}</p>
      <div className="row">{category !== 'ハンガリー語' && <button onClick={() => speak(text)}>読み上げ</button>}<button onClick={e => { lastButton.current = e.currentTarget; setActive(i); dialog.current?.showModal() }}>全画面表示</button>
      <button aria-pressed={favorites.includes(i)} onClick={() => setFavorites(favorites.includes(i) ? favorites.filter(item => item !== i) : [...favorites, i])}>{favorites.includes(i) ? '★ お気に入り' : '☆ お気に入り'}</button></div>
    </article>)}
    <dialog ref={dialog} onClose={() => { setActive(null); lastButton.current?.focus() }} aria-labelledby="phrase-display">
      {active !== null && <div className="phrase-display"><button onClick={() => dialog.current?.close()} autoFocus>閉じる</button><p id="phrase-display" lang={phrases[active][0] === 'ハンガリー語' ? 'hu' : 'en'}>{phrases[active][2]}</p><small>{phrases[active][1]}</small></div>}
    </dialog>
  </section>
}

type Rate = { value: number; date: string; updated: string; source: 'Frankfurter / ECB' | '手動' }
const isPositive = (value: number) => Number.isFinite(value) && value > 0
function Currency() {
  const [saved, setSaved] = useSaved<Rate | null>('rate-online', null)
  const [manual, setManual] = useSaved<Rate | null>('rate-manual', null)
  const [preferManual, setPreferManual] = useSaved('rate-use-manual', false)
  const [manualInput, setManualInput] = useState(manual ? String(manual.value) : '')
  const [amount, setAmount] = useState('1000')
  const [from, setFrom] = useState<'HUF' | 'JPY'>('HUF')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const rate = preferManual ? manual ?? saved : saved ?? manual
  const to = from === 'HUF' ? 'JPY' : 'HUF'
  const result = rate && amount.trim() && Number(amount) >= 0 ? Number(amount) * (from === 'HUF' ? rate.value : 1 / rate.value) : null

  async function refresh() {
    setLoading(true)
    setStatus('取得中…')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    try {
      const response = await fetch('https://api.frankfurter.dev/v1/latest?base=HUF&symbols=JPY', { signal: controller.signal, cache: 'no-store' })
      if (!response.ok) throw new Error('rate request')
      const data = await response.json()
      if (data.base !== 'HUF' || typeof data.rates?.JPY !== 'number' || !isPositive(data.rates.JPY) || typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error('rate data')
      setSaved({ value: data.rates.JPY, date: data.date, updated: new Date().toISOString(), source: 'Frankfurter / ECB' })
      setPreferManual(false)
      setStatus('レートを更新しました。')
    } catch {
      setStatus('取得できませんでした。保存済みレートがあれば引き続き使えます。')
    } finally {
      window.clearTimeout(timeout)
      setLoading(false)
    }
  }
  return <section className="card"><h2>通貨換算</h2>
    <div className="segments"><button aria-pressed={from === 'HUF'} onClick={() => setFrom('HUF')}>HUF → JPY</button><button aria-pressed={from === 'JPY'} onClick={() => setFrom('JPY')}>JPY → HUF</button></div>
    <label>金額（{from}）<input type="number" inputMode="decimal" min="0" step="any" value={amount} onChange={e => setAmount(e.target.value)}/></label>
    <output className="rate-output" aria-live="polite">{typeof result === 'number' && Number.isFinite(result) ? new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 2 }).format(result) + ' ' + to : '—'}</output>
    {rate ? <p className="hint">1 HUF = {rate.value} JPY · {rate.source}{rate.date && '（基準日 ' + rate.date + '）'}<br/>保存日時 {new Date(rate.updated).toLocaleString('ja-JP')}</p> : <p className="hint">レートを取得するか、手動で入力してください。</p>}
    <button className="primary" disabled={loading} onClick={refresh}>最新レートを取得</button>
    <p role="status" className="hint">{status}</p>
    <form className="row" onSubmit={e => {
      e.preventDefault()
      if (!isPositive(Number(manualInput))) return
      setManual({ value: Number(manualInput), date: '', updated: new Date().toISOString(), source: '手動' })
      setPreferManual(true)
      setStatus('手動レートを保存しました。')
    }}><label>手動レート（1 HUF あたりの JPY）<input type="number" required inputMode="decimal" step="any" value={manualInput} onChange={e => setManualInput(e.target.value)}/></label><button disabled={!isPositive(Number(manualInput))}>手動レートを使う</button></form>
    {saved && preferManual && <button onClick={() => { setPreferManual(false); setStatus('保存済みの取得レートに切り替えました。') }}>取得済みレートを使う</button>}
    <p className="hint">換算は目安です。決済や両替のレート・手数料は利用先で確認してください。</p>
  </section>
}
function Packing() {
  const [checked, setChecked] = useSaved<string[]>('packing', [])
  return <section className="card"><h2>持ち物チェックリスト</h2><p>{checked.length} / {packing.length} 件</p>{packing.map(item => <label key={item} className="check entry"><input type="checkbox" checked={checked.includes(item)} onChange={e => setChecked(e.target.checked ? [...checked, item] : checked.filter(value => value !== item))}/>{item}</label>)}</section>
}
