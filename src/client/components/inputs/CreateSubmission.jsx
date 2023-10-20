import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAddSubmissionMutation } from "../../reducers/api";
// import CreateVote from "../components/inputs/CreateVote";
import io from "socket.io-client";


const CreateSubmission = ({ groupId, userId, questionId }) => {

  const [submissionLink, setSubmissionLink] = useState("");
  const [createSubmission, { isSuccess, isError, error }] =
    useAddSubmissionMutation();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const socket = io.connect("http://localhost:3000");
  socket.on('connect', () => {
  })

  const handleCreateSubmission = async () => {
    if (!submissionLink) {
      setErrorMessage("Please provide a valid link.");
      return;
    }

    try {
      const response = await createSubmission({
        link: submissionLink,
        group_id: groupId,
        question_id: questionId,
        user_id: userId,
      });

      socket.emit("new_submission", response
      )

      console.log("Submission created:", response.data);
      setSubmissionLink("");
      setSuccessMessage("Submission successfully created!");
    } catch (err) {
      console.log("Error creating submission:", err);
      setErrorMessage("Failed to create submission. Please try again.");
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
      {isError && <p>{errorMessage || error.message}</p>}
      {/* {isSuccess && <p style={{ color: "green" }}>{successMessage}</p>} */}
    </div>
  );
};

export default CreateSubmission;
