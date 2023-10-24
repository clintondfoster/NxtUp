import {
  useGetSubmissionsForQuestionQuery,
  useGetUserHistoryQuery,
} from "../../reducers/api";
import { Link } from "react-router-dom";

const UserHistory = () => {
  const {
    data: userHistory,
    isLoading,
    isError: error,
  } = useGetUserHistoryQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!userHistory || userHistory.length === 0) {
    return <p>No history available.</p>;
  }

  const groupedSubmissions = userHistory.reduce((acc, submission) => {
    const questionId = submission.question.id;
    if (!acc[questionId]) {
      acc[questionId] = { title: submission.question.title, submissions: [] };
    }
    acc[questionId].submissions.push(submission);
    return acc;
  }, {});

  return (
    <div>
      <h3>Your Submission History</h3>
      <ul>
        {Object.values(groupedSubmissions).map(({ title, submissions }) => (
          <li key={title}>
            <Link to={`/question/${submissions[0].question.id}`}>{title}</Link>
            <ul>
              {submissions.map((sub) => (
                <li key={sub.id}>
                  <a href={sub.link} target="_blank" rel="noopener noreferrer">
                    {sub.link}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserHistory;
