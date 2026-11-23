export type Place = { id: string; name: string; map: string; kind: '観光' | '食事'; dish?: string; note?: string; site?: string; booking?: string }
export const days = ['2027-02-10', '2027-02-11', '2027-02-12', '2027-02-13']
const sights = [
  ['漁夫の砦', 'Fisherman’s Bastion'], ['マーチャーシュ教会', 'Matthias Church'],
  ['ブダ城', 'Buda Castle'], ['セーチェーニ鎖橋', 'Széchenyi Chain Bridge'],
  ['ハンガリー国会議事堂', 'Hungarian Parliament Building'], ['ドナウ川沿い', 'Danube Promenade'],
  ['聖イシュトヴァーン大聖堂', 'St. Stephen’s Basilica'], ['英雄広場', 'Heroes’ Square'],
  ['アンドラーシ通り', 'Andrássy út'], ['中央市場', 'Central Market Hall'],
  ['ユダヤ人街', 'Jewish Quarter District VII'], ['市民公園', 'Városliget'],
  ['セーチェニ温泉', 'Széchenyi Thermal Bath'], ['ルダシュ温泉', 'Rudas Baths'],
]
const restaurants = [
  ['Kispiac Bisztró', 'マンガリッツァ豚', 'https://kispiacbudapest.hu/', 'https://kispiacbudapest.hu/reservation/'],
  ['NegroMangalica Bistro', 'マンガリッツァ豚', 'https://www.negromangalica.hu/en', 'https://www.negromangalica.hu/en/contact'],
  ['Paprika Vendéglő', 'フォアグラ', 'https://www.paprikavendeglo.hu/en/'],
  ['Kiskakukk Étterem', 'フォアグラ', 'https://kiskakukk.hu/en', 'https://kiskakukk.hu/en'],
  ['Rosenstein', 'フォアグラ', 'https://rosenstein.hu/en/', 'https://rosenstein.hu/en/'],
  ['Gettó Gulyás', 'チキンパプリカ', 'https://gettogulyas.hu/en/homepage/', 'https://gettogulyas.hu/en/contact/'],
  ['Menza', 'チキンパプリカ', 'https://www.menzaetterem.hu/en/', 'https://www.menzaetterem.hu/en/reservation/'],
  ['Retro Lángos Budapest', 'ランゴシュ', 'https://retrolangos.hu/en/', 'https://retrolangos.hu/en/table-reservation/'],
  ['Flórián téri Lángosos', 'ランゴシュ'],
]
export const places: Place[] = [
  ...sights.map(([name, map], i): Place => ({ id: 's' + i, name, map: map + ', Budapest', kind: '観光' })),
  ...restaurants.map(([name, dish, site, booking], i): Place => ({ id: 'r' + i, name, map: name + ', Budapest', kind: '食事', dish, site, booking })),
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
] as const
export const packing = ['パスポート', '航空券・宿泊予約控え', '海外旅行保険', 'クレジットカード・現金', '充電器・変換プラグ', 'モバイルバッテリー', '防寒着・手袋', '常備薬', '水着・タオル・サンダル', 'eSIMまたはローミングの設定']
