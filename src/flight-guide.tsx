import { useEffect, useRef, useState } from 'react'
import { flightAudio } from './flight-audio'
import { baggageChecks, flightPhrases, flightSchedule, transfers, type Flight } from './flight-guide-data'
import { Link, useSaved } from './shared'

type Airport = keyof typeof transfers
const airports: Airport[] = ['munich', 'frankfurt']

export function FlightGuide() {
  const [airport, setAirport] = useSaved<Airport>('flight-airport', 'munich')
  const [checked, setChecked] = useSaved<string[]>('flight-checks', [])
  const transfer = transfers[airport]
  const nextStep = transfer.steps.findIndex((_, i) => !checked.includes(`${airport}-${i}`))
  const guide = useRef<HTMLElement>(null)

  function toggle(id: string) {
    setChecked(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id])
  }

  function openTransfer(next: Airport) {
    setAirport(next)
    guide.current?.scrollIntoView({ block: 'start' })
    guide.current?.focus({ preventScroll: true })
  }

  return <div className="flight-guide">
    <section className="card">
      <h2>フライト・空港乗り継ぎガイド</h2>
      <p className="hint">2027年2月 · 時刻はすべて各空港の現地時刻です。予定は搭乗前に航空会社で確認してください。</p>
      <div className="row" aria-label="乗り継ぎ案内へ">
        {airports.map(key => <button className={key === 'munich' ? 'primary' : undefined} key={key} onClick={() => openTransfer(key)}>{transfers[key].label}の手順へ</button>)}
      </div>
    </section>
    <section className="card" ref={guide} tabIndex={-1} aria-labelledby="flight-transfer-heading">
      <h2 id="flight-transfer-heading">空港乗り継ぎ</h2>
      <div className="segments" role="group" aria-label="乗り継ぎ空港">
        {airports.map(key => <button key={key} aria-pressed={airport === key} onClick={() => setAirport(key)}>{transfers[key].label}</button>)}
      </div>
      <p className="hint">{transfer.subtitle}</p>
      <p className="flight-duration">予定の乗り継ぎ時間 <strong>{transfer.duration}</strong></p>
      <p className="flight-alert">{airport === 'munich'
        ? '07:20頃のゲート到着は目標です。遅延・審査の混雑・ゲート変更で時間が足りなくなることがあります。間に合わなそうなときは、早めに係員へ搭乗券を見せてください。'
        : '出国審査と移動に時間がかかる場合があります。ゲート・経路・搭乗締切は当日の空港と運航会社の案内を優先してください。'}</p>
      <h3>乗り継ぎタイムライン</h3>
      <p className="hint">予定と行動の目安です。空港内の実際の所要時間は当日の状況によります。</p>
      <ol className="flight-timeline">{transfer.times.map(([time, text]) => <li key={time}><strong>{time}</strong><span>{text}</span></li>)}</ol>
      <h3>乗り継ぎ手順</h3>
      <p className="hint" role="status">{nextStep < 0 ? 'すべての手順を確認しました。' : `次の手順　STEP ${nextStep + 1}`}</p>
      <ol className="flight-steps">
        {transfer.steps.map(([title, text], i) => {
          const id = `${airport}-${i}`
          return <li key={id} aria-current={i === nextStep ? 'step' : undefined}>
            <h4><span>STEP {i + 1}</span> {title}</h4>
            <p>{text}</p>
            <label className="check"><input type="checkbox" checked={checked.includes(id)} onChange={() => toggle(id)}/>STEP {i + 1} を確認済みにする</label>
          </li>
        })}
      </ol>
      <h3>公式情報</h3>
      <div className="row">{transfer.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        <Link href="https://travel-europe.europa.eu/en/ees/faq">EU公式・EESの手続き</Link>
      </div>
      {airport === 'munich' && <div className="row"><Link href="https://4travel.jp/os_shisetsu/10264986/qa/87067">旅行者の体験談（参考）</Link></div>}
    </section>
    <section className="card">
      <h2>フライト一覧</h2>
      <p className="flight-alert">NH5861・NH5468はコードシェア便です。搭乗前に実際の運航会社と便名を確認してください。</p>
      <div className="flight-schedule">{flightSchedule.map(({ title, days }) => <div key={title}>
        <h3>{title}</h3>
        {days.map(({ date, flights }) => <div key={date} className="flight-day">
          <h4>{date}</h4>{flights.map(flight => <FlightCard key={flight.number} flight={flight}/>)}
        </div>)}
      </div>)}</div>
      <p className="hint">復路は羽田で入国・税関の手続きがあります。預け荷物の受け取りと国内線への預け直しについて、航空会社の案内を確認してください。</p>
    </section>
    <section className="card">
      <h2>出発前の手荷物チェック（往路）</h2>
      {baggageChecks.map(({ id, text }) => <label className="check flight-bag" key={id}>
        <input type="checkbox" checked={checked.includes(id)} onChange={() => toggle(id)}/>{text}
      </label>)}
    </section>
    <EmergencyPhrases/>
  </div>
}

