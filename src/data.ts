export type Place = { id: string; name: string; map: string; kind: '観光' | '食事' | '温泉'; dish?: string; orderWine?: string; orderQuestion?: string; note?: string; site?: string; booking?: string }
export const days = ['2027-02-10', '2027-02-11', '2027-02-12', '2027-02-13']
const sights = [
  ['漁夫の砦', 'Fisherman’s Bastion'], ['マーチャーシュ教会', 'Matthias Church'],
  ['ブダ城', 'Buda Castle'], ['セーチェーニ鎖橋', 'Széchenyi Chain Bridge'],
  ['ハンガリー国会議事堂', 'Hungarian Parliament Building'], ['ドナウ川沿い', 'Danube Promenade'],
  ['聖イシュトヴァーン大聖堂', 'St. Stephen’s Basilica'], ['英雄広場', 'Heroes’ Square'],
  ['アンドラーシ通り', 'Andrássy út'], ['中央市場', 'Central Market Hall'],
  ['ユダヤ人街', 'Jewish Quarter District VII'], ['市民公園', 'Városliget'],
]
const baths: Place[] = [
  { id: 's12', kind: '温泉', name: 'セーチェニ温泉', map: 'Széchenyi Thermal Bath, Budapest', site: 'https://www.szechenyibath.hu/en' },
  { id: 's13', kind: '温泉', name: 'ルダシュ温泉', map: 'Rudas Baths, Budapest', site: 'https://www.rudasfurdo.hu/en' },
]

export const addedBaths: Place[] = [
  { id: 'bath-lukacs', kind: '温泉', name: 'ルカーチ温泉', map: 'Lukács Thermal Bath, Budapest', site: 'https://www.lukacsfurdo.hu/en/' },
  { id: 'bath-dandar', kind: '温泉', name: 'ダンダール温泉', map: 'Dandár Thermal Bath, Budapest', site: 'https://www.dandarfurdo.hu/en/' },
  { id: 'bath-palatinus', kind: '温泉', name: 'パラティヌス温泉', map: 'Palatinus Thermal Bath, Budapest', site: 'https://www.palatinusstrand.hu/en/' },
  { id: 'bath-paskal', kind: '温泉', name: 'パシュカール温泉', map: 'Paskál Thermal Baths, Budapest', site: 'https://www.paskalfurdo.hu/en/' },
  { id: 'bath-csillaghegy', kind: '温泉', name: 'チッラグヘジ・アールパード温泉', map: 'Csillaghegyi Árpád Bath, Budapest', site: 'https://www.csillaghegyifurdo.hu/en' },
]

export const galleryBaths: Place[] = [
  { id: 'bath-veli', kind: '温泉', name: 'ヴェリ・ベイ温泉', map: 'Irgalmasok Veli Bej Bath, Budapest', site: 'https://www.irgalmasrend.hu/hu/velibej/home' },
  { id: 'bath-gellert', kind: '温泉', name: 'ゲッレールト温泉', map: 'Gellért Thermal Bath, Budapest', site: 'https://www.gellertbath.hu/' },
]

export function categorizeSavedPlace(place: Place): Place {
  if (place.kind !== '観光') return place
  const bath = baths.find(item => item.id === place.id)
  return bath ? { ...place, kind: bath.kind, site: place.site ?? bath.site } : place
}

