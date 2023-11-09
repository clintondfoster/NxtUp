import React from 'react'
import { useGetQuestionByGroupIdQuery } from '../../reducers/api'
import CreateSubmission from "./CreateSubmission";
import DisplaySubmissions from './DisplaySubmissions';

const DisplayQuestion = ({ groupId }) => {
    const { data, isLoading } = useGetQuestionByGroupIdQuery(groupId);

    if (isLoading) {
        return <div>Loading...</div>;
      }
    
      if (data) {
        const question = data;
       
    
        return (
          <div>
            <h1>{question.title}</h1>
            <DisplaySubmissions questionId={question.id} /> 
            <CreateSubmission groupId={question.group_id} questionId={question.id}/>
          </div>
        );
      }
    
      return null;
}

export default DisplayQuestion
