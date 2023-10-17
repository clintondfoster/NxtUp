import { useGetSubmissionsByQuestionIdQuery } from "../../reducers/api";

const DisplaySubmissions = ({ questionId }) => {
  const { data, isLoading } = useGetSubmissionsByQuestionIdQuery(questionId);
  console.log(`data from submissions`, data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    const submission = data;
    console.log(`submission`);

    return (
      <div>
        <h1>submissions: </h1>
        <h1>{submission.link}</h1>
      </div>
    );
  }

  return null;
};

export default DisplaySubmissions;
