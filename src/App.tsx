// Routing import
import { Routes, Route } from "react-router";
// Page imports
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Signup } from "./pages/Signup";
// Component imports
import { Navbar } from "./components/Navbar";
import { ProtectedRoute, PublicRoute } from "./components/UserRouting";
import { ListingDetail } from "./pages/ListingDetail";

function App() {
  return (
    <main className="pt-[85px] font-serif">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route path="/listing/:id" element={<ListingDetail />} />
      </Routes>
    </main>
  );
}

export default App;
