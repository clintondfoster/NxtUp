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
import { faPenToSquare, faCopy } from "@fortawesome/free-solid-svg-icons";
import UsersList from "../components/inputs/UsersList";
import CreateQuestion from "../components/GroupPage/CreateQuestion";
import DeleteGroup from "../components/GroupPage/DeleteGroup";
import PreviousQuestion from "../components/GroupPage/PreviousQuestion";
import CloseQuestion from "../components/GroupPage/CloseQuestion";
import Spinner from "../components/inputs/spinner/Spinner";
import "./GroupPage.scss";

const GroupPage = () => {
   const state = useSelector((state) => state);
   console.log("state: ", state);
   const { accessCode } = useParams();

   console.log("access code in group page", accessCode);

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
   const [copySuccess, setCopySuccess] = useState("");

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

   if (groupLoading) return <Spinner />;
   if (groupError) {
      return <div>Error with group data: {groupError.message}</div>;
   }

   if (!groupData) return null;
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
