import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
   useGetGroupByCodeQuery,
   useGetActiveQuestionsForGroupQuery,
   useEditGroupNameMutation,
} from "../reducers/api";
import { useGetCurrentUserQuery } from "../reducers/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCopy } from "@fortawesome/free-solid-svg-icons";
import UsersList from "../components/inputs/UsersList";
import CreateQuestion from "../components/GroupPage/CreateQuestion";
import DeleteGroup from "../components/GroupPage/DeleteGroup";
import PreviousQuestion from "../components/GroupPage/PreviousQuestion";
import CloseQuestion from "../components/GroupPage/CloseQuestion";
import Spinner from "../components/inputs/spinner/Spinner";
import "./GroupPage.scss";

const GroupPage = () => {
   const { accessCode } = useParams();

   const {
      data: groupData,
      isLoading: groupLoading,
      isError: groupError,
      refetch: refetchGroup,
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
   const [copySuccess, setCopySuccess] = useState("");

   const { data: currentUser } = useGetCurrentUserQuery();

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
            refetch();
         }
      } catch (error) {
         console.error("An error occurred while editing group name:", error);
      }
      setIsEditingGroupName(false);
   };

   const copyToClipboard = () => {
      navigator.clipboard
         .writeText(window.location.href)
         .then(() => setCopySuccess("Copied!"))
         .catch(() => setCopySuccess("Failed to copy!"));
   };

   const onCopy = () => {
      copyToClipboard();
      setTimeout(() => setCopySuccess(""), 2000);
   };

   useEffect(() => {
      if (questionsData !== undefined) {
         console.log("Effect triggered. Questions data:", questionsData);
         refetchGroup();
         refetchQuestion();
      }
   }, [refetchGroup, refetchQuestion, questionsData, groupData]);

   if (groupLoading) return <Spinner />;
   if (groupError) {
      return <div>Error with group data: {groupError.message}</div>;
   }

   if (!groupData) return null;

   function isEmpty() {
      if (newGroupName.trim().length === 0) {
         alert("Group name can not be empty!");
         return true;
      } else {
         return false;
      }
   }
   return (
      <div className="group-page-container">
         <div className="justify-fix">
            <div className="group-name-container">
               {isEditingGroupName ? (
                  <div className="group-name-change-container">
                     <input
                        type="text"
                        value={newGroupName}
                        placeholder={groupData.name}
                        onChange={(e) => setNewGroupName(e.target.value)}
                     />
                     <div
                        className="save-button"
                        onClick={() => {
                           if (!isEmpty()) {
                              handleEditGroupName();
                           }
                        }}
                     >
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

            <div className="group-code-container" onClick={onCopy}>
               <div className="group-code">{`Code: ${groupData.access_code}`}</div>
               <FontAwesomeIcon icon={faCopy} />
               {copySuccess && (
                  <span style={{ marginLeft: "10px" }}>{copySuccess}</span>
               )}
            </div>

            {questionsLoading && <div>Loading questions...</div>}
            <div className="group-questions-container">
               {questionsData && questionsData.length > 0 ? (
                  <div className="questions-map">
                     {"Active Questions"}
                     {questionsData.map((question) => (
                        <div className="active-question" key={question.id}>
                           <Link
                              className="current"
                              to={`/question/${question.id}`}
                           >
                              {question.title}
                           </Link>

                           {isAdmin && <CloseQuestion id={question.id} />}
                        </div>
                     ))}
                  </div>
               ) : (
                  <div onClick={() => refetchQuestion()}>
                     <CreateQuestion
                        groupId={groupData.id}
                        accessCode={accessCode}
                     />
                  </div>
               )}
            </div>

            <hr></hr>

            <div className="previous-questions">
               <PreviousQuestion />
            </div>
         </div>

         <div className="group-info-footer-container">
            {isAdmin && (
               <div className="footer-admin-container">
                  <div className="admin-title">Creator Setting</div>
                  <DeleteGroup groupId={groupData.id} />
               </div>
            )}
            <div className="footer-users-container">
               <div className="users-list">
                  Users in this group:
                  <ul>
                     <li>
                        {groupData && <UsersList groupId={groupData?.id} />}
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
};

export default GroupPage;
