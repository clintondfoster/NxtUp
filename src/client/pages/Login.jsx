import { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../reducers/auth";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/inputs/TextInput";
import validator from "validator";
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
  const [passwordRequirements, setPasswordRequirements] = useState([
    {
      description: "At least 7 characters",
      test: (pass) => pass.length >= 7,
      met: false,
    },
    {
      description: "Contains a number",
      test: /\d/.test.bind(/\d/),
      met: false,
    },
    {
      description: "Contains a capital letter",
      test: /[A-Z]/.test.bind(/[A-Z]/),
      met: false,
    },
  ]);

  // const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const authType = view === "login" ? "Login" : "Create Account";
  const navigate = useNavigate();
  const oppositeAuthCopy =
    view === "login" ? "Don't have an account?" : "Already have an account?";
  const oppositeAuthType = view === "login" ? "Create Account" : "Login";

  function checkPasswordStrength(pass) {
    setPasswordRequirements((prevReqs) =>
      prevReqs.map((req) => ({
        ...req,
        met: req.test(pass),
      }))
    );
  }

  const handleGoogleOAuth = () => {
    // Logic to handle Google Signup
    console.log("Google Signup Logic Goes Here");
  };

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

    if (
      !validator.isStrongPassword(password, {
        minLength: 7,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      })
    ) {
      setError(
        "Password should contain an uppercase letter, a number, and be at least 7 characters long"
      );
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
            navigate(`/home`);
          }, 3000);
        }
      } else {
        throw new Error("User data not received");
      }
    } catch (error) {
      setError(error.data);
    }
  }

  //   return (
  //     <section>
  //       <h1>Join Today.</h1>
  //       <h3>Welcome to The Voting App!</h3>
  //       <div className="form">
  //         <h2>{authType}</h2>
  //         {isLogin === null && (
  //           <>
  //             <button onClick={handleGoogleOAuth}>Sign Up with Google</button>
  //             <button onClick={() => setIsLogin(false)}>Create Account</button>
  //             <div className="small-button">
  //               Already have an account?{" "}
  //               <button onClick={() => setIsLogin(true)}>Login</button>
  //             </div>
  //           </>
  //         )}
  //         {isLogin !== null && (
  //           <>
  //             <form onSubmit={attemptAuth} name={authType}>
  //               <label>Email</label>
  //               <input
  //                 type="email"
  //                 name="email"
  //                 onChange={(event) => {
  //                   setEmail(event.target.value);
  //                 }}
  //               />
  //               <label>Password</label>
  //               <input
  //                 type="password"
  //                 name="password"
  //                 onChange={(event) => {
  //                   setPassword(event.target.value);
  //                   checkPasswordStrength(event.target.value);
  //                 }}
  //               />
  //               {!isLogin && (
  //                 <div className="password-requirements">
  //                   {!passwordRequirements.minLength && (
  //                     <div>At least 7 characters</div>
  //                   )}
  //                   {!passwordRequirements.containsNumber && (
  //                     <div>Contains a number</div>
  //                   )}
  //                   {!passwordRequirements.containsCapital && (
  //                     <div>Contains a capital letter</div>
  //                   )}
  //                 </div>
  //               )}
  //               {!isLogin && (
  //                 <label>
  //                   Confirm Password
  //                   <TextInput
  //                     vl={confirmPassword}
  //                     type={"password"}
  //                     chg={setConfirmPassword}
  //                   />
  //                 </label>
  //               )}
  //               {!isLogin && (
  //                 <label>
  //                   Username
  //                   <TextInput vl={username} type={"text"} chg={setUsername} />
  //                 </label>
  //               )}
  //               <button type="submit">{authType}</button>
  //             </form>
  //             <p>
  //               {oppositeAuthCopy}{" "}
  //               <a
  //                 onClick={() => {
  //                   setIsLogin(!isLogin);
  //                 }}
  //               >
  //                 {oppositeAuthType}
  //               </a>
  //             </p>
  //             {/* {error && <p className={"error"}>{error}</p>} */}
  //             {message && <p>{message}</p>}
  //             {loading && <p>Logging in...</p>}
  //             {error && <p>{error}</p>}
  //           </>
  //         )}
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <section>
      <h1>Join Today.</h1>
      <h3>Welcome to The Voting App!</h3>
      <div className="form">
        {view === "initial" && (
          <>
            <h2>Join Us</h2>
            <button onClick={handleGoogleOAuth}>Sign Up with Google</button>
            <button onClick={() => setView("register")}>Create Account</button>
            <div className="small-button">
              Already have an account?{" "}
              <button onClick={() => setView("login")}>Sign In</button>
            </div>
          </>
        )}

        {(view === "login" || view === "register") && (
          <>
            <h2>{authType}</h2>
            <form onSubmit={attemptAuth} name={authType}>
              <label>Email</label>
              <TextInput type="email" vl={email} chg={setEmail} />
              <label>Password</label>
              <TextInput
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
                  <div className="password-requirements">
                    {passwordRequirements
                      .filter((req) => !req.met)
                      .map((req, index) => (
                        <div key={index}>{req.description}</div>
                      ))}
                  </div>
                  <label>Confirm Password</label>
                  <TextInput
                    type="password"
                    vl={confirmPassword}
                    chg={(value) => {
                      setConfirmPassword(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                  />
                  <label>Username</label>
                  <TextInput type="text" vl={username} chg={setUsername} />
                </>
              )}
              <button type="submit">{authType}</button>
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
