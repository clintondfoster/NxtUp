import { useState } from "react";
import { useAddRoleMutation, useGetGroupByCodeQuery } from "../../reducers/api";
import { useNavigate } from "react-router-dom";
import { useGetActiveQuestionsForGroupQuery } from "../../reducers/api";

const JoinGroup = () => {
  const [accessCode, setAccessCode] = useState("");
  const [createRole] = useAddRoleMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { data: groupData, error } = useGetGroupByCodeQuery(accessCode);

  const handleCreateRole = async () => {
    try {
      if (error || !groupData) {
        setErrorMessage("Please enter a valid group code");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
        return;
      }
      await createRole({ accessCode: accessCode });
      console.log("Group joined:", accessCode);
      setAccessCode("");
      setSuccessMessage(`You are now entering ${groupData.name}`);

      //Redirect to active question page after 3 seconds
      setTimeout(() => {
        // navigate(`/question/${id}`);
      }, 3000);
    } catch (err) {
      console.error("Error creating group:", err);
      setErrorMessage("Please enter a valid group code");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <div>
      {successMessage && <div>{successMessage}</div>}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <div>
        <input
          className="joingroup"
          placeholder="Enter Your Group Code"
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
        />
      </div>
      <div className="btn">
        <button onClick={handleCreateRole} className="start">
          Start
        </button>
      </div>
    </div>
  );
};

export default JoinGroup;
