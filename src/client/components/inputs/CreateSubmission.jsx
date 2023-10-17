import { useState } from "react";
import { useAddSubmissionMutation } from "../../reducers/api";
// import CreateVote from "../components/inputs/CreateVote";

const CreateSubmission = ({ groupId, questionId }) => {
  const [submissionLink, setSubmissionLink] = useState("");
  //   const [userId, setUserId] = useState("");
  //   const [questionId, setQuestionId] = useState("");
  const [createSubmission] = useAddSubmissionMutation();

  const handleCreateSubmission = async () => {
    try {
      const response = await createSubmission({
        link: submissionLink,
        group_id: groupId, 
        question_id: questionId,
      });
      console.log("Submission created:", response);
      setSubmissionLink("");
    } catch (err) {
      console.log("Error creating submission:", err);
    }
  };

  return (
    <div>
      <input
        placeholder="Submission Link"
        type="text"
        value={submissionLink}
        onChange={(e) => setSubmissionLink(e.target.value)}
      />
      <button onClick={handleCreateSubmission}>Submit</button>
    </div>
  );
};

export default CreateSubmission;
