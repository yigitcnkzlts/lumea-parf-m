export const brands = [
  "BURBERRY",
  "CALVIN KLEIN",
  "CHANEL",
  "CLIVE CHRISTIAN",
  "DIOR",
  "GIORGIO ARMANI",
  "GIVENCHY",
  "GUCCI",
  "KILIAN",
  "LANCÔME",
  "MAISON FRANCIS KURKDJIAN",
  "MARFA",
  "OPULENT SHAIK",
  "PACO RABANNE",
  "PHILIPP PLEIN",
  "PRADA",
  "TOM FORD",
  "TRUSSARDI",
  "VALENTINO",
  "YVES SAINT LAURENT",
] as const;

export type Brand = (typeof brands)[number];
