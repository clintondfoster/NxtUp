import AuthForm from "../components/authForm/AuthForm";
import { useLocation } from "react-router-dom";

export default function Login() {
   var location = useLocation();

   function oauthRedirect() {
      const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
      const qParams = {
         client_id:
            "392482149502-nhmjmarp8hj2de00t088096bvc31cpim.apps.googleusercontent.com",
         redirect_uri: "http://localhost:3000/oauthhandler",
         response_type: "token",
         scope: "openid email",
      };
      window.location.href = `${baseUrl}?${new URLSearchParams(
         qParams
      ).toString()}`;
   }

   return (
      <div className="login-container">
         <div><AuthForm /></div>
         <div></div>
         <div>
            <button onClick={oauthRedirect}>Press</button>
         </div>
      </div>
   );
}
