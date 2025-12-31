import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { ContactContext } from "../context/ContactContext";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

const AddContact = () => {
  const { data, setData } = useContext(ContactContext);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [mobile, setMobile] = useState("+91");

  useEffect(() => {
    setValue("mobile", mobile);
  }, [mobile, setValue]);

  const submit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/contacts/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData([...data, res.data]);
      reset();
      setMobile("+91");

      toast.success("Contact saved successfully", {
        style: { background: "#272727", color: "white" },
      });
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save contact", {
        style: { background: "#272727", color: "white" },
      });
    }
  };

  return (
    <div className="flex justify-center items-center pt-20 sm:pt-20 px-4 sm:px-0 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%] p-6 sm:p-8 rounded-3xl border border-white/20 backdrop-blur-xl bg-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-cyan-300 mb-10 bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 text-transparent">
          ➕ Add New Contact
        </h1>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-3">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-white font-semibold mb-2 text-lg sm:text-xl">
              Name 👤
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Enter name"
              className="text-yellow-300 w-full p-4 text-base sm:text-lg text-gray-900 rounded-xl bg-white/30 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-md transition"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-white font-semibold mb-2 text-lg sm:text-xl">
              Email 📩
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="Enter email"
              className=" text-yellow-300 w-full p-4 text-base sm:text-lg text-gray-900 rounded-xl bg-white/30 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-md transition"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile */}
          <div className="flex flex-col">
            <label className="text-white font-semibold mb-2 text-lg sm:text-xl">
              Mobile 📞
            </label>
            <input
              {...register("mobile", {
                required: "Mobile number is required",
                minLength: { value: 13, message: "Enter valid Indian number" },
              })}
              value={mobile}
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9+]/g, "");
                if (!value.startsWith("+91")) value = "+91";
                setMobile(value.slice(0, 13));
              }}

              placeholder="+91XXXXXXXXXX"

              className="text-yellow-300 w-full p-4 text-base sm:text-lg text-gray-900 rounded-xl bg-white/30 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-md transition"
            />
            {errors.mobile && (
              <p className="text-red-400 text-sm mt-1">{errors.mobile.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-cyan-500 to-pink-500 hover:scale-105 transition-all text-white text-lg sm:text-xl py-3 rounded-2xl shadow-lg hover:shadow-cyan-500/50 font-bold"
          >
            Save 💾
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContact;
