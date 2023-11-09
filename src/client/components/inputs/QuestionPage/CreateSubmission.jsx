import { useEffect, useState } from "react";
import { useAddSubmissionMutation } from "../../../reducers/api";
import io from "socket.io-client";
import "./CreateSubmission.scss";
import ConditionalLink from "./ConditionalLink";


const CreateSubmission = ({ groupId, userId, questionId }) => {
 const [submissionLink, setSubmissionLink] = useState("");
 const [isValidLink, setIsValidLink] = useState(false);


 const [createSubmission, { isSuccess, isError, error }] =
   useAddSubmissionMutation();
 const [errorMessage, setErrorMessage] = useState(null);
 const [successMessage, setSuccessMessage] = useState(null);


 const socket = io.connect("https://voti.onrender.com", {
  cors: {
    origin: ["http://localhost:3000", "https://voti.onrender.com"],
    methods: ["GET", "POST"]
  },
});



 useEffect(() => {
   setIsValidLink(checkYoutubeLink());
 }, [submissionLink]);


 function checkYoutubeLink() {
   const url = submissionLink;
   const p =
     /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
   if (url.match(p)) {
     return true;
   }
   return false;
 }


 const handleCreateSubmission = async () => {
   const videoId = submissionLink.split("v=")[1];


   try {
     const response = await createSubmission({
       link: videoId,
       group_id: groupId,
       question_id: questionId,
       user_id: userId,
     });


     socket.emit("new_submission", response);


    
     setSubmissionLink("");
     setSuccessMessage("Submission successfully created!");
   } catch (err) {
    
     setErrorMessage("Failed to create submission. Please try again.");
   }
 };


 return (
   <div>
     <input
       className="create-sub-input"
       placeholder="YouTube Link"
       type="text"
       value={submissionLink}
       onChange={(e) => setSubmissionLink(e.target.value)}
     />
     <ConditionalLink
       condition={isValidLink}
       path={{ pathname: `/question/${questionId}/submissions` }}
     >
       <button
         onClick={() => {
           if (checkYoutubeLink()) {
             handleCreateSubmission();
           } else {
             alert("Invalid Youtube Link!");
           }
         }}
         className="create-sub-button"
       >
         Submit
       </button>
     </ConditionalLink>


     {isError && <p>{errorMessage || error.message}</p>}
   </div>
 );
};


export default CreateSubmission;
