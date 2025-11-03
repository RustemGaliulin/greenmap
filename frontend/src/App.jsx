import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-100 text-xl">
      <h1 className="font-bold text-3xl mb-4 text-green-800">🌎 GreenMap</h1>
      <p className="text-gray-700">{message}</p>
    </div>
  );
}

export default App;
