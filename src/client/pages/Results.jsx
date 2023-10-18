import React from "react";
import {
  useGetGroupByCodeQuery,
  useGetActiveQuestionsForGroupQuery,
} from "../reducers/api";
import CreateQuestion from "../components/inputs/CreateQuestion";
import { useParams, Link } from "react-router-dom";
import CreateSubmission from "../components/inputs/CreateSubmission";
import { useState } from "react";

const Results = () => {
  const { accessCode } = useParams();
  console.log("Group Access Code:", accessCode);
  const { data: groupData, isLoading: groupLoading } =
    useGetGroupByCodeQuery(accessCode);
  const { data: questionsData, isLoading: questionsLoading } =
    useGetActiveQuestionsForGroupQuery(accessCode);

  const [selectedQuestion, setSelectedQuestion] = useState("");

  if (groupLoading) {
    return <div>Loading...</div>;
  }

  if (!groupData) return null;

  // const groupId = groupData.id;

  // if (groupData) {
  //   const group = groupData;

  return (
    <div>
      <h1>Group Name: {groupData.name}</h1>
      <h4>Code: {groupData.access_code}</h4>

      <CreateQuestion groupId={groupData.id} />

      {questionsLoading && <div>Loading questions...</div>}
      {questionsData && (
        <div>
          <h2>Active Questions</h2>
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

      {selectedQuestion && <CreateSubmission question={selectedQuestion} />}
    </div>
  );
};

export default Results;
