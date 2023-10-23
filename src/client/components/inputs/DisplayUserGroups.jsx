import { useGetUserGroupsByRolesQuery } from "../../reducers/api";
import react from "react";
import { Link } from "react-router-dom";

function DisplayUserGroups() {
  const { data: userGroups, error, isLoading } = useGetUserGroupsByRolesQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching users groups: {error.message}</p>;

  return (
    <div>
      <h2> Your Active Groups</h2>
      <ul>
        {userGroups.map((group) => (
          <li key={group.id}>
            <Link to={`/results/${group.access_code}`}>{group.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayUserGroups;
