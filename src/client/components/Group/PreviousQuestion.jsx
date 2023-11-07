import React from "react";
import { useParams } from "react-router-dom";
import { useGetInactiveQuestionsForGroupQuery } from "../../reducers/api";
import "./PreviousQuestion.scss";

const PreviousQuestion = () => {
   const { accessCode } = useParams();
   const { data, isLoading } = useGetInactiveQuestionsForGroupQuery(accessCode);
   return (
      <div className="previous-questions-container">
         <div className="questions-title">Previous Questions: </div>
         {isLoading ? (
            <span className="loader"></span>
         ) : (
            data.map((data) => (
               <div key={data.id}>
                  <li>{data.title}</li>
               </div>
            ))
         )}
      </div>
   );
};

export default PreviousQuestion;
