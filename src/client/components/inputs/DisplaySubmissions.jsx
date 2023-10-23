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

    return () => {
      socket.disconnect();
    };
  }, []);

  const { refetch } = useGetSubmissionsForQuestionQuery(questionId);

    // page tabs 
  const [activeTab, setActiveTab] = useState('leaderboard')

  const handleTabs = (tab) => {
    setActiveTab(tab)
  }

  //

  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    error,
  } = useGetSubmissionsForQuestionQuery(questionId);
  // console.log("Sub questionsId:", questionId);
  // console.log(`data from submissions`, submissionsData);

  if (submissionsLoading) return <div>Loading submission...</div>;
  if (!submissionsData || submissionsData.length === 0) {
    return <div>No submissions found.</div>;
  }
  // if (error) return <div>Error fetching submissions: {error.message}</div>;

  //Get top 5 submissions based on vote count
  const topFive = [...submissionsData]
    .sort((a, b) => b.Vote - a.Vote)
    .slice(0, 5);


  

  return (
    <div>
      <h1>switch between tabs (placeholder)</h1>
    <div className="tab-header">
      <button
        className={activeTab === 'leaderboard' ? 'active' : ''}
        onClick={() => handleTabs('leaderboard')}
      >
        Leaderboard
      </button>
      <button
        className={activeTab === 'allSubmissions' ? 'active' : ''}
        onClick={() => handleTabs('allSubmissions')}
      >
        All Submissions
      </button>
    </div>

    {activeTab === 'leaderboard' && (
     
      <table>
        
        <thead>
          <tr>
            <th>Rank</th>
            <th>Link</th>
            <th>User</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {topFive.map((submission, index) => (
            <tr key={submission.id}>
              <td>{index + 1}</td>
              <td>
              <VideoEmbed videoUrl={submission.link}/>
              </td>
              <td>{submission.user.username}</td>
              <td><AllVotes submissionId={submission.id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
   
    )}

    {activeTab === 'allSubmissions' && (
      <div>
        {/* <h1>All Submissions:</h1> */}
        <div>
          {submissionsData.map((submission) => (
            <div key={submission.id}>
              <VideoEmbed videoUrl={submission.link}/> 
              <CreateVote questionId={questionId} submissionId={submission.id} />
              <div style={{ display: "flex", alignItems: "center" }}>
                <section>Total Votes : {submission.Vote}</section>
                <AllVotes submissionId={submission.id} />
              </div>
              <span> User: {submission.user.username}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  );
};

export default DisplaySubmissions;
