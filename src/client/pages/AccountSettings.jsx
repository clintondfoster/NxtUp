import react from "react";
import { useState, useEffect, useRef } from "react";
import { useLogoutMutation } from "../reducers/auth";
import { useNavigate } from "react-router-dom";

import { useEditUserMutation } from "../reducers/api";
import { useGetCurrentUserQuery } from "../reducers/auth";
import TextInput from "../components/authForm/TextInput";
import "./AccountSettings.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faSquareCaretUp,
} from "@fortawesome/free-solid-svg-icons";

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

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await editUser({
        id: currentUser.user.id,
        username: newUsername,
      }).unwrap();
      setUpdateSuccess(true);
      setShowChangeUsername(false);
      setNewUsername("");
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => setUpdateSuccess(false), 5000);
    } catch (err) {
      console.log(err);
      setError("Ann error occured while updating your details.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords must match. Please try again.");
      return;
    }

    try {
      const response = await editUser({
        id: currentUser.user.id,
        password: newPassword,
        username: currentUser.user.username,
      }).unwrap();
      setUpdateSuccess(true);
      setShowChangePassword(false);
      setNewPassword("");
      setConfirmPassword("");
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => setUpdateSuccess(false), 5000);
    } catch (err) {
      console.log(err);
      if (err.data && err.data.error) {
        setError(err.data.error);
      } else {
        setError("An error occured while updating your details.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (isEditingUser) {
    return <div>Loading your profile...</div>;
  }
  if (isError) {
    return <div>Error loading your profile. Please try again later.</div>;
  }

  return (
    <div className="as-container">
      <h2 className="as-title">Account Settings</h2>
      {/* {LogoutMessage && <div className="message">{LogoutMessage}</div>} */}
      {updateSuccess && (
        <div className="message">
          Your account has been updated successfully!
        </div>
      )}
      <div className="as-login-container">
        <h3 className="as-login-title">Login information</h3>
        {currentUser && (
          <>
            <div className="as-user-info">
              <p className="as-welcome">Welcome, {currentUser.user.username}</p>
              <h6 className="as-email">{currentUser.user.email}</h6>
            </div>

            <div className="settings-section">
              <div
                className="update-btn"
                onClick={() => setShowChangeUsername(!showChangeUsername)}
                onBlur={() => setShowChangeUsername(false)}
              >
                Update Username
                <span>
                  {showChangeUsername ? (
                    <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                    <FontAwesomeIcon icon={faSquareCaretUp} />
                  )}
                </span>
              </div>
              {showChangeUsername && (
                <div className="dropdown-content">
                  <form onSubmit={handleUsernameSubmit}>
                    <TextInput
                      className="input"
                      type="text"
                      vl={newUsername}
                      chg={setNewUsername}
                      placeholder="Enter new username..."
                      required
                    />
                    <div
                      className="submit-btn"
                      type="submit"
                      disabled={isEditingUser}
                      onClick={handleUsernameSubmit}
                    >
                      Save Changes
                    </div>
                  </form>
                </div>
              )}
            </div>

            {error && <div className="message-error">{error}</div>}
            <div className="settings-section">
              <div
                className="update-btn"
                onClick={() => setShowChangePassword(!showChangePassword)}
                onBlur={() => setShowChangePassword(false)}
              >
                Update Password
                <span>
                  {showChangePassword ? (
                    <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                    <FontAwesomeIcon icon={faSquareCaretUp} />
                  )}
                </span>
              </div>
              {showChangePassword && (
                <div className="dropdown-content">
                  <form onSubmit={handlePasswordSubmit}>
                    <TextInput
                      className="input"
                      type="password"
                      vl={newPassword}
                      chg={setNewPassword}
                      placeholder="Enter new password..."
                      required
                    />
                    <TextInput
                      className="input"
                      type="password"
                      vl={confirmPassword}
                      chg={setConfirmPassword}
                      placeholder="Confirm new password..."
                      required
                    />
                    <div
                      className="submit-btn"
                      type="submit"
                      disabled={isEditingUser}
                      onClick={handlePasswordSubmit}
                    >
                      Save Changes
                    </div>
                  </form>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="as-logout">
        <div onClick={handleLogout}>Logout</div>
      </div>
    </div>
  );
}

export default AccountSettings;
