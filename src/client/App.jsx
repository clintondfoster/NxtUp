import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/authForm/Login";
import GroupPage from "./pages/GroupPage";
import QuestionPage from "./pages/QuestionPage";
import OAuthHandler from "./pages/OAuthHandler";
import Leaderboard from "./pages/Leaderboard";
import Navbar from "./components/Navbar/Navbar";
import DisplaySubmissions from "./pages/DisplaySubmissions";
import { useSelector } from "react-redux";
import AccountSettings from "./pages/AccountSettings";

export default function App() {
   const token = useSelector((state) => state.auth.credentials.token);
   const signupView = (
      <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/oauthhandler" element={<OAuthHandler />} />
      </Routes>
   );

   const loggedInView = (
      <div>
         <Navbar />
         <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/group/:accessCode" element={<GroupPage />} />
            <Route path="/question/:questionId" element={<QuestionPage />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route
               path="/question/:questionId/leaderboard"
               element={<Leaderboard />}
            />
            {/* <Route path="/question/:id/submit" element={<SubmitLink />} /> */}
            <Route
               path="/question/:questionId/submissions"
               element={<DisplaySubmissions />}
            />
            <Route path="/oauthhandler" element={<OAuthHandler />} />
         </Routes>
      </div>
   );

   return token ? loggedInView : signupView;
}
