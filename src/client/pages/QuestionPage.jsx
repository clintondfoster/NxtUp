import React from "react";
import CreateSubmission from "../components/inputs/CreateSubmission";
import { useParams } from "react-router-dom";
import {
  useGetQuestionByIdQuery,
  useGetSubmissionsForQuestionQuery,
} from "../reducers/api/";

const QuestionsPage = () => {
  const { questionId } = useParams();

  const { data: questionData, isLoading: questionLoading } =
    useGetQuestionByIdQuery(questionId);

  const { data: submissionsData, isLoading: submissionsLoading } =
    useGetSubmissionsForQuestionQuery(questionId);

  const renderQuestion = () => {
    if (questionLoading) return <div>Loading question...</div>;
    if (!questionData) return null;
    return <h2>{questionData.title}</h2>;
  };

  const renderSubmissions = () => {
    if (submissionsLoading) return <div>Loading submission...</div>;
    if (!submissionsData || submissionsData.length === 0) {
      return <div>No submissions found.</div>;
    }

    return (
      <ul>
        {submissionsData.map((submission) => (
          <li key={submission.id}>
            <a href={submission.link} target="_blank" rel="noopener noreferrer">
              {submission.link}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {renderQuestion()}
      <CreateSubmission questionId={questionId} />
      <h3>Submissions:</h3>
      {renderSubmissions()}
    </div>
  );
};

export default QuestionsPage;
