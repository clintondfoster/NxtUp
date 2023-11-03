import react from "react";
import { useState, useEffect, useRef } from "react";
// import UserProfile from "../components/inputs/UserProfile";
import NavB from "../components/Nav";
import { useLogoutMutation } from "../reducers/auth";
import { useNavigate } from "react-router-dom";

import { useEditUserMutation } from "../reducers/api";
import { useGetCurrentUserQuery } from "../reducers/auth";
// import { useParams } from "react-router-dom";
import TextInput from "../components/inputs/TextInput";

function AccountSettings() {
  const { data: currentUser, isError, isLoading } = useGetCurrentUserQuery();
  const [editUser, { isLoading: isEditingUser }] = useEditUserMutation();

  console.log("in accounts:", currentUser);

  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [LogoutMessage, setLogoutMessage] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);

  const timeoutId = useRef(null);

  const handleUsernameToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await editUser({
        id: currentUser.user.id,
        username: newUsername,
      }).unwrap();
      setShowChangeUsername(false);
    } catch (err) {
      console.log(err);
      setError("Ann error occured while updating your details.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await editUser({
        id: currentUser.user.id,
        password: newPassword,
        username: currentUser.user.username,
      }).unwrap();

      setShowChangePassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log(err);
      if (err.data && err.data.error) {
        setError(err.data.error);
      } else {
        setError("Ann error occured while updating your details.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLogoutMessage(true);
      setTimeout(() => {
        setLogoutMessage(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      console.err("Error logging out:", err);
    }
  };

  if (isEditingUser) {
    return <div>Loading your profile...</div>;
  }
  if (isError) {
    return <div>Error loading your profile. Please try again later.</div>;
  }

  return (
    <div>
      <NavB />
      <h2>Account Settings</h2>
      {LogoutMessage && <div>You have successfully logged out.</div>}
      {updateSuccess && <div>Your account has been updated successfully!</div>}
      <div className="login-information">
        <h2>Login information</h2>
        {currentUser && (
          <>
            <div>
              <h3>Welcome, {currentUser.user.username}</h3>
              <p>{currentUser.user.email}</p>

              <div className="username-dropdown">
                <button
                  onClick={() => setShowChangeUsername(!showChangeUsername)}
                >
                  {showChangeUsername ? "Cancel" : "Change Username"}
                </button>
                {showChangeUsername && (
                  <form onSubmit={handleUsernameSubmit}>
                    <TextInput
                      type="text"
                      vl={newUsername}
                      chg={setNewUsername}
                      placeholder="Enter new username"
                      required
                    />
                    <button type="submit" disabled={isEditingUser}>
                      Update username
                    </button>
                  </form>
                )}
              </div>

              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                {showChangePassword ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showChangePassword && (
              <form onSubmit={handlePasswordSubmit}>
                <TextInput
                  type="password"
                  vl={newPassword}
                  chg={setNewPassword}
                  placeholder="Enter new password"
                  required
                />
                <TextInput
                  type="password"
                  vl={confirmPassword}
                  chg={setConfirmPassword}
                  placeholder="Confirm new password"
                  required
                />
                <button type="submit" disabled={isEditingUser}>
                  Update Password
                </button>
              </form>
            )}
          </>
        )}
      </div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default AccountSettings;
