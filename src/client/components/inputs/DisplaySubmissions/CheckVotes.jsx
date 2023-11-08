import React from "react";
import { useGetVotesForSubByUserQuery } from "../../../reducers/api";

const CheckVotes = ({submissionId}) => {
    const {data: votes} = useGetVotesForSubByUserQuery(submissionId);
    const voteExists = !!votes  
   

    
    

  return voteExists

};

export default CheckVotes;

