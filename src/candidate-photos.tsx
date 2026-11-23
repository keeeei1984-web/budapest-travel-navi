import type { Place } from './data'
import photoCredits from './candidate-photo-credits.json'

const images = import.meta.glob<string>('./assets/places/*.jpg', { eager: true, query: '?url', import: 'default' })
const credits: Record<string, { source: string; author: string; license: string; licenseUrl: string }> = photoCredits
const photoCaptions: Record<string, string> = {
  s5: 'ドナウ川沿いの遊歩道',
  s7: '英雄広場のミレニアム記念碑',
  s10: 'ユダヤ人街のドハーニ街シナゴーグ',
  s11: '市民公園の風景',
  r6: 'メンザの店内',
  r7: 'レトロ・ラーンゴシュの過去の写真（2015年）',
  'bath-csillaghegy': '施設の過去の写真（2017年）',
}
const dishPhotos: Record<string, string> = {
  'マンガリッツァ豚': 'mangalica',
  'フォアグラ': 'foie-gras',
  'チキンパプリカ': 'paprikash',
  'ランゴシュ': 'langos',
}

export const candidateNotes: Record<string, string> = {
  r0: '公式メニューの例　マンガリッツァ豚のポークチョップ。',
  r1: '店の公式案内では、マンガリッツァ豚のハムや赤ワイン仕立ての料理を紹介しています。',
  r2: '公式メニューの例　ハンガリー風フォアグラ。',
  r3: '公式メニューの例　焼きリンゴとトカイワインソースを添えたフォアグラのグリル。',
  r4: '公式サイトに掲載されている過去のメニューには、フォアグラのフライとマッシュポテトがあります。',
  r5: '公式メニューの例　ハンガリー風卵麺を添えたチキンパプリカ。',
  r6: '公式メニューの例　自家製シュペッツレを添えたチキンパプリカ。',
  r7: '公式メニューの例　サワークリームとチーズのラーンゴシュ。',
  s12: '市民公園にある温泉。黄色い建物に囲まれた屋外プールが目印です。',
  s13: 'ブダ側のドナウ川沿い。オスマン時代の浴場と屋上プールがあります。浴場ごとの入場条件は公式サイトへ。',
  'bath-lukacs': 'ブダ側にある歴史ある温泉。温泉浴槽と屋外の水泳プールがあります。',
  'bath-dandar': 'ペスト側のフェレンツヴァーロシュ地区にある温泉。屋内と屋外に温泉浴槽があります。',
  'bath-palatinus': 'ドナウ川のマルギット島にある温浴施設。冬季に使えるプールは公式サイトで確認できます。',
  'bath-paskal': 'ペスト側のズグロー地区にある温泉。屋内と屋外にプールがあります。',
  'bath-csillaghegy': 'ブダ側北部の温浴施設。屋内の温浴施設と季節営業の屋外エリアがあります。',
}

export const restaurantMenus: Record<string, string> = {
  r0: 'https://kispiacbudapest.hu/menu/',
  r1: 'https://www.negromangalica.hu/en/menu',
  r2: 'https://www.paprikavendeglo.hu/en/menu/',
  r3: 'https://kiskakukk.hu/en/menu',
  r4: 'https://rosenstein.hu/wp-content/uploads/rosenstein_etlap_A4_2024_02_web.pdf',
  r5: 'https://gettogulyas.hu/en/menu/',
  r6: 'https://www.menzaetterem.hu/en/food/',
  r7: 'https://retrolangos.hu/en/menu/',
}

export const restaurantGalleries: Record<string, string> = {
  r3: 'https://www.kiskakukk.hu/hu/galeria',
  r5: 'https://www.flickr.com/photos/wallyg/55231512438/',
}

function Photo({ id, caption }: { id: string; caption: string }) {
  const url = images[`./assets/places/${id}.jpg`]
  const credit = credits[id]
  if (!url || !credit) return null
  return <figure className="candidate-photo">
    <img src={url} alt={caption} loading="lazy" decoding="async"/>
    <figcaption>{caption}<small>
      <a href={credit.source} target="_blank" rel="noopener noreferrer">{credit.author || '写真の出典'}</a>
      {' · '}{credit.licenseUrl ? <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer">{credit.license}</a> : credit.license}
      {' · 縮小・表示時にトリミング'}
    </small></figcaption>
  </figure>
}

export function CandidatePhotos({ place }: { place: Place }) {
  const dishId = place.dish && dishPhotos[place.dish]
  return <>
    <Photo id={place.id} caption={photoCaptions[place.id] || place.name}/>
    {dishId && <Photo id={dishId} caption={`${place.dish}の一例（参考写真）`}/>}
    {place.dish && <p className="hint">食べたい料理　{place.dish}。提供状況はお店でご確認ください。</p>}
  </>
}
