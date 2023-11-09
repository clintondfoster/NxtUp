import {
  useGetSubmissionsForQuestionQuery,
  useGetVotesForSubQuery,
  useGetQuestionByIdQuery,
} from "../reducers/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Chart from "../components/Chart/Chart";
import AllVotes from "../components/Leaderboard/AllVotes";
import VideoEmbed from "../components/Leaderboard/VideoEmbed";
import { useParams, Link } from "react-router-dom";
import "./Leaderboard.scss";

const Leaderboard = () => {
  const { questionId } = useParams();

  useEffect(() => {
    const socket = io.connect("https://voti.onrender.com", {
      cors: {
        origin: ["http://localhost:3000", "https://voti.onrender.com"],
        methods: ["GET", "POST"],
      },
    });

    socket.on("connect", () => {});

    socket.on("new_submission", (newSubmission) => {
      refetch(questionId);
    });

    socket.on("new_vote", (submissionId) => {
      refetch(questionId);
      // topVoted.forEach((submission) => refetchVotes(submission.id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const { refetch } = useGetSubmissionsForQuestionQuery(questionId);
  // const { refetchVotes } = useGetVotesForSubQuery(submissionId);

  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    error,
  } = useGetSubmissionsForQuestionQuery(questionId);

  const { data: questionData, isLoading: questionLoading } =
    useGetQuestionByIdQuery(questionId);

  const renderQuestion = () => {
    if (questionLoading) return <div>Loading question...</div>;
    if (!questionData) return null;
    return <div>{questionData.title}</div>;
  };

  if (submissionsLoading) return <div>Loading submission...</div>;
  if (!submissionsData || submissionsData.length === 0) {
    return <div>Input a link to create a submission.</div>;
  }

  const topVoted = [...submissionsData].sort(
    (a, b) => b.Vote.length - a.Vote.length
  );

  return (
    <div className="lb-container">
      <div className="lb-question">
        <h2>{renderQuestion()}</h2>
      </div>
      <div className="lb-header">
        <h2>Leaderboard</h2>
      </div>

      <div className="lb-video-list">
        {topVoted.map((submission, index) => (
          <div className="lb-video-container" key={submission.id}>
            <div>
              <VideoEmbed videoUrl={submission.link} />
            </div>
            <div className="lb-votes">
              <AllVotes submissionId={submission.id} />
            </div>
          </div>
        ))}
        <div>
          <Link
            to={{
              pathname: `/question/${questionId}/submissions`,
            }}
          >
            <button className="ds-back-button">
              BACK
            </button>
          </Link>
        </div>
      </div>
      <div className="lb-chart">
        <Chart questionId={questionId} />
      </div>
    </div>
  );
};

export default Leaderboard;