const restaurants = [
  ['キシュピアツ・ビストロー', 'Kispiac Bisztró', 'マンガリッツァ豚', 'https://kispiacbudapest.hu/', 'https://kispiacbudapest.hu/reservation/'],
  ['ネグロ・マンガリツァ・ビストロー', 'NegroMangalica Bistro', 'マンガリッツァ豚', 'https://www.negromangalica.hu/en', 'https://www.negromangalica.hu/en/contact'],
  ['パプリカ・ヴェンデーグルー', 'Paprika Vendéglő', 'フォアグラ', 'https://www.paprikavendeglo.hu/en/'],
  ['キシュカクック・エーッテレム', 'Kiskakukk Étterem', 'フォアグラ', 'https://kiskakukk.hu/en', 'https://kiskakukk.hu/en'],
  ['ローゼンシュタイン', 'Rosenstein', 'フォアグラ', 'https://rosenstein.hu/en/', 'https://rosenstein.hu/en/'],
  ['ゲットー・グヤーシュ', 'Gettó Gulyás', 'チキンパプリカ', 'https://gettogulyas.hu/en/homepage/', 'https://gettogulyas.hu/en/contact/'],
  ['メンザ', 'Menza', 'チキンパプリカ', 'https://www.menzaetterem.hu/en/', 'https://www.menzaetterem.hu/en/reservation/'],
  ['レトロ・ラーンゴシュ・ブダペスト', 'Retro Lángos Budapest', 'ランゴシュ', 'https://retrolangos.hu/en/', 'https://retrolangos.hu/en/table-reservation/'],
  ['フローリアーン・テーリ・ラーンゴショシュ', 'Flórián téri Lángosos', 'ランゴシュ'],
  ['コム・シェ・ソワ', 'Comme Chez Soi', 'フォアグラ・パスタ', 'https://commechezsoi.hu/'],
  ['サーゼーヴェシュ・エッテレム', 'Százéves Étterem', 'チキンパプリカ', 'https://www.szazevesetterem.hu/eng/'],
]
// Older installations store the original restaurant name in each saved candidate.
const localNames = new Map(restaurants.map(([name, original]) => [original, name]))
export function placeDisplayName(name: string) {
  return localNames.get(name.trim()) ?? name
}

export const places: Place[] = [
  ...sights.map(([name, map], i): Place => ({ id: 's' + i, name, map: map + ', Budapest', kind: '観光' })),
  ...baths,
  ...addedBaths,
  ...galleryBaths,
  ...restaurants.map(([name, original, dish, site, booking], i): Place => ({ id: 'r' + i, name, map: original + ', Budapest', kind: '食事', dish, site, booking })),
]
export const latestRestaurants = places.filter(place => place.id === 'r9' || place.id === 'r10')

const restaurantNameKey = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}]/gu, '')
const latestAliases = new Map<string, string>([
  ['commechezsoi', 'r9'], ['コムシェソワ', 'r9'], ['szazevesetterem', 'r10'], ['szazeves', 'r10'],
  ['サーゼーヴェシュエッテレム', 'r10'], ['サーゼーヴェシュ', 'r10'], ['サーゼーヴェシュレストラン', 'r10'],
].map(([name, id]) => [restaurantNameKey(name), id]))

export function restaurantIdentity(place: Place) {
  if (place.kind !== '食事') return place.id
  return latestAliases.get(restaurantNameKey(place.name))
    ?? latestAliases.get(restaurantNameKey(place.map.replace(/,\s*Budapest$/i, '')))
    ?? place.id
}

