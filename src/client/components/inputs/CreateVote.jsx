import { useCreateVoteMutation } from "../../reducers/api";

const CreateVote = ({ questionId, submissionId }) => {
  const [createVote] = useCreateVoteMutation();

  const onCreateVote = async () => {
    await createVote({ questionId, submissionId })
      .then(() => {
        console.log("voted");
      })
      .catch(() => {
        console.log("error");
      });
  };

  return (
    <section>
      <button onClick={onCreateVote}>Vote For This Link</button>
    </section>
  );
};

export default CreateVote;
