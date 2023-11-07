import { useState, useEffect } from "react";
import { useAddRoleMutation, useGetGroupByCodeQuery } from "../../reducers/api";
import { useNavigate } from "react-router-dom";
import "./JoinGroup.scss";

const JoinGroup = () => {
  const [accessCode, setAccessCode] = useState("");
  const [createRole] = useAddRoleMutation();
  const [inputValue, setInputValue] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const {
    data: groupData,
    error,
    isLoading,
  } = useGetGroupByCodeQuery(accessCode, { skip: accessCode.length !== 5 });

  console.log("groupData in JoinGroup", groupData);

  const extractAccessCode = (url) => {
    const digits = /\/group\/(\d{5})$/;
    const matches = url.match(digits);
    return matches ? matches[1] : null;
  };

  const handleInputChange = (e) => {
    const enteredValue = e.target.value;
    console.log("entered value:", enteredValue);
    setInputValue(enteredValue);
  };

  useEffect(() => {
    const checkGroupAndCreateRole = async () => {
      if (!isLoading && groupData && !error) {
        try {
          const result = await createRole({ accessCode }).unwrap();
          console.log("Group joined:", accessCode);
          setSuccessMessage(`You have joined the group: ${groupData.name}`);
          setTimeout(() => {
            navigate(`/group/${accessCode}`);
          }, 2000);
        } catch (error) {
          console.error("Error creating group:", error);
          setErrorMessage("Error joining group. Please try again.");
        }
      } else if (error) {
        setErrorMessage(error.message || "An error occured.");
      }
    };

    if (accessCode.length === 5) {
      checkGroupAndCreateRole();
    }
  }, [accessCode, createRole, groupData, isLoading, error, navigate]);

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => setErrorMessage(""), 3000);
    }
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleJoinGroupClick = () => {
    if (inputValue.trim() === "") {
      setErrorMessage("Input cannot be empty.");
      return;
    }

    const code = extractAccessCode(inputValue.trim());
    if (code) {
      setAccessCode(code);
    } else {
      setErrorMessage(
        "Please enter a valid link including a 5-digit access code."
      );
    }
  };
  // const handleCreateRole = async () => {
  //   try {
  //     if (error || !groupData) {
  //       setErrorMessage("Please enter a valid group code");
  //       setTimeout(() => {
  //         setErrorMessage("");
  //       }, 3000);
  //       return;
  //     }
  //     await createRole({ accessCode: accessCode });
  //     console.log("Group joined:", accessCode);
  //     setAccessCode("");
  //     setSuccessMessage(`You are now entering ${groupData.name}`);

  //     //Redirect to results page after 3 seconds
  //     setTimeout(() => {
  //       navigate(`/results/${accessCode}`);
  //     }, 3000);
  //   } catch (err) {
  //     console.error("Error creating group:", err);
  //     setErrorMessage("Please enter a valid group code");
  //     setTimeout(() => {
  //       setErrorMessage("");
  //     }, 2000);
  //   }
  // };

  return (
    <div className="join-group-container">
      {successMessage && <div>{successMessage}</div>}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <div>
        <input
          className="join-group-input"
          placeholder="Paste code..."
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <div className="btn">
        <div onClick={handleJoinGroupClick} className="join-group-btn">
          Join Group
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;
