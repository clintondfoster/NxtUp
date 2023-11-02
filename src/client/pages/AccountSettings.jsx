import react from "react";
import UserProfile from "../components/inputs/UserProfile";
import NavB from "../components/Navbar";
import UserHistory from "../components/inputs/UserHistory";

function AccountSettings() {
   return (
      <div>
         <NavB />
         <div>
            <h2>Login information</h2>
         </div>
         <h2>Account Settings</h2>
         <UserProfile />
         <UserHistory />
      </div>
   );
}

export default AccountSettings;
