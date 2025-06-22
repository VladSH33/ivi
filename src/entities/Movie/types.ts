export interface MovieType {
  id: string;
  title: string;
  priceBadge: string;
  rating: string;
  description: {
    year: string;
    genre: string;
    country: string;
  };
  imageUrl: string;
  url: string;
}
