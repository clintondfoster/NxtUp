import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetUsersInGroupQuery,
  useUpdateUserRoleMutation,
} from "../../reducers/api";
import { useGetCurrentUserQuery } from "../../reducers/auth";

export const UsersList = ({ groupId }) => {
  if (!groupId) return <p>Awaiting group...</p>;
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useGetUsersInGroupQuery(groupId);

  const { data: thisUser } = useGetCurrentUserQuery();

  console.log("userlist current user", thisUser);

  const isCreator = thisUser?.user?.roles?.some(
    (role) => role.group_id === groupId && role.is_creator
  );
  const isAdmin = thisUser?.user?.roles?.some(
    (role) => role.group_id === groupId && role.is_admin
  );
  const isAdmitted = thisUser?.user?.roles?.some(
    (role) => role.group_id === groupId && role.is_admitted
  );

  console.log("data returned by getcurrentUser", thisUser);

  console.log("users in userslist", users);
  console.log("Group id in userslist:", groupId);

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
      console.log("failed to update", err);
    }
  };

  if (usersLoading) return <p>Loading...</p>;
  if (usersError) return <p>Error loading users</p>;
  if (!users.length) return <p>No users found.</p>;

  // const currentUser = users.find((user) => user.is_admin);
  // const isAdmin = currentUser?.is_admin || false;

  return (
    <ul>
      {users.map((user) => {
        const isCreatorStatus = updatedUsers[user.id] ?? user.is_creator;

        return (
          <li key={user.id}>
            {user.username}

            {isAdmin && user.id !== thisUser.user.id && (
              <button
                onClick={() =>
                  handleToggleCreatorStatus(user.id, isCreatorStatus)
                }
              >
                {isCreatorStatus ? "Remove Status" : "Assign Creator Status"}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default UsersList;
