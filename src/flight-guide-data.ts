export const flightGuideTitle = 'フライト・乗り継ぎ'

export type Flight = {
  number: string
  from: string
  to: string
  departure: string
  arrival: string
  nextDay?: string
  codeshare?: boolean
}

export const flightSchedule: { title: string; days: { date: string; flights: Flight[] }[] }[] = [
  { title: '往路', days: [
    { date: '2月9日（火）', flights: [
      { number: 'NH78', from: '新千歳 CTS', to: '羽田 HND', departure: '19:30', arrival: '21:10' },
      { number: 'NH217', from: '羽田 HND', to: 'ミュンヘン MUC', departure: '23:30', arrival: '06:20', nextDay: '翌2月10日（水）' },
    ] },
    { date: '2月10日（水）', flights: [
      { number: 'NH5861', from: 'ミュンヘン MUC', to: 'ブダペスト BUD', departure: '08:00', arrival: '09:15', codeshare: true },
    ] },
  ] },
  { title: '復路', days: [
    { date: '2月13日（土）', flights: [
      { number: 'NH5468', from: 'ブダペスト BUD', to: 'フランクフルト FRA', departure: '14:25', arrival: '16:10', codeshare: true },
      { number: 'NH224', from: 'フランクフルト FRA', to: '羽田 HND', departure: '20:45', arrival: '17:55', nextDay: '翌2月14日（日）' },
    ] },
    { date: '2月14日（日）', flights: [
      { number: 'NH79', from: '羽田 HND', to: '新千歳 CTS', departure: '20:00', arrival: '21:35' },
    ] },
  ] },
]

export const transfers = {
  munich: {
    label: 'ミュンヘン（往路）',
    subtitle: '2月10日（水） · ミュンヘン空港 MUC',
    duration: '1時間40分',
    times: [
      ['06:20', 'ミュンヘン到着予定'],
      ['06:35〜07:20', '降機・入国審査・必要な検査・移動の目安'],
      ['07:20頃', '搭乗ゲートへの到着目標'],
      ['08:00', 'ブダペスト行き出発予定'],
    ],
    steps: [
      ['06:20 ミュンヘン到着', '降機後は Transfer / Connecting Flights（乗り継ぎ）の標識へ。荷物がブダペストまで預けられている場合、通常は Exit（出口）や Baggage Claim（手荷物受取）へ進みません。航空会社の案内を優先してください。'],
      ['次の搭乗口を確認', '電光掲示板で Budapest（BUD）、08:00、実際の運航会社の便名を探します。ターミナル2のG（本館）またはK（サテライト）は候補です。出発ゲートは当日確認してください。'],
      ['入国審査・必要な保安検査', '日本からシェンゲン圏に入るため、ミュンヘンで入国審査を受けます。パスポートと次の搭乗券を準備し、保安検査が案内された場合は受けてください。EESなどの最新手続きは渡航前にEU公式情報で確認してください。'],
      ['搭乗ゲートへ移動', 'Gはターミナル2本館、Kはサテライトです。到着・出発ゲートの位置により、地下シャトルトレインで本館とサテライトを移動します。当日の標識と係員の案内を優先してください。'],
      ['08:00 ブダペスト行き出発', '07:20頃までのゲート到着を目標に、まず搭乗口へ。搭乗は出発より前に締め切られます。07:20はアプリ上の目安です。正式な締切は搭乗券や運航会社の案内で確認してください。'],
    ],
    links: [
      ['ANA ミュンヘン空港案内', 'https://www.ana.co.jp/ja/jp/guide/prepare/airport-guide/international/muc.html'],
      ['ミュンヘン空港公式', 'https://www.munich-airport.com/'],
      ['ミュンヘン空港公式・乗り継ぎ案内', 'https://www.munich-airport.com/connecting-flights-260553'],
    ],
  },
  frankfurt: {
    label: 'フランクフルト（復路）',
    subtitle: '2月13日（土） · フランクフルト空港 FRA',
    duration: '4時間35分',
    times: [
      ['16:10', 'フランクフルト到着予定'],
      ['到着後', '搭乗口確認・出国審査・必要な検査・移動'],
      ['20:45', '羽田行き出発予定'],
    ],
    steps: [
      ['16:10 フランクフルト到着', '降機後は Transfer / Connecting Flights（乗り継ぎ）の標識へ。荷物の預け先や再チェックインについて運航会社から指示がある場合は、その案内に従ってください。'],
      ['羽田行きの搭乗口を確認', '電光掲示板で Tokyo Haneda（HND）、20:45、NH224を探します。ターミナルやゲートが変わる場合は、当日の掲示と案内標識を優先してください。'],
      ['シェンゲン圏の出国審査', 'ブダペストから到着して日本へ向かうため、フランクフルトでシェンゲン圏の出国審査を受けます。パスポートと搭乗券を用意し、案内に応じて保安検査も受けてください。'],
      ['20:45 羽田行き出発', '出発前に搭乗が締め切られます。審査とゲートまでの移動に余裕を持ち、正式な搭乗時刻・締切は搭乗券や運航会社の案内で確認してください。'],
    ],
    links: [
      ['ANA フランクフルト空港案内', 'https://www.ana.co.jp/ja/jp/guide/prepare/airport-guide/international/fra.html'],
      ['フランクフルト空港公式・乗り継ぎ案内', 'https://www.frankfurt-airport.com/en/flights-and-transfer/transferring-at-fra.html'],
    ],
  },
} as const

export const baggageChecks = [
  { id: 'bag-tag', text: '新千歳で通し預けできるか確認。羽田で預ける場合も、荷物タグの最終目的地が BUD になっているか確認する。' },
  { id: 'boarding-pass', text: 'ブダペスト行きの搭乗券が羽田の出発前までに発行されるか確認する。' },
  { id: 'bag-through', text: '同一予約なら通常は最終目的地まで運ばれます。ブダペストで受け取れるか、チェックイン時に航空会社へ確認する。' },
]

export const flightPhrases = [
  ['ブダペスト行きに乗り継ぎます。', "I'm connecting to Budapest."],
  ['この搭乗口はどこですか？', 'Where is this gate?'],
  ['乗り継ぎ時間が短いです。', 'I have a short connection.'],
  ['飛行機に間に合わないかもしれません。', 'I might miss my flight.'],
  ['助けてもらえますか？', 'Could you help me, please?'],
] as const
