import CreateSubmission from "../components/inputs/CreateSubmission";
import { useGetQuestionByIdQuery } from "../reducers/api";
import { useParams } from "react-router-dom";

const SubmitLink = () => {
  const { questionId } = useParams();
  const { data: questionData, isLoading: questionLoading } =
    useGetQuestionByIdQuery(questionId);

  const renderQuestion = () => {
    if (questionLoading) return <div>Loading question...</div>;
    if (!questionData) return null;
    return <h2>{questionData.title}</h2>;
  };

  return (
    <div>
      {renderQuestion()}
      <CreateSubmission questionId={questionId} />
    </div>
  );
};

export default SubmitLink;
