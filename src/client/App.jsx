import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthForm from "./components/authForm/AuthForm";

function App() {

  return (
    <div className="App">
   <Routes> 
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<AuthForm />} />
    </Routes>
    </div>
  );
}

export default App;
