import { useGetSubmissionsForQuestionQuery } from "../../reducers/api";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const DisplaySubmissions = ({ questionId }) => {
  const socket = io.connect("http://localhost:3000");

  const { data: submissionsData, isLoading: submissionsLoading } =
    useGetSubmissionsForQuestionQuery(questionId);

  const { refetch } = useGetSubmissionsForQuestionQuery(questionId);

  useEffect(() => {
    socket.current = io.connect("http://localhost:3000");

    socket.current.on("connect", () => {});

    socket.current.on("new_submission", (newSubmission) => {
      console.log("new submission:", newSubmission);
      refetch(questionId);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Submissions:</h1>
      {submissionsLoading && <div>Loading submission...</div>}
      {!submissionsLoading &&
        (!submissionsData || submissionsData.length === 0) && (
          <div>No submissions found.</div>
        )}
      {!submissionsLoading && submissionsData && submissionsData.length > 0 && (
        <ul>
          {submissionsData.map((submission) => (
            <li key={submission.id}>
              <h3>{submission.link}</h3>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisplaySubmissions;
