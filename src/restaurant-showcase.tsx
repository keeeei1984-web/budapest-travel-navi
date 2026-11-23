import { restaurantGalleries, restaurantMenus } from './candidate-photos'
import { Link } from './shared'

type RestaurantShowcase = {
  trip?: string
  review: string
  dishes: readonly string[]
  gallery?: string
  menuNote?: string
}

export const restaurantShowcases: Record<string, RestaurantShowcase> = {
  r1: {
    review: '26609385-Reviews-Negro_Mangalica',
    dishes: ['マンガリッツァ豚のハムと森のキノコ', '赤ワイン仕立てのマンガリッツァ豚料理'],
    gallery: 'https://www.negromangalica.hu/en/gallery',
    menuNote: '料理は店舗紹介に掲載された例です。',
  },
  r2: {
    trip: 'https://jp.trip.com/restaurant/hungary/budapest/detail/paprika-vendgl-13851246/',
    review: '26552930-Reviews-Paprika_Vendeglo',
    dishes: ['ハンガリー風フォアグラ', '冷製ガチョウのレバーコンフィと野菜', '牛ヒレ肉のシチュー'],
    gallery: 'https://www.paprikavendeglo.hu/en/gallery/',
  },
  r3: {
    trip: 'https://www.trip.com/restaurant/hungary/budapest/detail/kiskakukk-restaurant-17320281/',
    review: '782615-Reviews-Kiskakukk_Etterem',
    dishes: ['フォアグラのグリル（焼きリンゴとトカイワインソース）', 'ガチョウのレバーパテ（玉ねぎチャツネ添え）'],
    gallery: 'https://kiskakukk.hu/en/gallery',
  },
  r4: {
    trip: 'https://www.trip.com/restaurant/hungary/budapest/detail/rosenstein-vendeglo-17320245/',
    review: '692912-Reviews-Rosenstein_Vendeglo',
    dishes: ['フォアグラのフライ（マッシュポテト添え）', 'ガチョウのもも肉のロースト（煮込みキャベツ添え）'],
    menuNote: '料理例は公式サイトの過去のメニューから。',
  },
  r5: {
    trip: 'https://us.trip.com/restaurant/hungary/budapest/detail/gett-gulys-31409448/',
    review: '9856765-Reviews-Getto_Gulyas',
    dishes: ['チキンパプリカ（ハンガリー風卵麺添え）', '鶏むね肉のフライ（パセリポテトとキャベツサラダ添え）'],
  },
  r9: {
    trip: 'https://my.trip.com/restaurant/hungary/budapest/detail/comme-chez-soi-17319786/',
    review: '794237-Reviews-Comme_Chez_Soi',
    dishes: ['フォアグラ料理', '自家製パスタ'],
    gallery: 'https://commechezsoi.hu/rolunk#galeria',
    menuNote: '料理例は店舗紹介と掲載レビューから。',
  },
  r10: {
    trip: 'https://us.trip.com/restaurant/hungary/budapest/detail/szazeves-etterem-17319758/',
    review: '1382947-Reviews-Szazeves_Etterem',
    gallery: 'https://www.szazevesetterem.hu/eng/gallery/',
    dishes: ['グヤーシュスープ', 'チキンパプリカ（ガルシュカ添え）', 'ショムローイ・ガルシュカ（スポンジケーキのデザート）'],
    menuNote: '料理例は公開メニューから。',
  },
}

export function RestaurantHighlights({ id }: { id: string }) {
  const restaurant = restaurantShowcases[id]
  const reviewUrl = `https://www.tripadvisor.jp/Restaurant_Review-g274887-d${restaurant.review}-Budapest_Central_Hungary.html`
  return <section className="restaurant-highlights" aria-label="店の写真・名物料理・メニュー">
    <div className="row">
      {restaurant.trip && <Link href={restaurant.trip}>Trip.comの写真</Link>}
      <Link href={reviewUrl}>Tripadvisorの写真</Link>
      {restaurant.gallery && <Link href={restaurant.gallery}>公式ギャラリー</Link>}
      {id === 'r5' && <Link href={restaurantGalleries[id]}>店舗写真（Flickr）</Link>}
      {id === 'r2' && <Link href="https://www.paprikavendeglo.hu/en/">公式サイトの料理写真</Link>}
    </div>
    <div className="restaurant-dishes">
      <h4>この店で食べたい料理</h4>
      <ul>{restaurant.dishes.map(dish => <li key={dish}>{dish}</li>)}</ul>
      <p className="hint">{restaurant.menuNote} 訪問日の提供状況はお店でご確認ください。</p>
    </div>
    <div className="row">
      <Link href={restaurantMenus[id]}>{id === 'r4' ? '公式サイト掲載の過去メニュー' : '公式メニュー'}</Link>
      {id === 'r4' && <Link href="https://rosenstein.hu/etlap/">公式メニュー案内（ハンガリー語）</Link>}
    </div>
  </section>
}
