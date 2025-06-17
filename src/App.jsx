import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddTransaction from "./pages/AddTransaction";
import Dashboard from "./pages/Dashboard"; // 
import AddCategory from "./pages/AddCategory"; 
import Profile from "./pages/Profile";



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Add route */}
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
