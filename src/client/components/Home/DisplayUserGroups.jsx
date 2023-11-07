import { useGetUserGroupsByRolesQuery } from "../../reducers/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faCaretDown,
   faSquareCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import "./DisplayUserGroups.scss";

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
      <div className="display-group-container">
         <div className="display-my-groups">
            <div
               className="groups-btn"
               onClick={() => setIsOpen(!isOpen)}
               onBlur={() => setIsOpen(false)}
            >
               My Groups
               <span>
                  {isOpen ? (
                     <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                     <FontAwesomeIcon icon={faSquareCaretUp} />
                  )}
               </span>
            </div>
            {isOpen && (
               <div className="dropdown-content">
                  <ul>
                     {creator.map((group) => (
                        <li key={group.id}>
                           <Link to={`/group/${group.access_code}`}>
                              {group.name}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
            )}
         </div>
         <div className="display-joined-groups">
            <div
               className="groups-btn"
               onClick={() => setIsOpen2(!isOpen2)}
               onBlur={() => setIsOpen2(false)}
            >
               Joined Groups
               <span>
                  {isOpen2 ? (
                     <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                     <FontAwesomeIcon icon={faSquareCaretUp} />
                  )}
               </span>
            </div>
            {isOpen2 && (
               <div className="dropdown-content">
                  <ul>
                     {sheep.map((group) => (
                        <li key={group.id}>
                           <Link to={`/group/${group.access_code}`}>
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
