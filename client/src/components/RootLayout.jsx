import Header from "./Header";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import "slick-carousel/slick/slick.css";
import { Provider } from "react-redux";
import { persistor, store } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import MainLoader from "./MainLoader";
import ServicesTag from "./ServicesTag";

const RootLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<MainLoader />} persistor={persistor}>
        {/* Premium Support Badge */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 text-center text-sm font-medium shadow-sm">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span>💖</span>
            <span>Support this project & get the premium source code!</span>
            <a
              href="https://buymeacoffee.com/reactbd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200 text-xs font-semibold"
            >
              ☕ Buy Me a Coffee
            </a>
          </div>
        </div>
        <Header />
        <ScrollRestoration />
        <Outlet />
        <ServicesTag />
        <Footer />
        <ScrollToTop />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#ffffff",
            },
          }}
        />
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;
