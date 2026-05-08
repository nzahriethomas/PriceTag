// Routing import
import { Routes, Route } from "react-router";
// Page imports
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Signup } from "./pages/Signup";
// Component imports
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <main className="pt-[85px]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </main>
  );
}

export default App;
