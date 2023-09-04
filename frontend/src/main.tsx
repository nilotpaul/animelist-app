import * as ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { store } from "./redux/store.ts";

import "./globals.css";
import "remixicon/fonts/remixicon.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
        <Toaster />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);
