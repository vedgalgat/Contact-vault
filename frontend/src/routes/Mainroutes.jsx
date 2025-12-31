import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ContactList from "../pages/ContactList";
import ProtectedRoute from "../routes/protucatedRoute";
import AddContact from "../pages/AddContact";
import { Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const Mainroutes = () => {
  const token = localStorage.getItem("token");  
  return (
    <Routes>

      <Route
        path="/"
        element={
          token ? <Navigate to="/contacts" replace /> : <Navigate to="/signup" replace />
        }
      />



      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/add-contact"
        element={
          <ProtectedRoute>
            <Navbar />
            <AddContact />

          </ProtectedRoute>
        }
      />
        <Route
    path="/contacts"
    element={
      <ProtectedRoute>
        <Navbar />
        <ContactList />
      </ProtectedRoute>
    }
  />
    </Routes>
  );
};

export default Mainroutes;
