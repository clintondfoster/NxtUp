import { useGetVotesForSubQuery } from "../../reducers/api";
import { io } from "socket.io-client";
import { useEffect } from "react";

const AllVotes = ({ submissionId }) => {
  const { data, isLoading, refetch } = useGetVotesForSubQuery(submissionId);

  //socket logic
  useEffect(() => {
    const socket = io.connect("http://localhost:3000");

    socket.on("connect", () => {});

    socket.on("new_vote", (submissionId) => {
      console.log("AllVotes socket connected:", socket.connected);
      // console.log("AllVotes submissionId:", submissionId);
      refetch(submissionId);
      // console.log("refetched");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // const { refetch } = useGetVotesForSubQuery(submissionId);
  // console.log('sub id from all votes', submissionId)

  return (
    <>
      {isLoading ? null : data.length > 0 && <section> {data.length} </section>}
    </>
  );
};

export default AllVotes;
