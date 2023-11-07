import { React, useState } from "react";
import { useDeleteGroupByCodeMutation } from "../../reducers/api";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../reducers/auth";
import "./DeleteGroup.scss";

const DeleteGroup = ({ groupId }) => {
   const { data: currentUser } = useGetCurrentUserQuery();
   const [deleteGroup] = useDeleteGroupByCodeMutation();
   const navigate = useNavigate();

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
         <div
            className="delete-btn"
            onClick={() => {
               const confirm = window.confirm(
                  "Are you sure you want to delete this group and all information associated with it?"
               );
               if (confirm === true) {
                  handleDeleteGroup(groupId);
               }
            }}
         >
            Delete Group
         </div>
      );
   }
};
export default DeleteGroup;