function FlightCard({ flight }: { flight: Flight }) {
  return <article className="flight-leg" aria-label={flight.number}>
    <strong>{flight.number}</strong>{flight.codeshare && <small> · コードシェア</small>}
    <div className="flight-route">
      <div><span>{flight.from}</span><strong>{flight.departure}</strong></div>
      <span aria-hidden="true">→</span>
      <div><span>{flight.to}</span><strong>{flight.arrival}</strong>{flight.nextDay && <small>{flight.nextDay}</small>}</div>
    </div>
  </article>
}

function EmergencyPhrases() {
  const [notice, setNotice] = useState('')
  const [playing, setPlaying] = useState<string | null>(null)
  const player = useRef<HTMLAudioElement | null>(null)
  useEffect(() => () => { player.current?.pause(); player.current = null }, [])

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setNotice('英文をコピーしました。')
    } catch {
      setNotice('自動コピーができませんでした。英文を長押ししてコピーしてください。')
    }
  }

  function speak(text: string) {
    player.current?.pause()
    player.current = null
    setPlaying(null)
    setNotice('')
    if (playing === text) return
    const clip = flightAudio.get(text)
    if (!clip) return
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession
    if (session) {
      try { session.type = 'playback' } catch { /* Continue with the browser's audio settings. */ }
    }
    const audio = new Audio('data:audio/mpeg;base64,' + clip)
    player.current = audio
    setPlaying(text)
    const finish = (error = false) => {
      if (player.current !== audio) return
      player.current = null
      setPlaying(null)
      if (error) setNotice('音声を再生できませんでした。端末の音量を確認してください。')
    }
    audio.onended = () => finish()
    audio.onerror = () => finish(true)
    audio.play().catch(() => finish(true))
  }

  return <section className="card">
    <h2>緊急時の英会話</h2>
    <p className="hint" role="status">{notice || '英文はオフラインでも読み上げられます。'}</p>
    {flightPhrases.map(([ja, en]) => <article key={en} className="entry">
      <h3>{ja}</h3>
      <p className="foreign flight-english" lang="en">{en}</p>
      <div className="row"><button onClick={() => copy(en)}>英文をコピー</button><button onClick={() => speak(en)}>{playing === en ? '停止' : '読み上げ'}</button></div>
    </article>)}
  </section>
}

export function TransferQuickView({ close, fullGuide }: { close: () => void; fullGuide: () => void }) {
  const [airport, setAirport] = useSaved<Airport>('flight-airport', 'munich')
  const [checked, setChecked] = useSaved<string[]>('flight-checks', [])
  const dialog = useRef<HTMLDialogElement>(null)
  const transfer = transfers[airport]
  const next = transfer.steps.findIndex((_, i) => !checked.includes(`${airport}-${i}`))
  const flight = airport === 'munich' ? flightSchedule[0].days[1].flights[0] : flightSchedule[1].days[0].flights[1]

  useEffect(() => { dialog.current?.showModal() }, [])

  return <dialog ref={dialog} className="transfer-quick" aria-labelledby="transfer-quick-title" onClose={close}>
    <div className="row transfer-quick-top"><h2 id="transfer-quick-title">乗り継ぎ中</h2><button onClick={() => dialog.current?.close()} autoFocus>閉じる</button></div>
    <div className="segments" role="group" aria-label="乗り継ぎ空港">
      {airports.map(key => <button key={key} aria-pressed={key === airport} onClick={() => setAirport(key)}>{transfers[key].label}</button>)}
    </div>
    <p className="transfer-flight"><strong>{flight.departure}</strong> {flight.to}行き · {flight.number}</p>
    <p className="hint">出発予定は現地時刻です。搭乗口と締切は当日の掲示・搭乗券で確認してください。</p>
    <section className="card" aria-live="polite">
      <h3>次にすること</h3>
      {next < 0 ? <p>すべての手順を確認しました。搭乗口で最新の案内を確認してください。</p> : <>
        <p><strong>STEP {next + 1}　{transfer.steps[next][0]}</strong></p>
        <p>{transfer.steps[next][1]}</p>
        <button onClick={() => setChecked(current => [...new Set([...current, `${airport}-${next}`])])}>この手順を確認済みにする</button>
      </>}
    </section>
    <section className="card">
      <h3>係員に見せる英文</h3>
      <p className="transfer-english" lang="en">{airport === 'munich' ? "I'm connecting to Budapest." : "I'm connecting to Tokyo Haneda."}<br/>I have a short connection. Could you help me, please?</p>
      <p className="hint">乗り継ぎ時間が短いです。助けてもらえますか？</p>
    </section>
    <button onClick={() => { dialog.current?.close(); fullGuide() }}>空港乗り継ぎガイドを開く</button>
  </dialog>
}
