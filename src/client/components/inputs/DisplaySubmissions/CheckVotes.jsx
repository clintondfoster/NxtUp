import { useGetVotesForSubByUserQuery } from "../../../reducers/api";

const CheckVotes = ({submissionId}) => {
    const {data: voted} = useGetVotesForSubByUserQuery(submissionId);
    console.log('voted from checkVotes', voted, submissionId)


  return voted 
};

export default CheckVotes;

