import {
  useGetSubmissionsForQuestionQuery,
  useGetQuestionByIdQuery,
  useGetVotesForSubQuery
} from "../../reducers/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import CreateVote from "../inputs/CreateVote";
import AllVotes from "./AllVotes";
import VideoEmbed from "./VideoEmbed";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


const DisplaySubmissions = ( ) => {
  const { questionId } = useParams();
  //socket logic
  useEffect(() => {
    const socket = io.connect("http://localhost:3000");

    socket.on("connect", () => {});

    socket.on("new_submission", (newSubmission) => {
      console.log("new submission:", newSubmission);
      refetch(questionId);
    });

    socket.on("new_vote", (submissionId) => {
      console.log("display submissions socket connected", socket.connected);
      refetch(questionId);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const { refetch } = useGetSubmissionsForQuestionQuery(questionId);
  // const { refetchVotes } = useGetVotesForSubQuery(submissionId);
  // console.log('sub id from display', submissionId)

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
    return <h2>{questionData.title}</h2>;
  };

  if (submissionsLoading) return <div>Loading submission...</div>;
  if (!submissionsData || submissionsData.length === 0) {
    return <div>Input a link to create a submission.</div>;
  }

  return (
    <div>
      {renderQuestion()}
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
              pathname: `/question/${questionId}/leaderboard`,
            }}
          >
            <button
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
              }}
              // onClick={refetch}
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
