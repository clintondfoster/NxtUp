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
  // const [passwordRequirements, setPasswordRequirements] = useState([
  //    {
  //       description: "At least 7 characters",
  //       test: (pass) => pass.length >= 7,
  //       met: false,
  //    },
  //    {
  //       description: "Contains a number",
  //       test: /\d/.test.bind(/\d/),
  //       met: false,
  //    },
  //    {
  //       description: "Contains a capital letter",
  //       test: /[A-Z]/.test.bind(/[A-Z]/),
  //       met: false,
  //    },
  // ]);

  // const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const authType = view === "login" ? "Login" : "Create Account";
  const navigate = useNavigate();

  const oppositeAuthCopy =
    view === "login" ? "Don't have an account?" : "Already have an account?";
  const oppositeAuthType = view === "login" ? "Create Account" : "Login";

  // function checkPasswordStrength(pass) {
  //    setPasswordRequirements((prevReqs) =>
  //       prevReqs.map((req) => ({
  //          ...req,
  //          met: req.test(pass),
  //       }))
  //    );
  // }

  /**
   * Send credentials to server for authentication
   */
  async function attemptAuth(event) {
    event.preventDefault();
    setError(null);

    if (view === "register" && password !== confirmPassword) {
      setError("Passwords must match. Please try again.");
      return;
    }

    // if (
    //    !validator.isStrongPassword(password, {
    //       minLength: 7,
    //       minUppercase: 1,
    //       minNumbers: 1,
    //       minSymbols: 0,
    //       returnScore: false,
    //       pointsPerUnique: 1,
    //       pointsPerRepeat: 0.5,
    //       pointsForContainingLower: 10,
    //       pointsForContainingUpper: 10,
    //       pointsForContainingNumber: 10,
    //       pointsForContainingSymbol: 10,
    //    })
    // )
    //  {
    //    setError(
    //      "Password should contain an uppercase letter, a number, and be at least 7 characters long"
    //    );
    //    return;
    //  }

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
            navigate(`/home`);
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
            {/* <h2>{authType}</h2> */}

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
                  checkPasswordStrength(value);
                  if (error) {
                    setError(null);
                  }
                }}
              />
              {view === "register" && (
                <>
                  {/* <div className="password-requirements">
                              {passwordRequirements
                                 .filter((req) => !req.met)
                                 .map((req, index) => (
                                    <div key={index}>{req.description}</div>
                                 ))}
                           </div> */}
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
