import React from "react";
import {
  useGetGroupByCodeQuery,
  useGetActiveQuestionsForGroupQuery,
} from "../reducers/api";
import CreateQuestion from "../components/inputs/CreateQuestion";
import { useParams, Link } from "react-router-dom";
import CreateSubmission from "../components/inputs/CreateSubmission";
import { useState } from "react";

const GroupPage = () => {
  const { accessCode } = useParams();
  // console.log("Group Access Code:", accessCode);

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

        <CreateQuestion groupId={groupData.id} />

        {questionsLoading && <div>Loading questions...</div>}
        {questionsData && (
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

        {/* <ul>
          {groupData.questions.map((question) => (
            <li key={question.id}>
              {question.title}
              <Link to={`/question/${question.id}`}>Submit Answer</Link>
            </li>
          ))}
        </ul> */}
      </div>

      {selectedQuestion && <CreateSubmission question={selectedQuestion} />}
    </div>
  );
};

export default GroupPage;
