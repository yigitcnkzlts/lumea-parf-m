export const brandStories: Record<
  string,
  { origin: string; vibe: string; bestFor: string }
> = {
  CHANEL: {
    origin: "Paris",
    vibe: "Zamansız zarafet ve ikonik imzalar",
    bestFor: "Klasik ve sofistike tercihler",
  },
  DIOR: {
    origin: "Paris",
    vibe: "Cesur karakter ve modern lüks",
    bestFor: "Güçlü ve akılda kalıcı kokular",
  },
  "TOM FORD": {
    origin: "New York",
    vibe: "Niş derinlik ve duyusal zenginlik",
    bestFor: "Özgün ve lüks arayışlar",
  },
  "YVES SAINT LAURENT": {
    origin: "Paris",
    vibe: "Özgür ruh ve gece zarafeti",
    bestFor: "Çağdaş ve iddialı stiller",
  },
  GUCCI: {
    origin: "Floransa",
    vibe: "Cesur moda dili ve çekicilik",
    bestFor: "Dikkat çeken imzalar",
  },
  BURBERRY: {
    origin: "Londra",
    vibe: "İngiliz zarafeti ve modern güç",
    bestFor: "Temiz ve kararlı karakterler",
  },
  PRADA: {
    origin: "Milano",
    vibe: "Minimal lüks ve kristal netlik",
    bestFor: "Modern ve rafine seçimler",
  },
  "GIORGIO ARMANI": {
    origin: "Milano",
    vibe: "Akdeniz ferahlığı ve sadelik",
    bestFor: "Günlük zarif kullanım",
  },
  "PACO RABANNE": {
    origin: "Paris",
    vibe: "Gösterişli enerji ve gece ışıltısı",
    bestFor: "Parti ve özel geceler",
  },
  KILIAN: {
    origin: "Paris",
    vibe: "Niş hikâye anlatımı ve karanlık lüks",
    bestFor: "Koleksiyon değeri arayanlar",
  },
  "MAISON FRANCIS KURKDJIAN": {
    origin: "Paris",
    vibe: "Ustalık ve sofistike sadelik",
    bestFor: "Niş minimalistler",
  },
  "CLIVE CHRISTIAN": {
    origin: "Londra",
    vibe: "Kraliyet zarafeti ve ultra premium",
    bestFor: "Özel koleksiyonlar",
  },
  "CALVIN KLEIN": {
    origin: "New York",
    vibe: "Temiz minimalizm ve günlük ferahlık",
    bestFor: "Sade ve modern tercihler",
  },
  GIVENCHY: {
    origin: "Paris",
    vibe: "Fransız zarafeti ve cesur çizgi",
    bestFor: "Şık ve iddialı imzalar",
  },
  LANCÔME: {
    origin: "Paris",
    vibe: "Romantik çiçeksi ve yumuşak lüks",
    bestFor: "Zarif günlük ve akşam",
  },
  MARFA: {
    origin: "Niş",
    vibe: "Çöl esintisi ve özgün karakter",
    bestFor: "Farklı ve nadir arayışlar",
  },
  "OPULENT SHAIK": {
    origin: "Niş",
    vibe: "Zengin oryantal ve gösterişli derinlik",
    bestFor: "Güçlü ve lüks kokular",
  },
  "PHILIPP PLEIN": {
    origin: "İsviçre",
    vibe: "Cesur enerji ve gece ışıltısı",
    bestFor: "Dikkat çeken modern stiller",
  },
  TRUSSARDI: {
    origin: "Milano",
    vibe: "İtalyan zarafeti ve deri zarafeti",
    bestFor: "Sofistike günlük kullanım",
  },
  VALENTINO: {
    origin: "Roma",
    vibe: "Romantik lüks ve moda dili",
    bestFor: "Özel gün ve hediye",
  },
};

export function getBrandStory(brand: string) {
  return (
    brandStories[brand] ?? {
      origin: "Dünya",
      vibe: "Seçkin parfümeri geleneği",
      bestFor: "Bee seçkisi sevenler",
    }
  );
}
