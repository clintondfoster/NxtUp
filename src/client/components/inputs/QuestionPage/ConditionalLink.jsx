import { Link } from "react-router-dom";


function ConditionalLink({ condition, path, children }) {
 if (condition) {
   return <Link to={path}>{children}</Link>;
 } else {
   return <div>{children}</div>;
 }
}


export default ConditionalLink;