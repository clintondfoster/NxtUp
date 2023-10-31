import { React, useState } from "react";
import { useDeleteGroupByCodeMutation } from "../../reducers/api";
import { useNavigate } from "react-router-dom";

const DeleteGroup = ({ groupId }) => {
  const [deleteGroup] = useDeleteGroupByCodeMutation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const { refetch } = useDeleteGroupByCodeMutation(groupId);
  const handleDeleteGroup = async () => {
    try {
      const response = await deleteGroup(groupId)
      navigate(`/home`);
    } catch (err) {
      console.log("Error deleting group:", err);
    }
  };
  return (
    <div>
      <button onClick={handleDeleteGroup}>Delete Group</button>
    </div>
  );
};

export default DeleteGroup;

