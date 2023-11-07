import { useCloseQuestionMutation } from "../../../reducers/api";
import "./CloseQuestion.scss";

const CloseQuestion = () => {
   const { questionId } = useParams();
   const [closeQuestion] = useCloseQuestionMutation();

   const onCloseQuestion = async () => {
      await closeQuestion(questionId)
         .then(() => {})
         .catch(() => {
            console.log("error");
         });
   };
   return (
      <div>
         <div onClick={onCloseQuestion} className="close-btn">
            Close Question
         </div>
      </div>
   );
};

export default CloseQuestion;
