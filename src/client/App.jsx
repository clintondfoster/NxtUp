import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import jwtDecode from "jwt-decode";
// import { useDispatch } from "react-redux";
// import { setGroupId } from "./reducers/api";
import Results from "./pages/Results";
import QuestionPage from "./pages/QuestionPage";

function App() {
  // const dispatch = useDispatch();
  const storedToken = window.sessionStorage.getItem("credentials");
  let decodedToken = null;

  // useEffect(() => {
  //   const storedGroupId = window.sessionStorage.getItem("currentGroupId");
  //   if (storedGroupId) {
  //     dispatch(setGroupId(Number(storedGroupId)));
  //   }
  // }, [dispatch]);

  if (storedToken) {
    decodedToken = jwtDecode(storedToken);
  }

  const loggedIn = decodedToken?.id;

  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={loggedIn ? <Home /> : <Login />} />
        <Route index element={<Login />} />
        <Route path="/results/:accessCode" element={<Results />} />
        <Route path="/question/:questionId" element={<QuestionPage />} />
      </Routes>
    </div>
  );
}

export default App;
