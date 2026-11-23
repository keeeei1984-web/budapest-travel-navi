export type Place = { id: string; name: string; map: string; kind: '観光' | '食事' | '温泉'; dish?: string; note?: string; site?: string; booking?: string }
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
  ['レストラン', 'このお店の名物は何ですか？', 'What is your signature dish?', 'ワット イズ ユア シグネチャー ディッシュ？'],
  ['レストラン', 'ハンガリーの郷土料理で、おすすめは何ですか？', 'Which traditional Hungarian dish do you recommend?', 'ウィッチ トラディショナル ハンゲリアン ディッシュ ドゥー ユー レコメンド？'],
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
] as const
export const packing = ['パスポート', '航空券・宿泊予約控え', '海外旅行保険', 'クレジットカード・現金', '充電器・変換プラグ', 'モバイルバッテリー', '防寒着・手袋', '常備薬', '水着・タオル・サンダル', 'eSIMまたはローミングの設定']
