export interface GalleryItem {
  thumb: string;
  original: string;
}

//  Один відгук
export interface Review {
  reviewer_name: string;
  reviewer_rating: number;
  comment: string;
}

// Основний тип Camper
export interface Camper {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  description: string;

  форма?: string;
  form?: string;

  длина?: string;
  length?: string;

  ширина?: string;
  width?: string;

  высота?: string;
  height?: string;

  бак?: string;
  tank?: string;
  back?: string;

  расход?: string;
  consumption?: string;

  трансмиссия?: string;
  transmission?: string;

  двигатель?: string;
  engine?: string;

  кондиционер?: string | boolean;
  AC?: string | boolean;

  ванная?: string | boolean;
  bathroom?: string | boolean;

  кухня?: string | boolean;
  kitchen?: string | boolean;

  телевизор?: string | boolean;
  TV?: string | boolean;

  radio?: string | boolean;
  радио?: string | boolean;

  холодильник?: string | boolean;
  refrigerator?: string | boolean;

  "микроволновая печь"?: string | boolean;
  микроволновка?: string | boolean;
  microwave?: string | boolean;

  газ?: string | boolean;
  water?: string | boolean;

  галерея?: GalleryItem[];
  gallery?: GalleryItem[];

  reviews: Review[];
}
