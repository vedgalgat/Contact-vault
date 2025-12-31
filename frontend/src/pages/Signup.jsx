import React, { useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { toast } from 'react-toastify';


function Signup() {
  const [formdata, setformdata] = useState({
    name: "",
    password: "",
    email: "",
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
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Signup Successful ||Mail Sent 🎉", {
        style: {
          background: "black",
          color: "red"
        }
      });

      console.log("Signup Response:", response.data);

      setformdata({
        name: "",
        email: "",
        password: "",
      });
    }

    catch (error) {
      if (error.response) {
        alert("Signup Failed: " + error.response.data.message);
      }
    };
  }



  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 text-white px-4">
      <div className="bg-gray-900 p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-yellow-400">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formdata.name}
              onChange={handleChange}
              autoComplete="off"
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formdata.email}
              onChange={handleChange}
              autoComplete="off"
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formdata.password}
              onChange={handleChange}
              autoComplete="off"
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-yellow-300 hover:text-black rounded-lg font-semibold text-white transition duration-400"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-base text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-red-700 hover:underline cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Signup;
