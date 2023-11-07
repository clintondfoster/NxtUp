import React from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {
   useGetGroupByCodeQuery,
   useGetActiveQuestionsForGroupQuery,
   useEditGroupNameMutation,
} from "../reducers/api";
import { useGetCurrentUserQuery } from "../reducers/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import UsersList from "../components/inputs/UsersList";
import CreateQuestion from "../components/Group/CreateQuestion";
import DeleteGroup from "../components/Group/DeleteGroup";
import PreviousQuestion from "../components/Group/PreviousQuestion";
import CloseQuestion from "../components/Group/CloseQuestion";
import "./GroupPage.scss";

const GroupPage = () => {
   const state = useSelector((state) => state);
   console.log("state: ", state);
   const { accessCode } = useParams();

   const {
      data: groupData,
      isLoading: groupLoading,
      isError: groupError,
      refetch,
   } = useGetGroupByCodeQuery(accessCode);

   const {
      data: questionsData,
      isLoading: questionsLoading,
      isError: questionsError,
      refetch: refetchQuestion,
   } = useGetActiveQuestionsForGroupQuery(accessCode);

   const [editGroupName] = useEditGroupNameMutation();

   const [isEditingGroupName, setIsEditingGroupName] = useState(false);
   const [newGroupName, setNewGroupName] = useState(groupData?.name || "");

   const { data: currentUser } = useGetCurrentUserQuery();
   console.log("currentUser", currentUser);
   const isAdmin = currentUser?.user?.roles?.some(
      (role) => role.group_id === groupData?.id && role.is_admin
   );

   const handleEditGroupName = async () => {
      try {
         const result = await editGroupName({
            id: groupData.id,
            name: newGroupName,
         });

         if (result.error) {
            console.error("Error editing group name:", result.error);
         } else {
            console.log(`Group name updated`, newGroupName);
            refetch();
         }
      } catch (error) {
         console.error("An error occurred while editing group name:", error);
      }
      setIsEditingGroupName(false);
   };

   if (groupLoading) return <div>Loading...</div>;
   if (groupError) {
      return <div>Error with group data: {groupError.message}</div>;
   }

   if (!groupData) return null;
   return (
      <div className="group-page-container">
         <div className="group-name-container">
            {isEditingGroupName ? (
               <div className="group-name-change-container">
                  <input
                     type="text"
                     value={newGroupName}
                     placeholder={groupData.name}
                     onChange={(e) => setNewGroupName(e.target.value)}
                  />
                  <div className="save-button" onClick={handleEditGroupName}>
                     Save
                  </div>
               </div>
            ) : (
               <div className="group-title-container">
                  <div className="group-title">{groupData.name}</div>
                  {isAdmin && (
                     <FontAwesomeIcon
                        icon={faPenToSquare}
                        onClick={() => setIsEditingGroupName(true)}
                        style={{ cursor: "pointer" }}
                     />
                  )}
               </div>
            )}
         </div>

         <div className="group-code-container">
            {`Code: ${groupData.access_code}`}
         </div>

         {questionsLoading && <div>Loading questions...</div>}
         <div className="group-questions-container">
            {questionsData && questionsData.length > 0 ? (
               <div className="questions-map">
                  {questionsData.map((question) => (
                     <div key={question.id}>
                        <Link
                           className="current"
                           to={`/question/${question.id}`}
                        >
                           {" "}
                           {question.title}
                        </Link>

                        {isAdmin && <CloseQuestion id={question.id} />}
                     </div>
                  ))}
               </div>
            ) : (
               <div onClick={() => refetchQuestion()}>
                  <CreateQuestion groupId={groupData.id} />
               </div>
            )}
         </div>

         <hr></hr>

         <div className="previous-questions">
            <PreviousQuestion />
         </div>

         <div className="group-info-footer-container">
            <div className="footer-admin-container">
               <div className="admin-title">Creator Setting</div>
               <DeleteGroup groupId={groupData.id} />
            </div>
            <div className="footer-users-container">
               <div className="users-list">Users in this group:</div>
               <ul>
                  <li>{groupData && <UsersList groupId={groupData?.id} />}</li>
               </ul>
            </div>
         </div>
      </div>
   );
};

export default GroupPage;
