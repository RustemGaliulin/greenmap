import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthForm from "./pages/AuthForm";

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
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />
      </Routes>
    </BrowserRouter>
  );
}
