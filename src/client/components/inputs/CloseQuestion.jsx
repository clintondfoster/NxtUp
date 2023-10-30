import { useParams } from "react-router-dom";
import { useCloseQuestionMutation } from "../../reducers/api";
import React from "react";

const CloseQuestion = () => {
  const { questionId } = useParams();
  const [closeQuestion] = useCloseQuestionMutation();

  const onCloseQuestion = async () => {
    await closeQuestion(questionId)
      .then(() => {
      })
      .catch(() => {
        console.log("error");
      });
  };
  return (
    <div>
      <button onClick={onCloseQuestion}>Close Question</button>
    </div>
  );
};

export default CloseQuestion;