export const restaurantExtras = [
  ['レストラン', '初めて来たのですが、何がおすすめですか？', 'It’s our first time here. What would you recommend?', 'イッツ アワー ファースト タイム ヒア。ワット ウッド ユー レコメンド？', 'おすすめ料理'],
  ['レストラン', '今日のおすすめは何ですか？', 'What are today’s specials?', 'ワット アー トゥデイズ スペシャルズ？', 'おすすめ料理'],
  ['レストラン', '地元の人に人気の料理はどれですか？', 'Which dish is popular with locals?', 'ウィッチ ディッシュ イズ ポピュラー ウィズ ローカルズ？', 'おすすめ料理'],
  ['レストラン', 'ハンガリーらしい前菜をおすすめしてもらえますか？', 'Could you recommend a traditional Hungarian starter?', 'クッド ユー レコメンド ア トラディショナル ハンゲリアン スターター？', 'おすすめ料理'],
  ['レストラン', '2人でシェアするなら、何品くらいがおすすめですか？', 'How many dishes would you suggest for two people to share?', 'ハウ メニー ディッシズ ウッド ユー サジェスト フォー トゥー ピープル トゥー シェア？', 'おすすめ料理'],
  ['レストラン', 'この前菜に合うメイン料理は何ですか？', 'What main course would go well with this starter?', 'ワット メイン コース ウッド ゴウ ウェル ウィズ ディス スターター？', 'おすすめ料理'],
  ['レストラン', '地元のデザートで何かおすすめはありますか？', 'Is there a local dessert you’d recommend?', 'イズ ゼア ア ローカル ディザート ユード レコメンド？', 'おすすめ料理'],
  ['レストラン', 'では、おすすめのものをお願いします。', 'We’ll go with your recommendation, please.', 'ウィル ゴウ ウィズ ユア レコメンデイション プリーズ', 'おすすめ料理'],
  ['レストラン', 'ワインリストを見せてもらえますか？', 'Could we see the wine list, please?', 'クッド ウィー シー ザ ワイン リスト プリーズ？', 'ワイン'],
  ['レストラン', 'ハンガリーの赤ワインでおすすめはありますか？', 'Could you recommend a Hungarian red wine?', 'クッド ユー レコメンド ア ハンゲリアン レッド ワイン？', 'ワイン'],
  ['レストラン', 'この料理にはどのワインが合いますか？', 'Which wine would go well with this dish?', 'ウィッチ ワイン ウッド ゴウ ウェル ウィズ ディス ディッシュ？', 'ワイン'],
  ['レストラン', 'この2品に合うワインはありますか？', 'Is there a wine that would go well with both of these dishes?', 'イズ ゼア ア ワイン ザット ウッド ゴウ ウェル ウィズ ボウス オヴ ジーズ ディッシズ？', 'ワイン'],
  ['レストラン', '辛口の白ワインが好きです。何がおすすめですか？', 'I like dry white wine. What would you recommend?', 'アイ ライク ドライ ホワイト ワイン。ワット ウッド ユー レコメンド？', 'ワイン'],
  ['レストラン', '軽めの赤ワインはありますか？', 'Do you have a light-bodied red wine?', 'ドゥー ユー ハヴ ア ライト ボディド レッド ワイン？', 'ワイン'],
  ['レストラン', 'このワインは甘口ですか、それとも辛口ですか？', 'Is this wine sweet or dry?', 'イズ ディス ワイン スウィート オア ドライ？', 'ワイン'],
  ['レストラン', '1本1万フォリント以内でおすすめはありますか？', 'Could you recommend a bottle for under ten thousand forints?', 'クッド ユー レコメンド ア ボトル フォー アンダー テン サウザンド フォリンツ？', 'ワイン'],
  ['レストラン', 'この値段はボトル1本分ですか？', 'Is this the price for a whole bottle?', 'イズ ディス ザ プライス フォー ア ホウル ボトル？', 'ワイン'],
  ['レストラン', 'このワインをボトルで1本お願いします。', 'Could we have a bottle of this wine, please?', 'クッド ウィー ハヴ ア ボトル オヴ ディス ワイン プリーズ？', 'ワイン'],
  ['レストラン', 'ボトル1本とグラスを2つお願いします。', 'One bottle and two glasses, please.', 'ワン ボトル アンド トゥー グラッシズ プリーズ', 'ワイン'],
  ['レストラン', '食事と一緒にワインを持ってきてもらえますか？', 'Could you bring the wine with our food, please?', 'クッド ユー ブリング ザ ワイン ウィズ アワー フード プリーズ？', 'ワイン'],
  ['レストラン', 'このワインはグラスでも頼めますか？', 'Can we order this wine by the glass?', 'キャン ウィー オーダー ディス ワイン バイ ザ グラス？', 'ワイン'],
  ['レストラン', 'ハーフボトルはありますか？', 'Do you have this in a half bottle?', 'ドゥー ユー ハヴ ディス イン ア ハーフ ボトル？', 'ワイン'],
  ['レストラン', '甘口のトカイワインをグラスでお願いします。', 'Could I have a glass of sweet Tokaji wine, please?', 'クッド アイ ハヴ ア グラス オヴ スウィート トカイ ワイン プリーズ？', 'ワイン'],
] as const

