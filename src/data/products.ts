import type { Product } from "@/types/product";

const images = [
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85",
] as const;

const make = (
  id: number,
  slug: string,
  brand: string,
  name: string,
  category: Product["category"],
  scentFamily: Product["scentFamily"],
  price: number,
  salePrice: number,
  imageIndex: number,
  extra: Partial<Product> = {},
): Product => ({
  id,
  slug,
  brand,
  name,
  category,
  scentFamily,
  description: extra.description ?? `${name}, Bee seçkisinde yer alan seçkin bir ${scentFamily.toLocaleLowerCase("tr-TR")} parfümdür.`,
  price,
  salePrice,
  images: [images[imageIndex % images.length], images[(imageIndex + 2) % images.length]],
  rating: 4.8,
  reviewCount: 124 + id * 9,
  stock: 12 + id,
  sizes: [30, 50, 100],
  topNotes: ["Bergamot", "Mandalina"],
  heartNotes: ["Yasemin", "Gül"],
  baseNotes: ["Vanilya", "Sandal ağacı"],
  isNew: id > 7,
  isBestSeller: id < 7,
  ...extra,
});

export const products: Product[] = [
  make(1, "chanel-coco-mademoiselle", "CHANEL", "Coco Mademoiselle", "Kadın", "Oryantal", 6850, 5790, 0, {
    description:
      "Coco Mademoiselle, taze portakalın kıvılcımıyla açılır; ardından gül ve yaseminin zarif dansı gelir. Alt notalardaki paçuli ve vanilya, kokuyu uzun saatler boyunca sıcak ve çekici tutar. Gün içinden akşama uzanan, özgür ve kendinden emin bir kadın imzasıdır.",
    topNotes: ["Portakal", "Bergamot", "Portakal çiçeği"],
    heartNotes: ["Türk gülü", "Yasemin", "Mimoza"],
    baseNotes: ["Paçuli", "Beyaz misk", "Vanilya", "Vetiver"],
  }),

  make(2, "dior-sauvage-elixir", "DIOR", "Sauvage Elixir", "Erkek", "Oryantal", 7290, 6490, 1, {
    images: ["/images/dior-sauvage.jpg", "/images/erkek-hero.jpg"],
    description:
      "Sauvage Elixir, lavanta ve baharatın yoğun birleşimiyle açılan güçlü bir erkek karakteridir. Grapefruit ferahlığı, tarçın ve hindistan cevizinin sıcaklığıyla buluşur; amber ve odunsu taban ise kalıcı bir iz bırakır. Cesur, karizmatik ve unutulmaz bir imza arayanlar için.",
    topNotes: ["Greyfurt", "Elemi", "Lavanta"],
    heartNotes: ["Tarçın", "Hindistan cevizi", "Lavanta absolute"],
    baseNotes: ["Amber", "Licorice", "Sandal ağacı", "Paçuli"],
  }),

  make(3, "ysl-libre-intense", "YVES SAINT LAURENT", "Libre Intense", "Kadın", "Çiçeksi", 6490, 5490, 2, {
    description:
      "Libre Intense, lavanta ve portakal çiçeğinin özgür ruhunu daha derin, daha tutkulu bir yoruma taşır. Madagaskar vanilyası ve amberwood, kokuyu kadifemsi ve kalıcı kılar. Hem gündüz zarafetini hem gece çekiciliğini taşıyan modern bir klasik.",
    topNotes: ["Lavanta", "Mandarin", "Bergamot"],
    heartNotes: ["Portakal çiçeği", "Yasemin", "Lavandin"],
    baseNotes: ["Madagaskar vanilyası", "Amberwood", "Misk", "Sedir"],
  }),

  make(4, "tom-ford-ombre-leather", "TOM FORD", "Ombré Leather", "Unisex", "Odunsu", 8990, 7790, 3, {
    description:
      "Ombré Leather, çöl rüzgârını andıran deri notasıyla açılır; yasemin ve ylang-ylang yumuşak bir çiçek dokunuşu ekler. Siyah biberin keskinliği, alt notalardaki yosun ve kehribarla dengelenir. Cinsiyetsiz, güçlü ve sofistike bir karakter kokusu.",
    topNotes: ["Kardamon", "Pembe biber"],
    heartNotes: ["Yasemin sambac", "Deri", "Ylang-ylang"],
    baseNotes: ["Yosun", "Kehribar", "Odunsu akorlar"],
  }),

  make(5, "armani-acqua-di-gio", "GIORGIO ARMANI", "Acqua di Giò", "Erkek", "Meyveli", 5990, 5190, 4, {
    description:
      "Acqua di Giò, Ege’nin tuzlu esintisini limon ve bergamotla buluşturur. Deniz notaları ve yeşil taze yapraklar, jasmin ve gülün hafif dokunuşuyla yumuşar. Sedir ve misk, ferahlığı tüm güne yayar. Klasik, temiz ve zamansız bir erkek ferahlığı.",
    topNotes: ["Limon", "Bergamot", "Neroli"],
    heartNotes: ["Deniz notaları", "Yasemin", "Şeftali"],
    baseNotes: ["Beyaz misk", "Sedir", "Paçuli"],
  }),

  make(6, "lancome-la-vie-est-belle", "LANCÔME", "La Vie Est Belle", "Kadın", "Meyveli", 6250, 5350, 5, {
    description:
      "La Vie Est Belle, siyah frenk üzümü ve armutun tatlı kıvılcımıyla başlar; iris ve yasemin kalbinde zarif bir çiçek demeti sunar. Pralin ve vanilya alt notaları, kokuyu gülümseten, sıcak ve unutulmaz kılar. Mutluluğu ve zarafeti bir arada taşıyan ikonik bir kadın parfümü.",
    topNotes: ["Siyah frenk üzümü", "Armut"],
    heartNotes: ["Iris", "Yasemin", "Portakal çiçeği"],
    baseNotes: ["Pralin", "Vanilya", "Tonka fasulyesi", "Paçuli"],
  }),

  make(7, "prada-paradoxe", "PRADA", "Paradoxe", "Kadın", "Çiçeksi", 6790, 5990, 2, {
    isBestSeller: false,
    description:
      "Paradoxe, bergamot ve armutun kristal netliğiyle açılır; neroli ve yasemin kalbinde ışıldayan bir çiçek demeti yaratır. Amber ve beyaz misk, kokuyu modern, temiz ve uzun ömürlü kılar. Zıtlıkların uyumunu seven, çağdaş kadınlar için.",
    topNotes: ["Bergamot", "Armut", "Mercan"],
    heartNotes: ["Neroli", "Yasemin", "Turuncu çiçek"],
    baseNotes: ["Amber", "Beyaz misk", "Benzoin"],
  }),

  make(8, "gucci-guilty-elixir", "GUCCI", "Guilty Elixir", "Erkek", "Odunsu", 7590, 6890, 4, {
    description:
      "Guilty Elixir, aromatik lavanta ve baharatlı üst notalarla cesur bir giriş yapar. Gül ve paçuli kalbinde karanlık bir çekicilik; amber ve odunsu taban ise geceye yayılan kalıcı bir güç bırakır. Tutkulu ve sınır tanımayan bir erkek imzası.",
    topNotes: ["Lavanta", "Limon", "Pembe biber"],
    heartNotes: ["Gül", "Paçuli", "Fesleğen"],
    baseNotes: ["Amber", "Sedir", "Tonka", "Misk"],
  }),

  make(9, "burberry-goddess", "BURBERRY", "Goddess", "Kadın", "Oryantal", 6190, 5590, 0, {
    description:
      "Goddess, vanilyanın üç katmanlı yorumuyla öne çıkar: taze, kremsi ve fırınlanmış sıcaklık bir arada. Lavanta ve kakao, kokuya derin ve lüks bir dokunuş katar. Güçlü, kadınsı ve çağdaş bir tanrıça enerjisi arayanlar için.",
    topNotes: ["Lavanta", "Limon"],
    heartNotes: ["Kakao", "Lavanta absolute"],
    baseNotes: ["Vanilya", "Amber", "Misk"],
  }),

  make(10, "givenchy-gentleman-reserve", "GIVENCHY", "Gentleman Réserve Privée", "Erkek", "Oryantal", 6490, 5790, 3, {
    description:
      "Gentleman Réserve Privée, iris ve kestane’nin nadir birleşimiyle sofistike bir giriş yapar. Viski ve vanilyanın sıcaklığı, odunsu tabanla tamamlanır. Zarif, olgun ve özel günlere yakışan bir centilmen kokusu.",
    topNotes: ["Bergamot", "Armut"],
    heartNotes: ["Iris", "Kestane", "Gül"],
    baseNotes: ["Viski", "Vanilya", "Sedir", "Amber"],
  }),

  make(11, "calvin-klein-everyone", "CALVIN KLEIN", "CK Everyone", "Unisex", "Meyveli", 4290, 3690, 5, {
    stock: 0,
    description:
      "CK Everyone, portakal ve yuzu’nun parlak ferahlığıyla herkese hitap eden temiz bir koku sunar. Mavi lotus ve misk, hafif ve modern bir his bırakır. Günlük kullanıma uygun, unisex ve kolay sevilen bir seçim.",
    topNotes: ["Portakal", "Yuzu", "Bergamot"],
    heartNotes: ["Mavi lotus", "Fesleğen"],
    baseNotes: ["Misk", "Amberwood", "Sedir"],
  }),

  make(12, "chanel-bleu-de-chanel", "CHANEL", "Bleu de Chanel", "Erkek", "Odunsu", 7450, 6690, 4, {
    isBestSeller: true,
    isNew: false,
    description:
      "Bleu de Chanel, greyfurt ve limonun ferah kıvılcımıyla başlar; zencefil ve nane ile enerjik bir orta nota buluşur. Sedir, sandal ve labdanum, kokuyu zarif ve kalıcı bir erkek imzasına dönüştürür. Hem ofis hem akşam için kusursuz bir klasik.",
    topNotes: ["Greyfurt", "Limon", "Nane", "Pembe biber"],
    heartNotes: ["Zencefil", "Iso E Super", "Nutmeg"],
    baseNotes: ["Sedir", "Sandal ağacı", "Labdanum", "Beyaz misk"],
  }),

  make(13, "burberry-hero", "BURBERRY", "Hero", "Erkek", "Odunsu", 5890, 5290, 1, {
    isNew: false,
    description:
      "Hero, bergamot ve siyah biberin canlı açılışıyla dikkat çeker. Üç farklı sedir ağacı kalbinde güçlü ve modern bir odunsu karakter yaratır. Cesur, net ve çağdaş bir erkeklik ifadesi arayanlar için Burberry’nin güçlü yorumu.",
    topNotes: ["Bergamot", "Siyah biber"],
    heartNotes: ["Atlas sediri", "Virginia sediri", "Himalaya sediri"],
    baseNotes: ["Vetiver", "Amber", "Misk"],
  }),

  make(14, "calvin-klein-eternity-men", "CALVIN KLEIN", "Eternity for Men", "Erkek", "Çiçeksi", 3990, 3490, 5, {
    isNew: false,
    description:
      "Eternity for Men, lavanta ve mandalina ile taze bir giriş yapar; geranium ve adaçayı orta notada yeşil bir ferahlık sunar. Sedir ve sandal, kokuyu temiz ve zamansız kılar. Günlük kullanıma ideal, klasik ve güvenilir bir erkek parfümü.",
    topNotes: ["Lavanta", "Mandalina", "Limon"],
    heartNotes: ["Geranium", "Adaçayı", "Fesleğen", "Jasmin"],
    baseNotes: ["Sedir", "Sandal ağacı", "Amber", "Misk"],
  }),

  make(15, "paco-rabanne-1-million", "PACO RABANNE", "1 Million", "Erkek", "Oryantal", 5690, 4990, 0, {
    isBestSeller: true,
    isNew: false,
    description:
      "1 Million, greyfurt ve nane ile enerjik açılır; gül ve tarçın kalbinde gösterişli bir sıcaklık yaratır. Amber, deri ve odunsu notalar geceye yayılan çekici bir iz bırakır. Cesur, dikkat çekici ve partilere yakışan ikonik bir erkek kokusu.",
    topNotes: ["Greyfurt", "Nane", "Kan kaneli"],
    heartNotes: ["Gül", "Tarçın", "Baharatlı akorlar"],
    baseNotes: ["Amber", "Deri", "Beyaz odunlar", "Paçuli"],
  }),

  make(16, "prada-luna-rossa", "PRADA", "Luna Rossa", "Erkek", "Meyveli", 6290, 5590, 2, {
    isNew: false,
    description:
      "Luna Rossa, lavanta ve turuncu çiçeğin ferah birleşimiyle spor bir zarafet sunar. Adaçayı ve ambroxan, kokuyu modern ve dinamik kılar. Aktif yaşam tarzına uygun, temiz ve kalıcı bir erkek ferahlığı.",
    topNotes: ["Lavanta", "Turuncu çiçek"],
    heartNotes: ["Adaçayı", "Ambrette"],
    baseNotes: ["Ambroxan", "Misk", "Odunsu notalar"],
  }),

  make(17, "tom-ford-oud-wood", "TOM FORD", "Oud Wood", "Erkek", "Odunsu", 9490, 8490, 3, {
    isBestSeller: true,
    isNew: false,
    description:
      "Oud Wood, nadir oud ağacının dumanlı ve egzotik dokunuşunu gül ağacı ve kakule ile dengeler. Sandal ve vetiver alt notaları, kokuyu lüks, derin ve sofistike kılar. Niş zarafet arayanlar için Tom Ford’un efsanevi imzası.",
    topNotes: ["Gül ağacı", "Kakule", "Pembe biber"],
    heartNotes: ["Oud", "Sandal ağacı", "Vetiver"],
    baseNotes: ["Tonka fasulyesi", "Amber", "Vanilya"],
  }),

  make(18, "ysl-y-edp", "YVES SAINT LAURENT", "Y Eau de Parfum", "Erkek", "Odunsu", 6790, 5990, 1, {
    isBestSeller: true,
    isNew: false,
    description:
      "Y EDP, elma ve zencefilin canlı kıvılcımıyla açılır; adaçayı ve lavanta orta notada ferah bir güç katar. Sedır ve tonka, kokuyu modern ve kararlı bir erkek karakterine dönüştürür. Hem gündüz hem gece için çok yönlü bir favori.",
    topNotes: ["Elma", "Zencefil", "Bergamot"],
    heartNotes: ["Adaçayı", "Lavanta", "Geranium"],
    baseNotes: ["Sedir", "Tonka fasulyesi", "Vetiver", "Amberwood"],
  }),

  make(19, "valentino-uomo-born-in-roma", "VALENTINO", "Uomo Born in Roma", "Erkek", "Oryantal", 6590, 5890, 4, {
    isNew: false,
    description:
      "Uomo Born in Roma, viyolet yaprağı ve tuzlu akorlarla modern bir açılış yapar. Vetiver ve mineral notalar, Roma’nın gece ruhunu yansıtır. Şık, genç ve şehirli bir erkek imajı için Valentino’nun çağdaş yorumu.",
    topNotes: ["Viyolet yaprağı", "Tuzlu akor"],
    heartNotes: ["Lavanta"],
    baseNotes: ["Vetiver", "Mineral notalar"],
  }),

  make(20, "trussardi-uomo", "TRUSSARDI", "Uomo", "Erkek", "Odunsu", 4890, 4290, 5, {
    isNew: false,
    description:
      "Trussardi Uomo, limon ve bergamotun ferah açılışıyla İtalyan zarafetini taşır. Lavanta ve geranium orta notada klasik bir erkeklik sunar; sedir ve amber ise kalıcı bir bitiş bırakır. Günlük kullanıma uygun, zarif ve erişilebilir bir seçim.",
    topNotes: ["Limon", "Bergamot", "Nane"],
    heartNotes: ["Lavanta", "Geranium", "Adaçayı"],
    baseNotes: ["Sedir", "Amber", "Misk", "Tonka"],
  }),

  make(21, "philipp-plein-no-limits", "PHILIPP PLEIN", "No Limits", "Erkek", "Oryantal", 7190, 6490, 0, {
    isNew: true,
    description:
      "No Limits, baharatlı ve meyveli üst notalarla iddialı bir giriş yapar. Deri ve amber kalbinde güçlü bir karakter; odunsu taban ise uzun süre hissedilen bir iz bırakır. Sınır tanımayan, gösterişli ve cesur bir gece kokusu.",
    topNotes: ["Turunçgil", "Baharat", "Elma"],
    heartNotes: ["Deri", "Amber", "Gül"],
    baseNotes: ["Sedir", "Paçuli", "Misk", "Vanilya"],
  }),

  make(22, "clive-christian-no1-men", "CLIVE CHRISTIAN", "No.1 Men", "Erkek", "Oryantal", 12990, 11490, 3, {
    isNew: false,
    isBestSeller: false,
    description:
      "No.1 Men, nadir baharatlar ve egzotik çiçeklerin lüks birleşimidir. Gül, yasemin ve vanilya, odunsu ve amberli bir tabanla taçlanır. Kraliyet zarafetini andıran, koleksiyon değeri taşıyan ultra premium bir erkek parfümü.",
    topNotes: ["Bergamot", "Limon", "Kakule", "Hindistan cevizi"],
    heartNotes: ["Gül", "Yasemin", "Iris", "Baharatlı akorlar"],
    baseNotes: ["Vanilya", "Amber", "Sandal ağacı", "Misk"],
  }),

  make(23, "kilian-black-phantom", "KILIAN", "Black Phantom", "Erkek", "Oryantal", 10990, 9790, 1, {
    isNew: false,
    description:
      "Black Phantom, rom ve şeker kamışının karanlık tatlılığıyla açılır; kahve ve bitter çikolata kalbinde derin bir çekicilik yaratır. Sandal ve vanilya, kokuyu kadifemsi ve bağımlılık yapan bir gece imzasına dönüştürür. Lüks ve gizemli bir seçim.",
    topNotes: ["Rom", "Şeker kamışı"],
    heartNotes: ["Kahve", "Bitter çikolata", "Sandal ağacı"],
    baseNotes: ["Vanilya", "Şeker", "Amber"],
  }),

  make(24, "mfk-gentle-fluidity-silver", "MAISON FRANCIS KURKDJIAN", "Gentle Fluidity Silver", "Erkek", "Odunsu", 9890, 8890, 2, {
    isNew: false,
    description:
      "Gentle Fluidity Silver, ardıç ve hindistan cevizinin kristal netliğiyle açılır; amberwood ve misk modern bir akışkanlık katar. Minimal ama güçlü, temiz ve sofistike bir niş imza. Zarif sadelik arayanlar için MFK’nın ustalık işi.",
    topNotes: ["Ardıç", "Hindistan cevizi"],
    heartNotes: ["Amberwood", "Iso E Super"],
    baseNotes: ["Misk", "Odunsu akorlar"],
  }),

  make(25, "marfa-memoir", "MARFA", "Memoir", "Erkek", "Odunsu", 8290, 7490, 4, {
    isNew: true,
    description:
      "Memoir, çölün kuru esintisini andıran odunsu ve aromatik notalarla açılır. Deri ve amber dokunuşları, kokuya sıcak bir derinlik katar. Modern, karakterli ve az bilinen bir seçim arayanlar için Bee’nin özel önerisi.",
    topNotes: ["Bergamot", "Aromatik otlar"],
    heartNotes: ["Deri", "Lavanta", "Sedir"],
    baseNotes: ["Amber", "Misk", "Vetiver"],
  }),

  make(26, "opulent-shaik-gold", "OPULENT SHAIK", "Gold Edition", "Erkek", "Oryantal", 8790, 7890, 0, {
    isNew: true,
    description:
      "Gold Edition, turunçgil ve baharatın altın ışıltısıyla başlar; gül ve oud kalbinde Doğu’nun lüksünü yansıtır. Amber ve vanilya, kokuyu zengin ve kalıcı kılar. Gösterişli, sıcak ve unutulmaz bir oryantal erkek imzası.",
    topNotes: ["Bergamot", "Baharat", "Turunçgil"],
    heartNotes: ["Gül", "Oud", "Yasemin"],
    baseNotes: ["Amber", "Vanilya", "Misk", "Sedir"],
  }),
];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value);
