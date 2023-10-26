import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetUsersInGroupQuery,
  useUpdateUserRoleMutation,
} from "../../reducers/api";

export const UsersList = ({ groupId }) => {
  if (!groupId) return <p>Awaiting group...</p>;
  const { data: users, isLoading, error } = useGetUsersInGroupQuery(groupId);
  console.log("users in userslist", users);
  console.log("Group id in userslist:", groupId);

  const [updatedUsers, setUpdatedUsers] = useState({});
  const [updateUserRole, { isLoading: isUpdating }] =
    useUpdateUserRoleMutation();

  //   const currentUserId =

  const handleToggleCreatorStatus = async (userId, currentStatus) => {
    const isCreator = updatedUsers[userId] ?? currentStatus;

    const data = {
      is_creator: !isCreator,
    };

    try {
      await updateUserRole({ groupId, userId, data });
      setUpdatedUsers({ ...updatedUsers, [userId]: !isCreator });
    } catch (err) {
      console.log("failed to update", err);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <ul>
      {users.map((user) => {
        const isCreator = updatedUsers[user.id] ?? user.id_creator;

        return (
          <li key={user.id}>
            {user.username}
            <button
              onClick={() => handleToggleCreatorStatus(user.id, isCreator)}
            >
              {isCreator ? "Remove Role" : "Assign Creator Role"}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default UsersList;
