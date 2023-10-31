import React from "react";
import { useParams } from "react-router-dom";
import { useDeleteGroupByCodeMutation } from "../../../reducers/api";

const DeleteGroup = ({groupId}) => {
// const { groupId } = useParams();
console.log("DeleteGroup", groupId)
  const [deleteGroup] = useDeleteGroupByCodeMutation(groupId);
  const handleDeleteGroup = async () => {
    try{
      const response = await useDeleteGroupByCodeMutation({
        id: groupId
      })
    } catch(err) {
      console.log("Error deleting group:", err);
    }
  }
  // const handleDeleteGroup = async () => {
  //   await deleteGroup({groupId})
  //     .then(() => {
  //       console.log("code from DeleteGroup", groupId);
  //       const response = aw
  //     })
  //     .catch(() => {
  //       console.log("error");
  //     });
  // };
  return (
    <div>
      <button onClick={handleDeleteGroup}>Delete Group</button>
    </div>
  );
};

export default DeleteGroup;
