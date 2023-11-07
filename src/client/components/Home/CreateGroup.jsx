import { useState } from "react";
import { useAddGroupMutation, useAddRoleMutation } from "../../reducers/api";
import { useNavigate } from "react-router-dom";
import "./CreateGroup.scss";

const CreateGroup = () => {
  const [createGroup] = useAddGroupMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleCreateGroup = async () => {
    try {
      const response = await createGroup();
      console.log("Backend response:", response);

      const createdGroup = response.data.group;
      console.log("Group created:", createdGroup);
      setSuccessMessage(
        `${createdGroup.name} is live! Share this code to add users to this group: ${createdGroup.access_code}`
      );

      setTimeout(() => {
        navigate(`/group/${createdGroup.access_code}`);
      }, 3000);
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  return (
    <div className="create-group-container">
      {successMessage && <div>{successMessage}</div>}
      <div className="create-group-btn" onClick={handleCreateGroup}>
        Create Group
      </div>
    </div>
  );
};

export default CreateGroup;
