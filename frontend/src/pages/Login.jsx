import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../services/axios";

function Login() {
  const navigate = useNavigate(); // ✅ ADD

  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/users/login",
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ TOKEN SAVE
      localStorage.setItem("token", response.data.token);

      toast.success("Login Successful 🎉", {
        style: {
          background: "black",
          color: "red",
        },
      });

      console.log("Login Response:", response.data);

      // ✅ REDIRECT TO CONTACT BOOK
      navigate("/add-contact");

      setformdata({
        email: "",
        password: "",
      });
    } catch (error) {
      if (error.response) {
        alert("Login Failed: " + error.response.data.message);
      } else {
        alert("Login Failed: " + error.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute top-10 left-10 sm:left-32 w-32 h-32 bg-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 sm:right-32 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Card */}
      <div className="relative z-10 bg-gray-900/40 backdrop-blur-lg border border-pink-500/20 
        rounded-2xl shadow-[0_0_40px_-10px_rgba(236,72,153,0.4)] w-full max-w-md 
        p-6 sm:p-10 lg:p-14"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 
          bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-gray-900/60 text-white rounded-lg 
                border border-pink-500/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-white">Password</label>
            <input
              type="password"
              name="password"
              value={formdata.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-gray-900/60 text-white rounded-lg 
                border border-pink-500/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 
              hover:opacity-90 rounded-lg font-semibold text-white shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-pink-400 hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
