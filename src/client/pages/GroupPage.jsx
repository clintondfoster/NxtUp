import React from "react";
import {
  useGetGroupByCodeQuery,
  useGetActiveQuestionsForGroupQuery,
  // useGetUsersInGroupQuery,
} from "../reducers/api";
import CreateQuestion from "../components/inputs/CreateQuestion";
import { useParams, Link } from "react-router-dom";
import CreateSubmission from "../components/inputs/CreateSubmission";
import { useState } from "react";
import UsersList from "../components/inputs/UsersList";
import DeleteGroup from "../components/inputs/DeleteGroup";

const GroupPage = () => {
  const { accessCode, groupId } = useParams();

  const {
    data: groupData,
    isLoading: groupLoading,
    isError: groupError,
  } = useGetGroupByCodeQuery(accessCode);
  
  const {
    data: questionsData,
    isLoading: questionsLoading,
    isError: questionsError,
  } = useGetActiveQuestionsForGroupQuery(accessCode);

  const [selectedQuestion, setSelectedQuestion] = useState("");

  if (groupLoading) return <div>Loading...</div>;
  if (groupError) {
    return <div>Error with group data: {groupError.message}</div>;
  }

  if (!groupData) return null;

  return (
    <div>
      <div>
        <h1>Group Name: {groupData.name}</h1>
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
                  <Link to={`/question/${question.id}`}>Submit Answer</Link>
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
