import {
  useGetSubmissionsForQuestionQuery,
  useGetQuestionByIdQuery,
  useGetVotesForSubByUserQuery,
} from "../reducers/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import CreateVote from "../components/inputs/DisplaySubmissions/CreateVote";
import AllVotes from "../components/Leaderboard/AllVotes";
import VideoEmbed from "../components/Leaderboard/VideoEmbed";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./DisplaySubmissions.scss";
import CheckVotes from "../components/inputs/DisplaySubmissions/CheckVotes";

const DisplaySubmissions = () => {
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

  const [voteClicked, setVoteClicked] = useState(false);

  const [clickedVideoId, setClickedVideoId] = useState(null);

  const handleVoteClick = (submissionId) => {
    !clickedVideoId ? setClickedVideoId(submissionId) : setClickedVideoId(null);
    !voteClicked ? setVoteClicked(true) : setVoteClicked(false);
  };

  const { refetch } = useGetSubmissionsForQuestionQuery(questionId);

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
    <div className="ds-container">
      <div className="ds-question">{renderQuestion()}</div>
      <div className="ds-video-list">
        {submissionsData.map((submission) => {
          const isClicked = submission.id === clickedVideoId;
          return (
            <div
              // className={`ds-video-container${
              //   isClicked ? " vote-clicked" : ""
              // }`}
              key={submission.id} 
            >
              <div>
                <div>
                  <VideoEmbed videoUrl={submission.link} />
                </div>
                <div className="ds-voting">
                  <div onClick={() => handleVoteClick(submission.id)}>
                    <CreateVote
                      questionId={questionId}
                      submissionId={submission.id}
                    /> 
                    {/* {CheckVotes(submission.id) && <h1>true</h1>} */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div>
          <Link
            to={{
              pathname: `/question/${questionId}/leaderboard`,
            }}
          >
            <button
              className="ds-submit-button"
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
