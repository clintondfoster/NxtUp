import { useGetSubmissionsForQuestionQuery } from "../../reducers/api";

const DisplaySubmissions = ({ questionId }) => {
  const { data: submissionsData, isLoading: submissionsLoading } =
    useGetSubmissionsForQuestionQuery(questionId);
  console.log("Sub questionsId:", questionId);
  console.log(`data from submissions`, submissionsData);
  // console.log("error", error);

  if (submissionsLoading) return <div>Loading submission...</div>;
  if (!submissionsData || submissionsData.length === 0) {
    return <div>No submissions found.</div>;
  }

  return (
    <div>
      <h1>Submissions:</h1>
      <ul>
        {submissionsData.map((submission) => (
          <li key={submission.id}>
            <a href={submission.link} target="_blank" rel="noopener noreferrer">
              {submission.link}
            </a>
            <span>User: {submission.user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DisplaySubmissions;
