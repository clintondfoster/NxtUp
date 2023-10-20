import { useGetVotesForSubQuery } from "../../reducers/api";

const AllVotes = ({ submissionId }) => {
  const { data, isLoading } = useGetVotesForSubQuery(submissionId);

  return (
    <>
      {isLoading ? (
        <h1>Cool You Jets! It's Loading</h1>
      ) : (
        data.length > 0 && <section>Total Votes : {data.length} </section>
      )}
    </>
  );
};

export default AllVotes;
