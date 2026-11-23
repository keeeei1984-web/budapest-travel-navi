import { placeDisplayName, type Place } from './data'
import { externalUrl, mapSearch } from './maps'
import { Link } from './shared'

type Channel = { label: string; href: string }
type Reservation = { note: string; channels: Channel[] }
const web = (label: string, href: string): Channel => ({ label, href })
const phone = (number: string): Channel => ({ label: '電話 ' + number, href: 'tel:' + number.replace(/\s/g, '') })
const email = (address: string): Channel => ({ label: 'メール', href: 'mailto:' + address })

const directory: Record<string, Reservation> = {
  r0: { note: '店の案内では WhatsApp または電話で受け付けています。', channels: [
    web('WhatsApp', 'https://wa.me/36304300142'), phone('+36 1 269 4231'), web('公式予約案内', 'https://kispiacbudapest.hu/reservation/'),
  ] },
  r1: { note: '公式サイトの予約ボタンから Bukio の予約画面が開きます。', channels: [
    web('ネット予約（Bukio）', 'https://www.bukio.hu/en/booking/negro-mangalica'), phone('+36 20 244 4733'),
  ] },
  r2: { note: '公式サイトは電話での予約を案内しています。', channels: [
    phone('+36 20 294 7944'), web('公式の連絡先', 'https://www.paprikavendeglo.hu/en/#elerhetoseg'),
  ] },
  r3: { note: '公式サイトから案内されている予約フォームです。', channels: [
    web('ネット予約（ReservOurs）', 'https://reservours.com/kiskakukk/tablereservation?s=website'), phone('+36 1 786 3439'),
  ] },
  r4: { note: '店はメールでの予約依頼を案内しています。店からの返信で確定を確認してください。', channels: [
    email('rosenstein@rosenstein.hu'), phone('+36 1 333 3492'), web('公式予約案内', 'https://rosenstein.hu/en/#elerhetosegunk'),
  ] },
  r5: { note: '公式サイトから案内されている予約フォームです。', channels: [
    web('ネット予約（ReservOurs）', 'https://reservours.com/gettogulyas/tablereservation?source=googlewebhely'), phone('+36 20 376 4480'),
  ] },
  r6: { note: '1〜4名はオンライン、5〜20名は公式予約ページのメール窓口で問い合わせできます。', channels: [
    web('公式予約ページ', 'https://www.menzaetterem.hu/en/reservation/'), email('info@menzaetterem.hu'),
  ] },
  r7: { note: '国会議事堂近くのヴェーチェイ通り3番地店です。12名までオンライン、13名以上は店舗に問い合わせ。', channels: [
    web('ヴェーチェイ通り店を予約', 'https://retrolangos.hu/en/table-reservation/'), email('v3@retrolangos.hu'), phone('+36 30 110 7000'),
  ] },
  r8: { note: 'フローリアーン広場の店舗について、公式の予約窓口は確認できませんでした。', channels: [] },
  r9: { note: '公式サイト掲載の電話・メールで、希望日時と人数を伝えて空席を確認できます。', channels: [
    phone('+36 1 318 3943'), email('commechezsoi@gmail.hu'), web('公式の連絡先', 'https://commechezsoi.hu/#contact'),
  ] },
  r10: { note: '公式予約ページにオンライン予約と電話の案内があります。希望日・時刻・人数を用意してください。', channels: [
    web('公式予約ページ', 'https://www.szazevesetterem.hu/eng/contact/'), phone('+36 1 230 0329'), email('szazeves@szazevesetterem.hu'),
  ] },
}
const priorBooking: Partial<Record<string, string>> = {
  r0: 'https://kispiacbudapest.hu/reservation/',
  r1: 'https://www.negromangalica.hu/en/contact',
  r3: 'https://kiskakukk.hu/en',
  r4: 'https://rosenstein.hu/en/',
  r5: 'https://gettogulyas.hu/en/contact/',
  r6: 'https://www.menzaetterem.hu/en/reservation/',
  r7: 'https://retrolangos.hu/en/table-reservation/',
}

const tripadvisorPages: Partial<Record<string, string>> = {
  r0: '3645242-Reviews-Kispiac_Bisztro',
  r1: '26609385-Reviews-Negro_Mangalica',
  r2: '26552930-Reviews-Paprika_Vendeglo',
  r3: '782615-Reviews-Kiskakukk_Etterem',
  r4: '692912-Reviews-Rosenstein_Vendeglo',
  r5: '9856765-Reviews-Getto_Gulyas',
  r6: '696068-Reviews-Menza_Restaurant_and_Cafe',
  r7: '33046462-Reviews-Retro_Langos_Budapest_Vecsey',
  r8: '13835287-Reviews-Langos_Florian_Square_Underpass',
  r9: '794237-Reviews-Comme_Chez_Soi',
  r10: '1382947-Reviews-Szazeves_Etterem',
}

export function tripadvisorRestaurantUrl(id: string): string | undefined {
  const page = tripadvisorPages[id]
  return page && `https://www.tripadvisor.jp/Restaurant_Review-g274887-d${page}-Budapest_Central_Hungary.html`
}

export function ReservationLinks({ place, id = place.id }: { place: Place; id?: string }) {
  const guide = directory[id]
  const tripadvisor = tripadvisorRestaurantUrl(id)
  const custom = externalUrl(place.booking)
  const channels = custom && custom !== externalUrl(priorBooking[id])
    ? [{ label: '保存した予約URL', href: custom }, ...(guide?.channels.filter(item => item.href !== custom) ?? [])]
    : guide?.channels ?? []
  return <>
    <p className="hint">{guide?.note ?? (custom ? '保存済みの予約ページを開けます。' : '予約窓口は未登録です。')}</p>
    <div className="row">{channels.length ? channels.map(({label, href}) =>
      href.startsWith('https:') || href.startsWith('http:')
        ? <Link key={href} href={href}>{label}</Link>
        : <a key={href} className="button" href={href}>{label}</a>)
      : <Link href={mapSearch(place.map || place.name + ', Budapest')}>店舗情報を見る</Link>}
      {tripadvisor && <Link href={tripadvisor}>Tripadvisorで店舗情報を見る</Link>}
    </div>
  </>
}

export function ReservationDirectory({ places, identify }: { places: Place[]; identify: (place: Place) => string }) {
  return <details className="card restaurant-bookings">
    <summary>レストランの予約先一覧</summary>
    <p className="hint">Tripadvisorの店舗ページに「予約する」が表示される場合は、そこから空席を確認できます。表示が見当たらない場合は、各店の公式予約先をご利用ください。</p>
    <div className="row"><Link href="https://www.tripadvisor.com/Restaurants-g274887-zfp10602-Budapest_Central_Hungary.html">Tripadvisorで予約対応の店を探す</Link></div>
    {places.map(place => <div key={place.id} className="entry">
      <h3>{placeDisplayName(place.name)}</h3><ReservationLinks place={place} id={identify(place)}/>
    </div>)}
  </details>
}
