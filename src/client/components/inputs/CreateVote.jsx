
import { useCreateVoteMutation } from "../../reducers/api";
import { useDispatch } from "react-redux";

const CreateVote = () => {
  const dispatch = useDispatch();
  const [createVote] = useCreateVoteMutation();

const onCreateVote = async ()=>{
    await createVote()
    .then(()=>{
        console.log("voted");
    })
    .catch(() => {
        console.log("error");
      });
}

  return (
    <div>
      <button onClick={onCreateVote}>Vote For This Link</button>
    </div>
  );
};

export default CreateVote;
