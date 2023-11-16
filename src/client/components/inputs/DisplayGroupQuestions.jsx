import React from "react";
import { useGetQuestionByGroupIdQuery } from "../../reducers/api";
import CreateSubmission from "./CreateSubmission";
import DisplaySubmissions from "./DisplaySubmissions";
import Spinner from "../inputs/spinner/Spinner";

const DisplayQuestion = ({ groupId }) => {
   const { data, isLoading } = useGetQuestionByGroupIdQuery(groupId);

   if (isLoading) {
      return <Spinner />;
   }

   if (data) {
      const question = data;
      return (
         <div>
            <h1>{question.title}</h1>
            <DisplaySubmissions questionId={question.id} />
            <CreateSubmission
               groupId={question.group_id}
               questionId={question.id}
            />
         </div>
      );
   }

   return null;
};

export default DisplayQuestion;
