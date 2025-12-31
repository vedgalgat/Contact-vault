  import React from "react";
  import { BrowserRouter } from "react-router-dom";
  import Mainroutes from "./routes/Mainroutes";
  import { ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import "./context/ContactContext"
  import{ ContactProvider} from "./context/ContactContext";
  

  
  function App() {

    return (
      <BrowserRouter>
     
        <ContactProvider>
          <Mainroutes />

          {/* Toast */}
          <ToastContainer
            position="top-center"
            autoClose={2000}
            theme="dark"
            
          />
        </ContactProvider>
      </BrowserRouter>
    );
  }

  export default App;
