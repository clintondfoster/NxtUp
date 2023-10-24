import { useGetVotesForSubQuery } from "../../reducers/api";
import { io } from "socket.io-client";
import { useEffect } from "react";

const AllVotes = ({ submissionId }) => {
  const { data, isLoading } = useGetVotesForSubQuery(submissionId);

    //socket logic
    useEffect(() => {
      const socket = io.connect("http://localhost:3000");
  
  
      socket.on("connect", () => {});
  
      socket.on("new_vote", (data) => {
        console.log("vote changed", data);
        refetch(submissionId);
      });
  
      return () => {
        socket.disconnect();
      };
    }, []);
  
    const { refetch } = useGetVotesForSubQuery(submissionId);

  return (
    <>
      {isLoading ? (
        null
      ) : (
        data.length > 0 && <section> {data.length} </section>
      )}
    </>
  );
};

export default AllVotes;
