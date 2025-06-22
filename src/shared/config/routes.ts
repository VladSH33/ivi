import Main from "@/pages/main/UI/Main";
import { Movie } from "@/pages/Movie";
import { Movies } from "@/pages/Movies";
import { LoginPage } from "@/pages/login/LoginPage";
import { ProfilePage } from "@/pages/Profile";
import { SearchPage } from "@/features/MovieSearch";
import { SupportPage } from "@/pages/Support";

export const publicRoutes = [
  { path: "/", component: Main },
  { path: "/movie/:name", component: Movie },
  { path: "/movies", component: Movies },
  { path: "/search", component: SearchPage },
  { path: "/login", component: LoginPage },
];

export const privateRoutes = [
  { path: "/profile", component: ProfilePage },
  { path: "/support", component: SupportPage },
];
