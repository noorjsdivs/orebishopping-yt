import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import Users from "./pages/Users";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/Analytics";
import Inventory from "./pages/Inventory";
import Invoice from "./pages/Invoice";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import ApiDocumentation from "./pages/ApiDocumentation";
import Contacts from "./pages/Contacts";

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <main className="bg-gray-50 min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen">
                <Navbar />
                <div className="flex w-full">
                  <div className="w-16 sm:w-64 lg:w-72 fixed min-h-screen border-r-2 z-10">
                    <Sidebar />
                  </div>
                  <div className="flex-1 px-3 sm:px-5 py-2 ml-16 sm:ml-64 lg:ml-72">
                    <ScrollToTop />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/add" element={<Add token={token} />} />
                      <Route path="/list" element={<List token={token} />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/brands" element={<Brands />} />
                      <Route
                        path="/orders"
                        element={<Orders token={token} />}
                      />
                      <Route path="/users" element={<Users token={token} />} />
                      <Route path="/contacts" element={<Contacts />} />
                      <Route path="/invoice" element={<Invoice />} />
                      <Route path="/api-docs" element={<ApiDocumentation />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
