import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import HelpRequest from "./pages/HelpRequest";
import MechanicList from "./pages/MechanicList";
import MechanicDashboard from "./pages/MechanicDashboard";
import ChatPage from "./pages/ChatPage";
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes for all logged-in users */}
        <Route
          path="/help"
          element={
            <PrivateRoute>
              <HelpRequest />
            </PrivateRoute>
          }
        />
        <Route
          path="/mechanics"
          element={
            <PrivateRoute>
              <MechanicList />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />

        {/* Protected route for mechanics only */}
        <Route
          path="/dashboard/mechanic"
          element={
            <PrivateRoute>
              <RoleRoute role="mechanic">
                <MechanicDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>
    </>
  );
};

export default App;
