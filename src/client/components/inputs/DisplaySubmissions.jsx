import { useGetSubmissionsForQuestionQuery } from "../../reducers/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import CreateVote from "../inputs/CreateVote";
import AllVotes from "./AllVotes";
import VideoEmbed from "./VideoEmbed";
import { Link } from "react-router-dom";

const DisplaySubmissions = ({ questionId }) => {
  //socket logic
  useEffect(() => {
    const socket = io.connect("http://localhost:3000");

    socket.on("connect", () => {});

    socket.on("new_submission", (newSubmission) => {
      console.log("new submission:", newSubmission);
      refetch(questionId);
    });

    socket.on("new_vote", (submissionId) => {
      console.log("vote changed:", submissionId);
      refetch(questionId);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const { refetch } = useGetSubmissionsForQuestionQuery(questionId);

  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    error,
  } = useGetSubmissionsForQuestionQuery(questionId);

  if (submissionsLoading) return <div>Loading submission...</div>;
  if (!submissionsData || submissionsData.length === 0) {
    return <div>Input a link to create a submission.</div>;
  }



  return (
    <div>
      <div>
        <div>
          {submissionsData.map((submission) => {
            return (
              <div key={submission.id}>
                <div
                  style={{
                    border: "2px solid #000",
                    padding: "10px",
                    width: "355px",
                    backgroundColor: "gainsboro",
                    marginBottom: "12px",
                  }}
                >
                  <VideoEmbed videoUrl={submission.link} />
                  <CreateVote
                    questionId={questionId}
                    submissionId={submission.id}
                  />
                  <p> User: {submission.user.username}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <Link
            to={{
              pathname: `/question/${questionId}/results`,
            }}
          >
            <button
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
              }}
            >
              Submit
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DisplaySubmissions;
