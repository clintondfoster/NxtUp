import { useGetUserGroupsByRolesQuery } from "../../reducers/api";
import react, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
function DisplayUserGroups() {
   const userId = useSelector((state) => state.auth.credentials.user.userId);
   const {
      data: userGroups,
      error,
      isLoading,
   } = useGetUserGroupsByRolesQuery();
   const [isOpen, setIsOpen] = useState(false);
   const [isOpen2, setIsOpen2] = useState(false);

   if (isLoading) return <p>Loading...</p>;
   if (error) return <p>Error fetching users groups: {error.message}</p>;

   const creator = userGroups.filter((group) => group.userId === userId);

   const sheep = userGroups.filter((group) => group.userId !== userId);

   return (
      <div className="displayGroup">
         <div>
            <h2>
               My Group
               <span
                  onClick={() => setIsOpen(!isOpen)}
                  onBlur={() => setIsOpen(false)}
               >
                  <FontAwesomeIcon icon={faCaretDown} />
               </span>
            </h2>
            {isOpen && (
               <div className="dropdown-content">
                  <ul>
                     {creator.map((group) => (
                        <li key={group.id}>
                           <Link to={`/results/${group.access_code}`}>
                              {group.name}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
            )}
         </div>
         <div>
            <h2>
               {" "}
               Joined Group{" "}
               <span
                  onClick={() => setIsOpen2(!isOpen2)}
                  onBlur={() => setIsOpen2(false)}
               >
                  {" "}
                  <FontAwesomeIcon icon={faCaretDown} />
               </span>
            </h2>
            {isOpen2 && (
               <div className="dropdown-content">
                  <ul>
                     {sheep.map((group) => (
                        <li key={group.id}>
                           <Link to={`/results/${group.access_code}`}>
                              {group.name}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
            )}
         </div>
      </div>
   );
}

export default DisplayUserGroups;
