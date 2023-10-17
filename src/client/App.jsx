import { useState } from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResultsCode from "./components/inputs/ResultsCode";
import jwtDecode from "jwt-decode";

function App() {
  const storedToken = window.sessionStorage.getItem("credentials");
  let decodedToken = null;
  if (storedToken) {
    decodedToken = jwtDecode(storedToken);
  }

  const loggedIn = decodedToken?.id;

  if (storedToken) {
    decodedToken = jwtDecode(storedToken);
  }
  return (
    <div className="App">
      <Routes>
      <Route
          path="/home"
          element={ loggedIn ? <Home /> : <Login/> }
        />
      <Route
         index
          element={<Login/>}
        />
        <Route path="results/:code" element={<ResultsCode/> }/>
       
      </Routes>
    </div>
  );
}

export default App;