export const phrases = [
  ['交通', 'このバスは空港に行きますか？', 'Does this bus go to the airport?', 'ダズ ディス バス ゴウ トゥ ジ エアポート？'],
  ['交通', '切符はどこで買えますか？', 'Where can I buy a ticket?', 'ウェア キャン アイ バイ ア ティケット？'],
  ['交通', 'この切符はどうやって有効化しますか？', 'How do I validate this ticket?', 'ハウ ドゥ アイ ヴァリデイト ディス ティケット？'],
  ['ホテル', '予約しています。', 'I have a reservation.', 'アイ ハヴ ア レザヴェイション'],
  ['ホテル', '荷物を預けられますか？', 'Can I leave my luggage here?', 'キャン アイ リーヴ マイ ラゲッジ ヒア？'],
  ['レストラン', 'メニューをお願いします。', 'Could I see the menu, please?', 'クッド アイ シー ザ メニュー プリーズ？'],
  ['レストラン', 'お会計をお願いします。', 'Could I have the bill, please?', 'クッド アイ ハヴ ザ ビル プリーズ？'],
  ['レストラン', 'ナッツアレルギーがあります。', 'I have a nut allergy.', 'アイ ハヴ ア ナット アラジー'],
  ['観光', '入口はどこですか？', 'Where is the entrance?', 'ウェア イズ ジ エントランス？'],
  ['観光', '写真を撮ってもいいですか？', 'May I take a photo?', 'メイ アイ テイク ア フォウトウ？'],
  ['買い物', 'カードで払えますか？', 'Can I pay by card?', 'キャン アイ ペイ バイ カード？'],
  ['買い物', 'これはいくらですか？', 'How much is this?', 'ハウ マッチ イズ ディス？'],
  ['緊急時', '救急車を呼んでください。', 'Please call an ambulance.', 'プリーズ コール アン アンビュランス'],
  ['緊急時', 'パスポートをなくしました。', 'I have lost my passport.', 'アイ ハヴ ロスト マイ パスポート'],
  ['ハンガリー語', 'こんにちは', 'Jó napot!', 'ヨー ナポト'],
  ['ハンガリー語', 'ありがとう', 'Köszönöm.', 'クスヌム'],
  ['ハンガリー語', 'すみません', 'Elnézést.', 'エルネーズィーシュト'],
  ['ハンガリー語', 'はい／いいえ', 'Igen. / Nem.', 'イゲン／ネム'],
  ['レストラン', '2人です。席は空いていますか？', 'Do you have a table for two?', 'ドゥー ユー ハヴ ア テイブル フォー トゥー？'],
  ['レストラン', '予約しています。名前はタナカです。', 'I have a reservation under the name Tanaka.', 'アイ ハヴ ア レザヴェイション アンダー ザ ネイム タナカ'],
  ['レストラン', '予約していません。どのくらい待ちますか？', 'We don’t have a reservation. How long is the wait?', 'ウィー ドウント ハヴ ア レザヴェイション。ハウ ロング イズ ザ ウェイト？'],
  ['レストラン', '英語のメニューはありますか？', 'Do you have a menu in English?', 'ドゥー ユー ハヴ ア メニュー イン イングリッシュ？'],
  ['レストラン', 'このお店の名物は何ですか？', 'What is your signature dish?', 'ワット イズ ユア シグネチャー ディッシュ？', 'おすすめ料理'],
  ['レストラン', 'ハンガリーの郷土料理で、おすすめは何ですか？', 'Which traditional Hungarian dish do you recommend?', 'ウィッチ トラディショナル ハンゲリアン ディッシュ ドゥー ユー レコメンド？', 'おすすめ料理'],
  ['レストラン', 'この料理には何が入っていますか？', 'What ingredients are in this dish?', 'ワット イングリーディエンツ アー イン ディス ディッシュ？'],
  ['レストラン', 'マンガリッツァ豚の料理はありますか？', 'Do you serve any dishes made with Mangalica pork?', 'ドゥー ユー サーヴ エニー ディッシズ メイド ウィズ マンガリツァ ポーク？'],
  ['レストラン', 'フォアグラの料理はありますか？', 'Do you serve foie gras?', 'ドゥー ユー サーヴ フォワ グラ？'],
  ['レストラン', 'チキンパプリカをお願いします。', 'I’d like the chicken paprikash, please.', 'アイド ライク ザ チキン パプリカシュ プリーズ'],
  ['レストラン', 'サワークリームとチーズのランゴシュをお願いします。', 'I’d like a lángos with sour cream and cheese, please.', 'アイド ライク ア ラーンゴシュ ウィズ サワー クリーム アンド チーズ プリーズ'],
  ['レストラン', 'これを1つと、こちらを2つお願いします。', 'Could we have one of this and two of that, please?', 'クッド ウィー ハヴ ワン オヴ ディス アンド トゥー オヴ ザット プリーズ？'],
  ['レストラン', '炭酸なしの水をお願いします。', 'Could we have some still water, please?', 'クッド ウィー ハヴ サム スティル ウォーター プリーズ？'],
  ['レストラン', 'この料理は辛いですか？', 'Is this dish spicy?', 'イズ ディス ディッシュ スパイシー？'],
  ['レストラン', 'この料理を2人で分けられますか？', 'Can we share this dish between two people?', 'キャン ウィー シェア ディス ディッシュ ビトゥイーン トゥー ピープル？'],
  ['レストラン', '肉や魚を使っていない料理はありますか？', 'Do you have any dishes without meat or fish?', 'ドゥー ユー ハヴ エニー ディッシズ ウィズアウト ミート オア フィッシュ？'],
  ['レストラン', 'これは牛乳や乳製品を含みますか？', 'Does this contain milk or other dairy products?', 'ダズ ディス コンテイン ミルク オア アザー デアリー プロダクツ？'],
  ['レストラン', 'ピーナッツに重いアレルギーがあります。', 'I have a severe peanut allergy.', 'アイ ハヴ ア シヴィア ピーナット アラジー'],
  ['レストラン', '同じ調理器具や油を使っているか、厨房に確認してもらえますか？', 'Could you check with the kitchen if they use the same utensils or oil?', 'クッド ユー チェック ウィズ ザ キッチン イフ ゼイ ユーズ ザ セイム ユーテンシルズ オア オイル？'],
  ['レストラン', '残りを持ち帰り用に包んでもらえますか？', 'Could you pack up the leftovers for us?', 'クッド ユー パック アップ ザ レフトオーヴァーズ フォー アス？'],
  ['レストラン', 'サービス料は会計に含まれていますか？', 'Is the service charge included in the bill?', 'イズ ザ サーヴィス チャージ インクルーデッド イン ザ ビル？'],
  ['レストラン', '別々に支払えますか？', 'Could we pay separately?', 'クッド ウィー ペイ セパラトリー？'],
  ['レストラン', 'カードで、フォリント建てで支払いたいです。', 'I’d like to pay by card in Hungarian forints, please.', 'アイド ライク トゥ ペイ バイ カード イン ハンゲリアン フォリンツ プリーズ'],
  ['ホテル', 'チェックインをお願いします。', 'I’d like to check in, please.', 'アイド ライク トゥ チェック イン プリーズ'],
  ['ホテル', '朝食は何時からですか？', 'What time does breakfast start?', 'ワット タイム ダズ ブレックファスト スタート？'],
  ['ホテル', '朝食は料金に含まれていますか？', 'Is breakfast included in the room rate?', 'イズ ブレックファスト インクルーデッド イン ザ ルーム レイト？'],
  ['ホテル', 'Wi-Fiのパスワードを教えてもらえますか？', 'Could you tell me the Wi-Fi password?', 'クッド ユー テル ミー ザ ワイファイ パスワード？'],
  ['ホテル', '部屋の暖房が効きません。見てもらえますか？', 'The heating in my room isn’t working. Could someone take a look?', 'ザ ヒーティング イン マイ ルーム イズント ワーキング。クッド サムワン テイク ア ルック？'],
  ['ホテル', 'チェックアウトは何時ですか？', 'What time is check-out?', 'ワット タイム イズ チェックアウト？'],
  ['ホテル', 'チェックアウトのあと、午後まで荷物を預けられますか？', 'Can you keep our luggage until this afternoon after check-out?', 'キャン ユー キープ アワー ラゲッジ アンティル ディス アフタヌーン アフター チェックアウト？'],
  ...restaurantExtras,
] as const
export const packing = ['パスポート', '航空券・宿泊予約控え', '海外旅行保険', 'クレジットカード・現金', '充電器・変換プラグ', 'モバイルバッテリー', '防寒着・手袋', '常備薬', '水着・タオル・サンダル', 'eSIMまたはローミングの設定']
