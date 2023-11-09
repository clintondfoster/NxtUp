import { useState, useEffect } from "react";
import { useAddRoleMutation, useGetGroupByCodeQuery } from "../../reducers/api";
import { useGetActiveQuestionsForGroupQuery } from "../../reducers/api";
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

  const {
    data: questionsData,
    error: questionsError,
    isLoading: questionsLoading,
  } = useGetActiveQuestionsForGroupQuery(accessCode, {
    skip: accessCode.length !== 5,
  });

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
      if (
        !isLoading &&
        groupData &&
        !error &&
        !questionsLoading &&
        !questionsError
      ) {
        try {
          const roleResult = await createRole({
            accessCode,
          }).unwrap();
          console.log("Group joined:", roleResult);

          //check if there is active question
          if (questionsData?.length > 0) {
            navigate(`/questions/${questionsData[0].id}`);
            setSuccessMessage(`You have joined the group: ${groupData.name}`);
          } else {
            setErrorMessage("This group has no active questions.");
            setTimeout(() => {
              navigate(`/group/${accessCode}`);
            }, 2000);
          }
        } catch (error) {
          console.error("Error creating group:", error);
          setErrorMessage(
            error.data?.error?.message ||
              "Error joining group. Please try again."
          );
        }
      } else if (error) {
        setErrorMessage(
          error.message || "An error occured while fetching group data."
        );
      } else if (questionsError) {
        setErrorMessage(
          questionsError.message ||
            "An error occured while fetching questions data."
        );
      }
    };

    if (accessCode.length === 5) {
      checkGroupAndCreateRole();
    }
  }, [
    accessCode,
    createRole,
    groupData,
    isLoading,
    error,
    navigate,
    questionsData,
    questionsLoading,
    questionsError,
  ]);

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
    //check if the input is already a 5-digit code
    if (/^\d{5}$/.test(inputValue.trim())) {
      setAccessCode(inputValue.trim());
      setInputValue("");
    } else {
      //attempt to extract the code from the url
      const code = extractAccessCode(inputValue.trim());
      if (code) {
        setAccessCode(code);
        setInputValue("");
      } else {
        setErrorMessage("Please enter a valid link or a 5-digit access code.");
      }
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
        <p>Paste link or enter your 5-digit code.</p>
        <input
          className="join-group-input"
          placeholder="Paste code..."
          s
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
