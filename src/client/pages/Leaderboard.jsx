import { useGetSubmissionsForQuestionQuery } from "../reducers/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Chart from "../components/Chart/Chart";
import AllVotes from "../components/inputs/AllVotes";
import VideoEmbed from "../components/inputs/VideoEmbed";
import { useParams } from "react-router-dom";

const Leaderboard = () => {
  const { questionId } = useParams();

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
  //   console.log('submission data from leaderboard', submissionsData)
  //   console.log('question ID from leaderboard', questionId)

  if (submissionsLoading) return <div>Loading submission...</div>;
  if (!submissionsData || submissionsData.length === 0) {
    return <div>Input a link to create a submission.</div>;
  }

  const topVoted = [...submissionsData].sort(
    (a, b) => b.Vote.length - a.Vote.length
  );

  return (
    <div>
      <div>
        {topVoted.map((submission, index) => (
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
              <div>
                <VideoEmbed videoUrl={submission.link} />
              </div>
              <div className="user-votes">
                <p>{submission.user.username}</p>
                <div>
                  <AllVotes submissionId={submission.id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Chart questionId={questionId} />
      </div>
    </div>
  );
};

export default Leaderboard;
