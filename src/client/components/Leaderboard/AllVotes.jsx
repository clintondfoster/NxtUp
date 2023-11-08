import { useGetVotesForSubQuery  } from "../../reducers/api";
import { io } from "socket.io-client";
import { useEffect } from "react";
import "./AllVotes.scss";

const AllVotes = ({ submissionId }) => {
  const { data, isLoading, refetch } = useGetVotesForSubQuery(submissionId);

  //socket logic
  useEffect(() => {
    const socket = io.connect("http://localhost:3000", {
  cors: {
    origin: ["http://localhost:3000", "https://voti.onrender.com"],
    methods: ["GET", "POST"]
  },
});


    socket.on("connect", () => {});

    socket.on("new_vote", (submissionId) => {
     
      //
      refetch(submissionId);
      //
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // const { refetch } = useGetVotesForSubQuery(submissionId);
  //

  return (
    <>
      {isLoading ? null : data.length > 0 && <div className="votes"> {data.length} </div>}
    </>
  );
};

export default AllVotes;
