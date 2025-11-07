import { Link, useNavigate } from "react-router-dom";

export default function Main({ children, isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-blue-700 cursor-pointer"
          >
            🌿 GreenMap
          </h1>

          <nav className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/user"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition"
                >
                  My Page
                </Link>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>


      <main className="flex-1 container mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
          {children || "🌍 Main content area (coming soon)"}
        </div>
      </main>


      <footer className="bg-gray-800 text-gray-300 text-sm py-4 mt-auto">
        <div className="container mx-auto px-6 text-center">
          © {new Date().getFullYear()} GreenMap. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
