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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import PreviousQuestion from "./PreviousQuestion";
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
            <button onClick={handleEditGroupName}>Save</button>
          </>
        ) : (
          <>
            <h1>Group Name: {groupData.name}</h1>
            <FontAwesomeIcon
              icon={faPenToSquare}
              onClick={() => setIsEditingGroupName(true)}
              style={{ cursor: "pointer" }}
            />
          </>
        )}
      </div>

      <h4>Code: {groupData.access_code}</h4>

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
          <CreateQuestion groupId={groupData.id} />
        )}
      </div>

      <hr></hr>

      <div className="previousQuestion">
        <PreviousQuestion/>
      </div>

      <hr></hr>
      <div className="creatorOnly">
        <h2>Creator Setting</h2>
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
