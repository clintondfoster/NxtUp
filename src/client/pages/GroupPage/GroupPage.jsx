import React from "react";
import {
  useGetGroupByCodeQuery,
  useGetActiveQuestionsForGroupQuery,
  useEditGroupNameMutation,
} from "../../reducers/api";
import CreateQuestion from "./CreateQuestion";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import UsersList from "../../components/inputs/UsersList";
import DeleteGroup from "./DeleteGroup";
import { useGetCurrentUserQuery } from "../../reducers/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCopy } from "@fortawesome/free-solid-svg-icons";
import PreviousQuestion from "./PreviousQuestion";
import CloseQuestion from "../../components/inputs/QuestionPage/CloseQuestion";
import { useSelector } from "react-redux";

const GroupPage = () => {
  const state = useSelector((state) => state);
  console.log("state", state);
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
  console.log(questionsData, "questionDt");
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

  const [selectedQuestion, setSelectedQuestion] = useState("");

  if (groupLoading) return <div>Loading...</div>;
  if (groupError) {
    return <div>Error with group data: {groupError.message}</div>;
  }

  if (!groupData) return null;
  return (
    <div className="groupPage">
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
            <button disabled={!newGroupName} onClick={handleEditGroupName}>
              Save
            </button>
          </>
        ) : (
          <>
            <h1>Group Name: {groupData.name}</h1>
            {isAdmin && (
              <FontAwesomeIcon
                icon={faPenToSquare}
                onClick={() => setIsEditingGroupName(true)}
                style={{ cursor: "pointer" }}
              />
            )}
          </>
        )}
      </div>

      <h4>Code: {groupData.access_code}</h4>

      <div className="shareGroup">
        <h4>Shareable Link: </h4>
        <div onClick={onCopy}>
          <FontAwesomeIcon icon={faCopy} />
          Copy Link
        </div>
        {copySuccess && (
          <span style={{ marginLeft: "10px" }}>{copySuccess}</span>
        )}
      </div>

      {questionsLoading && <div>Loading questions...</div>}
      <div>
        {questionsData && questionsData.length > 0 ? (
          <div>
            <h2>
              {questionsData.map((question) => (
                <div key={question.id}>
                  <Link to={`/question/${question.id}`}> {question.title}</Link>
                </div>
              ))}
            </h2>
          </div>
        ) : (
          <div onClick={() => refetchQuestion()}>
            <CreateQuestion groupId={groupData.id} />
          </div>
        )}
      </div>

      <hr></hr>

      <div className="previousQuestion">
        <PreviousQuestion />
      </div>

      <hr></hr>
      <div className="creatorOnly">
        <h2>Creator Setting</h2>
        <div onClick={() => refetchQuestion()}>
          {questionsData?.length > 0 && (
            <CloseQuestion
              questionId={
                questionsData && Array.isArray(questionsData)
                  ? questionsData[0]?.id
                  : null
              }
            />
          )}
        </div>
        <DeleteGroup groupId={groupData.id} />
        <h4>Users in this group:</h4>
        <ul>
          <li>{groupData && <UsersList groupId={groupData?.id} />}</li>
        </ul>
      </div>
    </div>
  );
};

export default GroupPage;
