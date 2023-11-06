import React from "react";
import CreateSubmission from "../components/inputs/QuestionPage/CreateSubmission";
import { useParams } from "react-router-dom";
import { useGetQuestionByIdQuery } from "../reducers/api";
import { useNavigate } from "react-router-dom";
import "./QuestionPage.scss"

const QuestionPage = () => {
  const { questionId } = useParams();

  const { data: questionData, isLoading: questionLoading } =
    useGetQuestionByIdQuery(questionId);

  const renderQuestion = () => {
    if (questionLoading) return <div>Loading question...</div>;
    if (!questionData) return null;
    return <h2>{questionData.title}</h2>;
  };

  const navigate = useNavigate();

  const handleMaybeLaterClick = () => {
    const path = `/question/${questionId}/submissions`;
    navigate(path);
  };

  return (
    <div className="question-container">
      <div className="question-header"> {renderQuestion()}</div>
      <div>
        <div className="create-sub">
          <CreateSubmission questionId={questionId} />
        </div>
        <div className="maybe-later-button">
          <p onClick={handleMaybeLaterClick} className="maybe-later">
            maybe later
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
