import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
   useGetUsersInGroupQuery,
   useUpdateUserRoleMutation,
} from "../../reducers/api";
import { useGetCurrentUserQuery } from "../../reducers/auth";
import Spinner from "../inputs/spinner/Spinner";
import "./UsersList.scss";

export const UsersList = ({ groupId }) => {
   if (!groupId) return <p>Awaiting group...</p>;
   const {
      data: users,
      isLoading: usersLoading,
      error: usersError,
   } = useGetUsersInGroupQuery(groupId);

   const { data: thisUser } = useGetCurrentUserQuery();

  

   const isCreator = thisUser?.user?.roles?.some(
      (role) => role.group_id === groupId && role.is_creator
   );
   const isAdmin = thisUser?.user?.roles?.some(
      (role) => role.group_id === groupId && role.is_admin
   );
   const isAdmitted = thisUser?.user?.roles?.some(
      (role) => role.group_id === groupId && role.is_admitted
   );

  

  
  

   const [updatedUsers, setUpdatedUsers] = useState({});
   const [updateUserRole, { isLoading: isUpdating }] =
      useUpdateUserRoleMutation();

   const handleToggleCreatorStatus = async (userId, currentStatus) => {
      const isCreator = updatedUsers[userId] ?? currentStatus;

      const data = {
         is_creator: !isCreator,
      };

      try {
         await updateUserRole({ groupId, userId, data });
         setUpdatedUsers({ ...updatedUsers, [userId]: !isCreator });
      } catch (err) {
        
      }
   };

   if (usersLoading) return <Spinner />;
   if (usersError) return <p>Error loading users</p>;
   if (!users.length) return <p>No users found.</p>;

   // const currentUser = users.find((user) => user.is_admin);
   // const isAdmin = currentUser?.is_admin || false;

   return (
      <ul className="list">
         {users.map((user) => {
            const isCreatorStatus = updatedUsers[user.id] ?? user.is_creator;

            return (
               <li className="list-item" key={user.id}>
                  <div className="username">{user.username}</div>

                  {isAdmin && user.id !== thisUser.user.id && (
                     <div
                        className="btn"
                        onClick={() =>
                           handleToggleCreatorStatus(user.id, isCreatorStatus)
                        }
                     >
                        {isCreatorStatus
                           ? "Remove Moderator"
                           : "Make Moderator"}
                     </div>
                  )}
               </li>
            );
         })}
      </ul>
   );
};

export default UsersList;
