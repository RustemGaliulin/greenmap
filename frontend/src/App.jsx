import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>🌎 GreenMap</h1>
      <p><Link to="/login">Sign In</Link> | <Link to="/register">Sign Up</Link></p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  );
}
