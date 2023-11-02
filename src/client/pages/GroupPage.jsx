import React from "react";
import {
   useGetGroupByCodeQuery,
   useGetActiveQuestionsForGroupQuery,
   useEditGroupNameMutation,
   // useGetUsersInGroupQuery,
} from "../reducers/api";
import CreateQuestion from "../components/inputs/CreateQuestion";
import { useParams, Link } from "react-router-dom";
import CreateSubmission from "../components/inputs/CreateSubmission";
import { useState } from "react";
import UsersList from "../components/inputs/UsersList";
import DeleteGroup from "../components/inputs/DeleteGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

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
      <div>
         <div>
            <div
               style={{
                  display: "flex",
                  flexDirection: "row",
               }}
            >
               {isEditingGroupName ? (
                  <>
                     <input
                        type="text"
                        value={newGroupName}
                        placeholder={groupData.name}
                        onChange={(e) => setNewGroupName(e.target.value)}
                     />
                     <button onClick={handleEditGroupName}>Save</button>
                  </>
               ) : (
                  <>
                     <h1>{groupData.name}</h1>
                     <FontAwesomeIcon
                        icon={faPenToSquare}
                        onClick={() => setIsEditingGroupName(true)}
                        style={{ cursor: "pointer" }}
                     />
                  </>
               )}
            </div>

            <h4>Code: {groupData.access_code}</h4>
            <h4>Group Id: {groupData.id}</h4>
            <DeleteGroup groupId={groupData.id} />
            <CreateQuestion groupId={groupData.id} />

            {questionsLoading && <div>Loading questions...</div>}
            {questionsData && questionsData.length > 0 && (
               <div>
                  <h2>Active Questions in this Group:</h2>
                  <ul>
                     {questionsData.map((question) => (
                        <li key={question.id}>
                           {question.title}
                           <Link to={`/question/${question.id}`}>
                              Submit Answer
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
            )}

            <div>
               <h2>Users in this group:</h2>
               {groupData && <UsersList groupId={groupData?.id} />}
            </div>
         </div>
         {selectedQuestion && <CreateSubmission question={selectedQuestion} />}
      </div>
   );
};

export default GroupPage;
