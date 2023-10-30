import React from "react";
import { useParams } from "react-router-dom";
import { useDeleteGroupByCodeMutation } from "../../../reducers/api";

const DeleteGroup = () => {
  const { accessCode } = useParams();

  const [deleteGroup] = useDeleteGroupByCodeMutation();

  const handleDeleteGroup = async () => {
    await deleteGroup(accessCode)
      .then(() => {
        console.log("code from DeleteGroup", accessCode);
      })
      .catch(() => {
        console.log("error");
      });
  };
  return (
    <div>
      <button onClick={handleDeleteGroup}>Delete Group</button>
    </div>
  );
};

export default DeleteGroup;
