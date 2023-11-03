import { useParams, useNavigate } from "react-router-dom";
import { useCloseQuestionMutation } from "../../reducers/api";
import React from "react";

const CloseQuestion = () => {
  const { questionId } = useParams();
  const [closeQuestion] = useCloseQuestionMutation();

  const navigate = useNavigate();

  const onCloseQuestion = async () => {
    try {
      const closequestion = await closeQuestion(questionId);
      navigate(`/home`);
    } catch (err) {
      console.log("Error closing question:", err);
    }
  };
  return (
    <div>
      <button onClick={onCloseQuestion}>Close Question</button>
    </div>
  );
};

export default CloseQuestion;
