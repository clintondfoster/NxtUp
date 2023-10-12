import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {

  return (
    <div className="App">
   <Routes> 
      <Route path="/home" element={<Home />} />
    </Routes>
    </div>
  );
}

export default App;
