import { faker } from "@faker-js/faker";
import { MovieType } from "@/entities/Movie";

export function generateMockMovies(count: number): MovieType[] {
  const genres = ["Драмы", "Триллеры", "Боевики", "Комедии"];
  const countries = ["Россия", "США", "Франция", "Бельгия"];
  const genre = faker.helpers.arrayElement(genres);
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    title: faker.lorem.words(faker.number.int({ min: 1, max: 3 })),
    priceBadge: faker.helpers.arrayElement(["Подписка", "Бесплатно"]),
    rating: faker.number
      .float({ min: 5, max: 10, fractionDigits: 1 })
      .toFixed(1),
    description: {
      year: `${faker.number.int({ min: 2022, max: 2025 })}`,
      genre: faker.helpers.arrayElement(genres),
      country: faker.helpers.arrayElement(countries),
    },

    imageUrl: `/posters/filmCard${(i % 10) + 1}.jpeg`,
    url: faker.helpers.slugify(
      faker.lorem.words(faker.number.int({ min: 1, max: 2 }))
    ),
  }));
}

export const sampleMovies: MovieType[] = [
  {
    id: "1",
    title: "Горячая болезнь",
    priceBadge: "Подписка",
    rating: "7.7",
    description: {
      year: "2025",
      genre: "прикол",
      country: "США",
    },
    imageUrl: `/posters/filmCard1.jpg`,
    url: "goryachaya-bolezn",
  },
  {
    id: "2",
    title: "Высокие отношения",
    priceBadge: "Подписка",
    rating: "8.9",
    description: {
      year: "2011",
      genre: "драма",
      country: "Франция",
    },
    imageUrl: `/posters/filmCard2.jpg`,
    url: "vysokie-otnosheniya",
  },
  {
    id: "3",
    title: "Воздушный переводчик воздушный переводчик",
    priceBadge: "Бесплатно",
    rating: "5.1",
    description: {
      year: "2016",
      genre: "Боевик",
      country: "Бельгия",
    },
    imageUrl: `/posters/filmCard3.jpg`,
    url: "vozdushnyj-perevodchik-vozdushnyj-perevodchik",
  },
];
