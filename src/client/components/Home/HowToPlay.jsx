import "./HowToPlay.scss";
import { useNavigate } from "react-router-dom";

const HowToPlay = () => {
   const navigate = useNavigate();

   function goHome() {
      navigate("/home");
   }

   return (
      <div className="how-to-container">
         <div className="display-how-to">
            <div className="how-to-btn" onClick={goHome}>
               {/* <div onClick={toggleList} className="how-to-btn"> */}
               How to Play
               {/* <span>
                  {isOpen ? (
                     <FontAwesomeIcon icon={faCaretDown} />
                  ) : (
                     <FontAwesomeIcon icon={faSquareCaretUp} />
                  )}
               </span> */}
            </div>
            {/* {isOpen && ( */}
            <div className="dropdown-content">
               <ol>
                  <li>
                     Start by creating your own group or join an existing one{" "}
                  </li>
                  <li>
                     The group moderator sets the theme or question for everyone
                     to provide submissions
                  </li>
                  <li>Share your responses to the group's question </li>
                  <li>
                     Cast your votes on your favorite submissions. The more
                     votes, the higher the submission climbs on the leaderboard{" "}
                  </li>
                  <li>
                     See real-time results on the leaderboard as submissions
                     battle for the top spot{" "}
                  </li>
                  <li>
                     All done? Start again: In the same group, create a new
                     question to keep the fun going. Or, start fresh by creating
                     a brand new group{" "}
                  </li>
               </ol>
            </div>
            {/* )} */}
         </div>
      </div>
   );
};

export default HowToPlay;
