import { useGetUserGroupsByRolesQuery } from "../../reducers/api";
import react from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function DisplayUserGroups() {
   const userId = useSelector((state) => state.auth.credentials.user.userId);
   const {
      data: userGroups,
      error,
      isLoading,
   } = useGetUserGroupsByRolesQuery();

   if (isLoading) return <p>Loading...</p>;
   if (error) return <p>Error fetching users groups: {error.message}</p>;

   const creator = userGroups.filter((group) => group.userId === userId);

   const sheep = userGroups.filter((group) => group.userId !== userId);

   return (
      <div>
         <h2> Your Active Groups</h2>
         <ul>
            {creator.map((group) => (
               <li key={group.id}>
                  <Link to={`/group/${group.access_code}`}>{group.name}</Link>
               </li>
            ))}
         </ul>
         <h2> Your Joined Groups</h2>
         <ul>
            {sheep.map((group) => (
               <li key={group.id}>
                  <Link to={`/group/${group.access_code}`}>{group.name}</Link>
               </li>
            ))}
         </ul>
      </div>
   );
}

export default DisplayUserGroups;
