import { useGetSubmissionsForQuestionQuery } from "../../reducers/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import CreateVote from "../inputs/CreateVote";
import AllVotes from "./AllVotes";
import VideoEmbed from "./VideoEmbed";

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

  // page tabs
  const [activeTab, setActiveTab] = useState("leaderboard");

  const handleTabs = (tab) => {
    setActiveTab(tab);
  };

  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    error,
  } = useGetSubmissionsForQuestionQuery(questionId);

  if (submissionsLoading) return <div>Loading submission...</div>;
  if (!submissionsData || submissionsData.length === 0) {
    return <div>No submissions found.</div>;
  }

  //Get top submissions based on vote count
  const topVoted = [...submissionsData]
    .sort((a, b) => b.Vote.length - a.Vote.length)


    console.log("submissionsData:", submissionsData);
    console.log("topVoted:", topVoted);

  return (
    <div>
      <h1>switch between tabs (placeholder)</h1>
      <div className="tab-header">
        <button
          className={activeTab === "leaderboard" ? "active" : ""}
          onClick={() => handleTabs("leaderboard")}
        >
          Leaderboard
        </button>
        <button
          className={activeTab === "allSubmissions" ? "active" : ""}
          onClick={() => handleTabs("allSubmissions")}
        >
          All Submissions
        </button>
      </div>

      {activeTab === "leaderboard" && (
        <div className="submission-container">
          <div>
            {topVoted.map((submission, index) => (
              <div key={submission.id}>
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
            ))}
          </div>
        </div>
      )}

      {activeTab === "allSubmissions" && (
        <div>
          <div>
            {submissionsData.map((submission) => {
              return (
                <div key={submission.id}>
                  <VideoEmbed videoUrl={submission.link} />
                  <CreateVote
                    questionId={questionId}
                    submissionId={submission.id}
                  />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <section>Total Votes :  </section>
                    <AllVotes submissionId={submission.id} />
                  </div>
                  <p> User: {submission.user.username}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplaySubmissions;
