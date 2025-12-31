import { createContext, useState } from "react";

export const ContactContext = createContext(); // ✅ exported

export const ContactProvider = ({ children }) => {
  const [data, setData] = useState([]);
  
  return (
    <ContactContext.Provider value={{ data, setData }}>
      {children}
    </ContactContext.Provider>
  );
};
