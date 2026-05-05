import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ItineraryView from "./components/trips/ItineraryView";

// Public pages
import Home      from "./pages/HomePage";
import Login     from "./pages/LoginPage";
import Register  from "./pages/RegisterPage";

// Protected pages
import Dashboard  from "./pages/DashboardPage";
import SavedTrips from "./pages/SavedTripsPage";
import Profile    from "./pages/ProfilePage";

const App = () => {
  return (
    <BrowserRouter>
      {/*
        AuthProvider wraps the entire tree so every page and component
        can access auth state via useAuth() without prop drilling.
      */}
      <AuthProvider>
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Protected routes (requires JWT) ── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/saved-trips" element={<SavedTrips />} />
            <Route path="/profile"     element={<Profile />} />
            <Route path="/trips/:id" element={<ItineraryView />} />
          </Route>

          {/* ── Fallback: unknown paths → home ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;