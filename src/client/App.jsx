import { useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthForm from "./components/authForm/AuthForm";
import { useMeQuery } from "./reducers/auth";

function App() {
  const me = useSelector((state) => state.auth.credentials);
  const { data, isLoading, error } = useMeQuery();

  const storedToken = window.sessionStorage.getItem("credentials");
  // let decodedToken = null;

  console.log("Me in app", me);

  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<AuthForm />} />
        {/* <Route path="/me"  */}
      </Routes>
    </div>
  );
}

export default App;
