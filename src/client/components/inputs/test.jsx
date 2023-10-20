import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useGetSubmissionsForQuestionQuery } from "../../reducers/api";

const DisplaySubmissions = ({ questionId }) => {
  const [submissions, setSubmissions] = useState([]); // State to manage submissions
  const { data: submissionsData, isLoading: submissionsLoading } =
    useGetSubmissionsForQuestionQuery(questionId);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io.connect("http://localhost:3000");

    socket.current.on("connect", () => {});

    socket.current.on("new_submission", (newSubmission) => {
      // Update the submissions state with the new submission
      setSubmissions((prevSubmissions) => [
        ...prevSubmissions,
        newSubmission.data,
      ]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // When the data from the database query changes, update the submissions state
  useEffect(() => {
    if (submissionsData) {
      setSubmissions(submissionsData);
    }
  }, [submissionsData]);

  return (
    <div>
      <h1>Submissions:</h1>
      {submissionsLoading && <div>Loading submission...</div>}
      {!submissionsLoading && submissions.length === 0 && (
        <div>No submissions found.</div>
      )}
      {!submissionsLoading && submissions.length > 0 && (
        <ul>
          {submissions.map((submission) => (
            <li key={submission.id}>
              <h3>{submission.link}</h3>
              {/* <span>User: {submission.user.username}</span> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisplaySubmissions;



 //* display submissions socket logic 
  // const socket = io.connect("http://localhost:3000");

  // useEffect(() => {
  //   socket.current = io.connect("http://localhost:3000");

  //   socket.current.on('connect', () => {
  //   });

  //   socket.current.on('new_submission', (newSubmission) => {
  //     console.log('new submission:', newSubmission.data);
  //   });

  //   return () => {
  //     socket.current.disconnect();
  //   };
  // }, []);