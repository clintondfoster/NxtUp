import { useGetSubmissionsForQuestionQuery } from "../../reducers/api";
import CreateVote from "../inputs/CreateVote";
import AllVotes from "./AllVotes";
const DisplaySubmissions = ({ questionId }) => {
  const { data: submissionsData, isLoading: submissionsLoading } =
    useGetSubmissionsForQuestionQuery(questionId);


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
            <h2>
              {submission.link}
              <CreateVote questionId={questionId} submissionId={submission.id} />
              {/* <DeleteVote voteId={}/> */}
              <AllVotes submissionId={submission.id}/>
            </h2>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DisplaySubmissions;
