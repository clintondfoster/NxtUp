import { useGetSubmissionsForQuestionQuery } from "../../reducers/api";
import CreateVote from "../inputs/CreateVote";
import AllVotes from "./AllVotes";
const DisplaySubmissions = ({ questionId }) => {

  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    error,
  } = useGetSubmissionsForQuestionQuery(questionId);
  console.log("Sub questionsId:", questionId);
  console.log(`data from submissions`, submissionsData);


  if (submissionsLoading) return <div>Loading submission...</div>;
  if (!submissionsData || submissionsData.length === 0) {
    return <div>No submissions found.</div>;
  }
  if (error) return <div>Error fetching submissions: {error.message}</div>;

  //Get top 5 submissions based on vote count
  const topFive = [...submissionsData]
    .sort((a, b) => b.Vote - a.Vote)
    .slice(0, 5);

  return (
    <div>
      <h1>Leader Board</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Link</th>
            <th>User</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {topFive.map((submission, index) => (
            <tr key={submission.id}>
              <td>{index + 1}</td>
              <td>
                <a
                  href={submission.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {submission.link}
                </a>
              </td>
              <td>{submission.user.username}</td>
              <td>{submission.Vote}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>All Submissions:</h1>
      <ul>
        {submissionsData.map((submission) => (
          <li key={submission.id}>
            <h2>
              {submission.link}

              <CreateVote questionId={questionId} submissionId={submission.id} />
              {/* <DeleteVote voteId={}/> */}
              <AllVotes submissionId={submission.id}/>
            </h2>
            <span> User: {submission.user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DisplaySubmissions;
