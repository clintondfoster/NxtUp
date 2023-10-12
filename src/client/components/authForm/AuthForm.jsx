import { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../../reducers/auth";
import TextInput from "../inputs/TextInput";
// import { useNavigate } from "react-router-dom";

/**
 * AuthForm allows a user to either login or register for an account.
 */
function AuthForm() {
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(null);

  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const authType = isLogin ? "Login" : "Register";
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
    const credentials = { username, password };

    try {
      setLoading(true);
      await authMethod(credentials).unwrap();
    } catch (error) {
      setLoading(false);
      setError(error.data || error.message);
    }
  }

  return (
    <main className="content">
      <h1>{authType}</h1>
      <form onSubmit={attemptAuth} name={authType}>
        <label>
          Username
          <TextInput vl={username} type={"text"} chg={setUsername} />
        </label>

        <label>
          Password
          <TextInput vl={password} type={"password"} chg={setPassword} />
        </label>

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
      {message && <p>{message}</p>}
      {loading && <p>Logging in...</p>}
      {error && <p>{error}</p>}
    </main>
  );
}

export default AuthForm;
