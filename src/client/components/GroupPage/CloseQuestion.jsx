import { useCloseQuestionMutation } from "../../reducers/api";
import "./CloseQuestion.scss";

const CloseQuestion = ({ id }) => {
   const [closeQuestion] = useCloseQuestionMutation();

   const onCloseQuestion = async () => {
      await closeQuestion(id)
         .then(() => {})
         .catch(() => {
            console.log("error");
         });
      location.reload();
   };

   return (
      <div onClick={onCloseQuestion} className="close-btn">
         Close Question
      </div>
   );
};

export default CloseQuestion;
