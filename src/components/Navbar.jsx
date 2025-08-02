import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        RoadResQ 🚗
      </Link>

      <div className="space-x-4">
        {!user && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
          </>
        )}

        {user?.role === "user" && (
          <>
            <Link to="/help" className="text-gray-700 hover:text-blue-600">Get Help</Link>
            <Link to="/mechanics" className="text-gray-700 hover:text-blue-600">Mechanics</Link>
            <Link to="/chat" className="text-gray-700 hover:text-blue-600">Chat</Link>
          </>
        )}

        {user?.role === "mechanic" && (
          <>
            <Link to="/dashboard/mechanic" className="text-gray-700 hover:text-blue-600">Mech Dashboard</Link>
            <Link to="/chat" className="text-gray-700 hover:text-blue-600">Chat</Link>
          </>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline ml-2"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
