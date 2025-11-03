import { useEffect, useState } from "react";

export default function App() {
  const [msg, setMsg] = useState("loading...");

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((r) => r.json())
      .then((data) => setMsg(data.message))
      .catch((e) => setMsg("fetch error: " + e.message));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>🌎 GreenMap</h1>
      <p>Backend says: <b>{msg}</b></p>
    </div>
  );
}
