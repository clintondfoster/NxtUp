import AuthForm from "./AuthForm";
import { useLocation } from "react-router-dom";
import "./Auth.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

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
    <div className="login">
      <div>
        <AuthForm />
      </div>
      <div className="hr-sect">or continue with</div>

      <div className="google-box">
        <div className="gg-box">
          <div className="google" onClick={oauthRedirect}>
            <FontAwesomeIcon icon={faGoogle} />
          </div>
        </div>
      </div>
      <p className="by">
        {" "}
        By clicking Sign Up or continue with Google, you agree to our Terms &
        Conditions
      </p>
    </div>
  );
}
