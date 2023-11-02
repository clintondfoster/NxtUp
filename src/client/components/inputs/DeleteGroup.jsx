import { React, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDeleteGroupByCodeMutation } from "../../reducers/api";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../reducers/auth";

const DeleteGroup = ({ groupId }) => {
  const { data: currentUser } = useGetCurrentUserQuery();
  const [deleteGroup] = useDeleteGroupByCodeMutation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const { refetch } = useDeleteGroupByCodeMutation(groupId);
  const handleDeleteGroup = async () => {
    try {
      const response = await deleteGroup(groupId);
      navigate(`/home`);
    } catch (err) {
      console.log("Error deleting group:", err);
    }
  };

  const isAdmin = currentUser?.user?.roles?.some(
    (role) => role.group_id === groupId && role.is_admin
  );

  if (isAdmin) {
    return (
      <div>
        <button
          onClick={() => {
            const confirm = window.confirm(
              "Are you sure you want to delete this group and all information associated with it?"
            )
            if (confirm === true) {
              handleDeleteGroup(groupId);
            }
          }}
        >
          Delete Group
        </button>
      </div>
    );
  } 
};
export default DeleteGroup;
