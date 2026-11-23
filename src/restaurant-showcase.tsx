import { restaurantMenus } from './candidate-photos'
import { Link } from './shared'
import { tripadvisorRestaurantUrl } from './restaurant-reservations'

type RestaurantShowcase = {
  trip?: string
  dishes: readonly string[]
  gallery?: string
  menuNote?: string
}

export const restaurantShowcases: Record<string, RestaurantShowcase> = {
  r1: {
    dishes: ['マンガリッツァ豚のハムと森のキノコ', '赤ワイン仕立てのマンガリッツァ豚料理'],
    gallery: 'https://www.negromangalica.hu/en/gallery',
    menuNote: '料理は店舗紹介に掲載された例です。',
  },
  r2: {
    trip: 'https://jp.trip.com/restaurant/hungary/budapest/detail/paprika-vendgl-13851246/',
    dishes: ['ハンガリー風フォアグラ', '冷製ガチョウのレバーコンフィと野菜', '牛ヒレ肉のシチュー'],
    gallery: 'https://www.paprikavendeglo.hu/en/gallery/',
  },
  r3: {
    trip: 'https://www.trip.com/restaurant/hungary/budapest/detail/kiskakukk-restaurant-17320281/',
    dishes: ['フォアグラのグリル（焼きリンゴとトカイワインソース）', 'ガチョウのレバーパテ（玉ねぎチャツネ添え）'],
    gallery: 'https://kiskakukk.hu/en/gallery',
  },
  r4: {
    trip: 'https://www.trip.com/restaurant/hungary/budapest/detail/rosenstein-vendeglo-17320245/',
    dishes: ['ガチョウのもも肉のロースト（煮込みキャベツ添え）', 'フォアグラのフライ（マッシュポテト添え）'],
    menuNote: '料理例は公式サイトの過去のメニューから。',
  },
  r5: {
    trip: 'https://us.trip.com/restaurant/hungary/budapest/detail/gett-gulys-31409448/',
    dishes: ['チキンパプリカ（ハンガリー風卵麺添え）', '鶏むね肉のフライ（パセリポテトとキャベツサラダ添え）'],
  },
  r9: {
    trip: 'https://my.trip.com/restaurant/hungary/budapest/detail/comme-chez-soi-17319786/',
    dishes: ['自家製パスタ', 'フォアグラ料理'],
    gallery: 'https://commechezsoi.hu/rolunk#galeria',
    menuNote: '料理例は店舗紹介と掲載レビューから。',
  },
  r10: {
    trip: 'https://us.trip.com/restaurant/hungary/budapest/detail/szazeves-etterem-17319758/',
    gallery: 'https://www.szazevesetterem.hu/eng/gallery/',
    dishes: ['グヤーシュスープ', 'チキンパプリカ（ガルシュカ添え）', 'ショムローイ・ガルシュカ（スポンジケーキのデザート）'],
    menuNote: '料理例は公開メニューから。',
  },
}

export function RestaurantHighlights({ id }: { id: string }) {
  const restaurant = restaurantShowcases[id]
  const reviewUrl = tripadvisorRestaurantUrl(id)
  return <section className="restaurant-highlights" aria-label="店の写真・名物料理・メニュー">
    <div className="restaurant-dishes">
      <h4>おすすめの一皿</h4>
      <strong>{restaurant.dishes[0]}</strong>
      <ul>{restaurant.dishes.slice(1).map(dish => <li key={dish}>{dish}</li>)}</ul>
      <p className="hint">{restaurant.menuNote} 訪問日の提供状況はお店でご確認ください。</p>
    </div>
    <div className="row">
      <Link href={restaurantMenus[id]}>{id === 'r4' ? '公式サイト掲載の過去メニュー' : '公式メニュー'}</Link>
      {id === 'r4' && <Link href="https://rosenstein.hu/etlap/">公式メニュー案内（ハンガリー語）</Link>}
    </div>
    <div className="row">
      {restaurant.trip && <Link href={restaurant.trip}>Trip.comの写真</Link>}
      {reviewUrl && <Link href={reviewUrl}>Tripadvisorの写真</Link>}
      {restaurant.gallery && <Link href={restaurant.gallery}>公式ギャラリー</Link>}
      {id === 'r2' && <Link href="https://www.paprikavendeglo.hu/en/">公式サイトの料理写真</Link>}
    </div>
  </section>
}
