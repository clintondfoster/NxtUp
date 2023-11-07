import { useState } from "react";
import { useAddSubmissionMutation } from "../../../reducers/api";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import "./CreateSubmission.scss";

const CreateSubmission = ({ groupId, userId, questionId }) => {
  const [submissionLink, setSubmissionLink] = useState("");
  const [createSubmission, { isSuccess, isError, error }] =
    useAddSubmissionMutation();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const socket = io.connect("http://localhost:3000");
  socket.on("connect", () => {});

  const handleCreateSubmission = async () => {
    if (!submissionLink) {
      setErrorMessage("Please provide a valid link.");  
      return;
    }

    const videoId = submissionLink.split("v=")[1];

    if (!videoId) {
      setErrorMessage("Invalid YouTube URL");
      return;
    }

    try {
      const response = await createSubmission({
        link: videoId,
        group_id: groupId,
        question_id: questionId,
        user_id: userId,
      });

      socket.emit("new_submission", response);

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
        className="create-sub-input"
        placeholder="YouTube Link"
        type="text"
        value={submissionLink}
        onChange={(e) => setSubmissionLink(e.target.value)}
      />
      <Link to={{ pathname: `/question/${questionId}/submissions` }}>
        {" "}
        <button onClick={handleCreateSubmission} className="create-sub-button">
          Submit
        </button>
      </Link>

      {isError && <p>{errorMessage || error.message}</p>}
    </div>
  );
};

export default CreateSubmission;
