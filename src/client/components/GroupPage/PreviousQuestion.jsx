import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faSquareCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useGetInactiveQuestionsForGroupQuery } from "../../reducers/api";
import "./PreviousQuestion.scss";

const PreviousQuestion = () => {
  const { accessCode } = useParams();
  const { data, isLoading } = useGetInactiveQuestionsForGroupQuery(accessCode);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="display-group-container">
      <div className="display-my-groups">
        <div
          className="groups-btn"
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setIsOpen(false)}
        >
          Previous Questions
          <span>
            {isOpen ? (
              <FontAwesomeIcon icon={faCaretDown} />
            ) : (
              <FontAwesomeIcon icon={faSquareCaretUp} />
            )}
          </span>
        </div>
        {isOpen && (
          <div className="previousQ-dropdown-content">
            <ul>
              {data.map((data) => (
                <div className="pq-content" key={data.id}>
                  <li>{data.title}</li>
                  <section style={{fontSize:"11px"}}> Total Submissions: {data.Submission.length}</section>
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default PreviousQuestion;
