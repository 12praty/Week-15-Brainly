import Dashboard from "./pages/Dashboard";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { LandingPage } from "./pages/LandingPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
