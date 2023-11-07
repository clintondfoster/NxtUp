import { useCloseQuestionMutation } from "../../../reducers/api";
import "./CloseQuestion.scss";

const CloseQuestion = ({ questionId }) => {
  const [closeQuestion] = useCloseQuestionMutation();
  console.log("QuestionFromBtn", questionId);
  const onCloseQuestion = async () => {
    await closeQuestion(questionId)
      .then(() => {})
      .catch(() => {
        console.log("error");
      });
    refetch();
  };
  return (
    <div>
      <button onClick={onCloseQuestion} className="close-btn">
        Close Question
      </button>
    </div>
  );
};

export default CloseQuestion;
