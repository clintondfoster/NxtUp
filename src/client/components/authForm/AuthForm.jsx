import { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../../reducers/auth";
import { useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import validator from "validator";
import logo from "../../assets/upnxtlogo.png";
import "./Auth.scss";
/**
 * AuthForm allows a user to either login or register for an account.
 */
function AuthForm() {
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("initial");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  const authType = view === "login" ? "Login" : "Create Account";
  const navigate = useNavigate();

  const oppositeAuthCopy =
    view === "login" ? "Don't have an account?" : "Already have an account?";
  const oppositeAuthType = view === "login" ? "Create Account" : "Login";

 
  async function attemptAuth(event) {
    event.preventDefault();
    setError(null);

    if (view === "register" && password !== confirmPassword) {
      setError("Passwords must match. Please try again.");
      return;
    }

  
    const authMethod = view === "login" ? login : register;
    const credentials =
      view === "login" ? { password, email } : { password, email, username };

    try {
      setLoading(true);
      const result = await authMethod(credentials).unwrap();
      setLoading(false);
      if (result && result.user && result.user.userId) {
        if (view === "login") {
          //redirect login users to home page
          navigate(`/home`);
        } else {
          setMessage("Successfully registered! Redirecting...");
          setTimeout(() => {
            (`/home`);
          }, 2000);
        }
      } else {
        throw new Error("User data not received");
      }
    } catch (error) {
      setError(error.data);
    }
  }

  return (
    <section className="auth-container">
      <img className="login-logo" src={logo} />
      <div className="form">
        {view === "initial" && (
          <div>
            <button className="signupBtn" onClick={() => setView("register")}>
              Sign Up
            </button>
            <div className="small-button">
              <button className="signupBtn" onClick={() => setView("login")}>
                Sign In
              </button>
            </div>
          </div>
        )}

        {(view === "login" || view === "register") && (
          <>

            <form className="inputAuth" onSubmit={attemptAuth} name={authType}>
              <TextInput
                type="email"
                placeholder="Email..."
                vl={email}
                chg={setEmail}
              />
              <TextInput
                placeholder="Password..."
                type="password"
                vl={password}
                chg={(value) => {
                  setPassword(value);
                  if (error) {
                    setError(null);
                  }
                }}
              />
              {view === "register" && (
                <>
                  <TextInput
                    placeholder="Confirm Password..."
                    type="password"
                    vl={confirmPassword}
                    chg={(value) => {
                      setConfirmPassword(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                  />
                  <TextInput
                    placeholder="Username..."
                    type="text"
                    vl={username}
                    chg={setUsername}
                  />
                </>
              )}
              <button type="submit" className="signupBtn">{authType}</button>
            </form>

            <p>
              {oppositeAuthCopy}{" "}
              <a
                onClick={() => setView(view === "login" ? "register" : "login")}
              >
                {oppositeAuthType}
              </a>
            </p>
            {message && <p>{message}</p>}
            {loading && <p>Logging in...</p>}
            {error && <p>{error}</p>}
          </>
        )}
      </div>
    </section>
  );
}

export default AuthForm;
