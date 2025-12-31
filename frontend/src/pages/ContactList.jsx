import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ContactContext } from "../context/ContactContext";

const ContactList = () => {
  const context = useContext(ContactContext);

  if (!context) {
    return <h2 className="text-white text-center">Context not found</h2>;
  }

  const { data, setData } = context;
  const [selectedContact, setSelectedContact] = useState(null);

  // ✅ GET CONTACTS
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:3000/api/contacts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data);
      } catch (err) {
        console.error(err.response?.data);
        toast.error("Failed to fetch contacts");
      }
    };

    fetchContacts();
  }, [setData]);

  // ✅ DELETE CONTACT
  const handleDelete = async (contact) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:3000/api/contacts/${contact._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prev) =>
        prev.filter((c) => c._id !== contact._id)
      );

      toast.success("Contact deleted");
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Delete failed");
    }
  };

  // ✅ EDIT CONTACT
  const handleEdit = async (contact) => {
    const name = prompt("Enter new name", contact.name);
    const email = prompt("Enter new email", contact.email);
    const mobile = prompt("Enter new mobile", contact.mobile);

    if (!name || !email || !mobile) {
      toast.error("All fields required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:3000/api/contacts/${contact._id}`,
        { name, email, mobile },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prev) =>
        prev.map((c) =>
          c._id === contact._id ? res.data : c
        )
      );

      toast.success("Contact updated")
      
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Update failed");
    }
  };

  const handleClose = () => setSelectedContact(null);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);


  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">


        {/* HEADER */}
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold mb-12
        bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
          📇 Contact Vault
        </h1>
        {/* MODAL */}
        {selectedContact && (
          <div
            className="fixed inset-0  bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-[90%] max-w-md p-6  rounded-2xl
            bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-5 text-xl text-red-400 hover:text-red-500"
              >
                ✖
              </button>

              <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                {selectedContact.name}
              </h2>

              <p className="text-sm sm:text-base text-gray-200 break-all">
                📧 {selectedContact.email}
              </p>
              <p className="mt-2 text-lg text-green-400">
                📱 {selectedContact.mobile}
              </p>
            </div>
          </div>
        )}

        {/* CONTACT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.length === 0 ? (
            <p className="col-span-full text-center text-red-400 text-lg">
              No contacts available
            </p>
          ) : (

            data?.map((contact) => (
              <div
                key={contact._id}
                onClick={() => setSelectedContact(contact)}
                className="
              relative p-6 rounded-2xl cursor-pointer
              bg-white/10 backdrop-blur-xl
              border border-white/20
              hover:border-cyan-400
              transition-all duration-300
              hover:-translate-y-2 hover:shadow-cyan-500/30 shadow-xl"
              >

                <h2 className="text-xl sm:text-2xl xl:text-2xl 
               font-bold text-yellow-300 mb-3">
                  <span className="text-red-500">Name :</span> {contact.name}
                </h2>


                <p className="text-base sm:text-lg lg:text-xl xl:text-1.5xl 
              text-gray-200 break-all font-medium">
                  <span className="bg-red-900 rounded-2xl text-2xl">🕊️</span> {contact.email}
                </p>

                <p className="text-base sm:text-lg mt-3">
                  <span className="text-2xl bg-white rounded-4xl p-1">📱</span> <span className="mx-5 text-green-600 font-semibold text-2xl sm:text-base">{contact.mobile}</span>
                </p>


                {/* ACTION BUTTONS */}
                <div className="flex justify-between mt-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(contact);
                    }}
                    className="px-4 py-1.5 text-sm rounded-full
                  bg-green-500/10 text-green-300 
                  hover:bg-green-500 hover:text-black cursor-pointer
                  transition font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact);
                    }}
                    className="px-4 py-1.5 text-sm rounded-full
                  bg-red-500/50 text-red-100 
                  hover:bg-red-500 hover:text-white cursor-pointer  
                  transition font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

};

export default ContactList;
