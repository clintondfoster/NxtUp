import React from "react";
import {
   useGetGroupByCodeQuery,
   useGetActiveQuestionsForGroupQuery,
   useEditGroupNameMutation,
} from "../reducers/api";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import UsersList from "../components/inputs/UsersList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import CreateQuestion from "../components/Group/CreateQuestion";
import DeleteGroup from "../components/Group/DeleteGroup";
import PreviousQuestion from "../components/Group/PreviousQuestion";

const GroupPage = () => {
   const { accessCode } = useParams();

   const {
      data: groupData,
      isLoading: groupLoading,
      isError: groupError,
   } = useGetGroupByCodeQuery(accessCode);

   const { refetch } = useGetGroupByCodeQuery(accessCode);

   const {
      data: questionsData,
      isLoading: questionsLoading,
      isError: questionsError,
   } = useGetActiveQuestionsForGroupQuery(accessCode);

   const [editGroupName] = useEditGroupNameMutation();

   const [isEditingGroupName, setIsEditingGroupName] = useState(false);
   const [newGroupName, setNewGroupName] = useState(groupData?.name || "");

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

   const [selectedQuestion, setSelectedQuestion] = useState("");

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
                  <FontAwesomeIcon
                     icon={faPenToSquare}
                     onClick={() => setIsEditingGroupName(true)}
                     style={{ cursor: "pointer" }}
                  />
               </div>
            )}
         </div>

         <div className="group-code-container">
            Code: {groupData.access_code}
         </div>

         {questionsLoading && <div>Loading questions...</div>}
         <div>
            {questionsData && questionsData.length > 0 ? (
               <div>
                  <div>
                     {questionsData.map((question) => (
                        <div key={question.id}>
                           <Link to={`/question/${question.id}`}>
                              {" "}
                              {question.title}
                           </Link>
                        </div>
                     ))}
                  </div>
               </div>
            ) : (
               <CreateQuestion groupId={groupData.id} />
            )}
         </div>

         <hr></hr>

         <div className="previousQuestion">
            <PreviousQuestion />
         </div>
         <div className="creatorOnly">
            <div>Creator Setting</div>
            <DeleteGroup groupId={groupData.id} />
            <div>Users in this group:</div>
            <ul>
               <li>{groupData && <UsersList groupId={groupData?.id} />}</li>
            </ul>
         </div>
      </div>
   );
};

export default GroupPage;
