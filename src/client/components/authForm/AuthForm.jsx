import { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../../reducers/auth";
import { useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import logo from "../../assets/upnxtlogo.png";
import "./Auth.scss";
import { validateEmail, validatePassword } from "./Validator";

/**
 * AuthForm allows a user to either login or register for an account.
 */
function AuthForm() {
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [error, setError] = useState(null);
  const [view, setView] = useState("initial");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  const authType = view === "login" ? "Login" : "Create Account";

  const navigate = useNavigate();

  const oppositeAuthCopy =
    view === "login" ? "Don't have an account?" : "Already have an account?";
  const oppositeAuthType = view === "login" ? "CREATE ACCOUNT" : "LOGIN";

  async function attemptAuth(event) {
    event.preventDefault();
    setError(null);
    setMessage("");
    setIsSubmitting(true);

    // Perform email and password validation
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (view === "register" && password !== confirmPassword) {
      setError("Passwords must match. Please try again.");
      return;
    }

    const credentials =
      view === "login" ? { password, email } : { password, email, username };

    const authMethod = view === "login" ? login : register;

    try {
      const result = await authMethod(credentials).unwrap();
      setIsSubmitting(false);
     
      if (result && result.user && result.user.userId) {
        setMessage(
          view === "login" ? "Login successful!" : "Registration successful!"
        );
        setTimeout(() => {
          navigate(`/home`, { replace: true });
        }, 2000);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.data && error.data.error) {
        setError(error.data.error);
      } else {
        setError("An unexpected error occured. Please try again later.");
      }
    }
  }

  return (
    <section className="auth-container">
      <img className="login-logo" src={logo} />
      {message && <p>{message}</p>}
      {isSubmitting && <p>Logging in...</p>}
      {error && <p>{error}</p>}
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
              <button type="submit" className="signupBtn">
                {authType}
              </button>
            </form>

            <p>
              {oppositeAuthCopy}{" "}
              <a
                onClick={() => setView(view === "login" ? "register" : "login")}
              >
                {oppositeAuthType}
              </a>
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export default AuthForm;
