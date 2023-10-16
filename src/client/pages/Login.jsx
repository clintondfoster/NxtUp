import { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../reducers/auth";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/inputs/TextInput";
/**
 * AuthForm allows a user to either login or register for an account.
 */
function AuthForm() {
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const authType = isLogin ? "Login" : "Register";
  const navigate = useNavigate();
  const oppositeAuthCopy = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const oppositeAuthType = isLogin ? "Register" : "Login";

  /**
   * Send credentials to server for authentication
   */
  async function attemptAuth(event) {
    event.preventDefault();
    setError(null);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const authMethod = isLogin ? login : register;
    const credentials = { password, email };

    try {
      setLoading(true);
      const result = await authMethod(credentials).unwrap();
      if (result && result.user && result.user.userId) {
        if (isLogin) {
          //redirect login users to home page
          navigate(`/home`);
        } else {
          setMessage("You have to log in");
        }
      } else {
        throw new Error("User data not received");
      }
    } catch (error) {
      setLoading(false);
      setError(error.data);
    }
  }

  return (
    <>
      <section>
        <h1> Welcome to The Voting App !!!</h1>
        <h4>Login Or Register To Start Your Adventure</h4>
        <div className="form">
          <h1>{authType}</h1>
          <form onSubmit={attemptAuth} name={authType}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            {!isLogin && (
              <label>
                Confirm Password
                <TextInput
                  vl={confirmPassword}
                  type={"password"}
                  chg={setConfirmPassword}
                />
              </label>
            )}
            {!isLogin && (
              <label>
                Username
                <TextInput vl={username} type={"text"} chg={setUsername} />
              </label>
            )}
            <button type="submit">{authType}</button>
          </form>
          <p>
            {oppositeAuthCopy}{" "}
            <a
              onClick={() => {
                setIsLogin(!isLogin);
              }}
            >
              {oppositeAuthType}
            </a>
          </p>
          {/* {error && <p className={"error"}>{error}</p>} */}
          {message && <p>{message}</p>}
          {loading && <p>Logging in...</p>}
          {error && <p>{error}</p>}
        </div>
      </section>
    </>
  );
}

export default AuthForm;
