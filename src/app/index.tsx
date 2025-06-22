import ReactDOM from "react-dom/client";
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import StoreProvider from "@/app/StoreProvider/StoreProvider";
import AppRouter from "./router/AppRouter";
import { Header } from "@/widgets/Header";
import "./styles/global.scss";
import "./styles/fonts.scss";
import Footer from "@/widgets/Footer/UI/Footer";
import { startMirage } from "@/shared/api/mock/config";
import { ThemeProvider } from "@/shared/lib/theme";

const App = () => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      startMirage();
    }
  }, []);

  return (
    <StoreProvider>
      <ThemeProvider> 
        <div className="App">
          <BrowserRouter>
            <Header />
            <AppRouter />
            <Footer />
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </StoreProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
