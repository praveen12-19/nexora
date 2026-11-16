export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  gender?: 'men' | 'women' | 'all';
  categoryFilter?: string[];
  isTrending?: boolean;
  featured?: boolean;
}
