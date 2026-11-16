import { Product } from '../types/product';
import { Collection } from '../types/collection';

// Initially empty catalog — all products will be added by the admin
export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-couples',
    slug: 'couples-collection',
    title: 'Couples Collection',
    subtitle: 'Coordinated palettes & matching festive aesthetics',
    description: 'Harmonious style for two. Explore coordinated ethnic ensembles, complementing vacation linen sets, and matching couple fashion curated for festivals, weddings, and special events.',
    imageUrl: '/images/couples-collection.jpg',
    gender: 'all',
    featured: true,
  },
];
