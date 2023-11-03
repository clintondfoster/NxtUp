import { useParams } from "react-router-dom";
import { useCloseQuestionMutation } from "../../../reducers/api";
import "./CloseQuestion.scss";

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
    <div >
      <button onClick={onCloseQuestion} className="close-btn">Close Question</button>
    </div>
  );
};

export default CloseQuestion;
