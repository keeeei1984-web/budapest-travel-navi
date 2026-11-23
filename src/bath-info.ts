type BathPrice = { label: string; min: number; max: number; url: string }
export type BathInfo = {
  english: string
  indoor: string
  outdoor: string
  features: string
  atmosphere: string
  price?: BathPrice
  hours: string
  hoursUrl: string
  access: string
  wear: string
  rulesUrl?: string
  visitStatus?: string
  closed?: boolean
  galleryUrl?: string
}

export const bathCheckedOn = '2026年11月23日'
const unconfirmed = '2027年2月の個別日程は未確認。掲載の営業時間・料金は確認時点の公式案内です。'
const veli = 'https://www.irgalmasrend.hu/hu/velibej/'
export const bathInfo: Partial<Record<string, BathInfo>> = {
  s12: {
    english: 'Széchenyi Thermal Bath', indoor: 'あり', outdoor: 'あり',
    features: '大きな屋外温泉、屋内の温泉浴槽、円形の流れるプール。',
    atmosphere: '黄色い建物が囲む、開放的な屋外浴場。',
    price: { label: '2026年・大人ロッカー付き1日券（月〜木／金〜日）', min: 13200, max: 14800, url: 'https://www.szechenyibath.hu/en/prices' },
    hours: '月〜木 07:00–20:00、金 07:00–22:00、土日 08:00–20:00。',
    hoursUrl: 'https://www.szechenyibath.hu/opening-hours',
    access: '男女共用。', wear: '水着着用。水泳用プールでは水泳帽が必要。',
    rulesUrl: 'https://www.szechenyibath.hu/en/faq', visitStatus: unconfirmed,
  },
  s13: {
    english: 'Rudas Thermal Bath', indoor: 'あり', outdoor: 'あり（屋上）',
    features: '八角形のトルコ式浴槽、ドナウ川を望む屋上浴槽、屋内ウェルネス浴槽。',
    atmosphere: '薄暗い歴史的なドーム浴場と現代的なウェルネス施設。',
    price: { label: '2026年・大人全エリア1日券（月〜木／金〜日）', min: 12000, max: 15000, url: 'https://www.rudasfurdo.hu/en/prices' },
    hours: 'ウェルネスは月 06:00–22:00、火〜日 06:00–20:00。トルコ浴場は曜日・時間帯で利用条件が異なります。',
    hoursUrl: 'https://www.rudasfurdo.hu/en/opening-hours',
    access: 'トルコ浴場は水曜・月木金の朝が男性専用、火曜が女性専用。月木金11:00以降と土日は男女共用。',
    wear: 'トルコ浴場の男女共用時間は水着着用。専用時間や他のエリアは公式案内を参照。',
    rulesUrl: 'https://www.rudasfurdo.hu/en/opening-hours', visitStatus: unconfirmed,
  },
  'bath-lukacs': {
    english: 'Lukács Thermal Bath', indoor: 'あり', outdoor: 'あり',
    features: '温度の異なる温泉浴槽、屋外の水泳プールとウェルネス浴槽。',
    atmosphere: '歴史あるブダ側の温泉。屋内浴槽と外気に触れる屋外プールを行き来できます。',
    price: { label: '2026年・大人入場券（月〜木／金〜日・祝日）', min: 7000, max: 8000, url: 'https://www.lukacsfurdo.hu/en/prices-2026' },
    hours: '火曜 07:00–22:00、その他の曜日 07:00–19:00。',
    hoursUrl: 'https://www.lukacsfurdo.hu/en/opening-hours',
    access: '男女別利用の時間指定は公式案内で確認できず。',
    wear: '水着で利用。サウナと水泳プールの個別条件は公式案内を参照。',
    rulesUrl: 'https://www.lukacsfurdo.hu/en/general-information', visitStatus: unconfirmed,
  },
  'bath-veli': {
    english: 'Veli Bej Bath', indoor: 'あり', outdoor: '公式案内では未確認',
    features: '八角形の中央浴槽（36〜38℃）と、温度の異なる4つの小浴槽。',
    atmosphere: 'ドームの下に中央浴槽がある、こぢんまりした歴史的なトルコ浴場。',
    price: { label: '一般入場券（3時間、曜日・時間帯により異なる）', min: 5700, max: 7200, url: veli + 'araink' },
    hours: '月・火 15:00–21:00、水〜日 06:00–12:00／15:00–21:00。',
    hoursUrl: veli + 'nyitvatartsszolgltatsok',
    access: '全営業時間で男女共用。', wear: '水着着用必須。',
    rulesUrl: veli + 'home', visitStatus: unconfirmed,
    galleryUrl: 'https://welovebudapest.com/en/article/2011/11/18/the-miraculous-veli-bej-is-hiding-in-buda',
  },
  'bath-gellert': {
    english: 'Gellért Thermal Bath', indoor: 'あり（休業前）', outdoor: 'あり（休業前）',
    features: 'ガラス屋根の大きな屋内プール、装飾タイルの温泉浴槽、屋外プール。',
    atmosphere: '柱やモザイク装飾が施されたアール・ヌーヴォーの浴場。',
    hours: '改装休業中。', hoursUrl: 'https://www.gellertbath.hu/opening-hours',
    access: '休業中。再開後の条件は未確認。', wear: '休業中。再開後の条件は未確認。',
    closed: true, visitStatus: '2027年2月は改装休業予定。公式サイトでは2028年に再開見込み。',
    galleryUrl: 'https://www.gellertbath.hu/galleries/photos-of-gellert-thermal-bath',
  },
  'bath-dandar': {
    english: 'Dandár Thermal Bath', indoor: 'あり', outdoor: 'あり',
    features: '屋内・屋外の温泉浴槽。', atmosphere: 'ペスト側の街中にある温泉。',
    hours: '公式サイトを参照。', hoursUrl: 'https://www.dandarfurdo.hu/en/opening-hours',
    access: '未確認', wear: '未確認', visitStatus: unconfirmed,
  },
  'bath-palatinus': {
    english: 'Palatinus Thermal and Open-air Bath', indoor: 'あり', outdoor: 'あり',
    features: 'マルギット島の温浴施設。屋外設備は季節で利用範囲が異なります。', atmosphere: '島の緑に囲まれた温浴施設。',
    hours: '公式サイトを参照。', hoursUrl: 'https://www.palatinusstrand.hu/en/opening-hours',
    access: '未確認', wear: '未確認', visitStatus: unconfirmed,
  },
  'bath-paskal': {
    english: 'Paskál Thermal Baths', indoor: 'あり', outdoor: 'あり',
    features: '屋内温浴施設と屋外プール。', atmosphere: 'ペスト側のズグロー地区にある温浴施設。',
    hours: '公式サイトを参照。', hoursUrl: 'https://www.paskalfurdo.hu/en/opening-hours',
    access: '未確認', wear: '未確認', visitStatus: unconfirmed,
  },
  'bath-csillaghegy': {
    english: 'Csillaghegyi Árpád Bath', indoor: 'あり', outdoor: 'あり（季節営業）',
    features: '屋内の温浴施設と季節営業の屋外エリア。', atmosphere: 'ブダ側北部の温浴施設。',
    hours: '公式サイトを参照。', hoursUrl: 'https://www.csillaghegyifurdo.hu/en/opening-hours',
    access: '未確認', wear: '未確認', visitStatus: unconfirmed,
  },
}
