import { useLocation, useNavigate } from "react-router-dom";
import { useOauthMutation } from "../reducers/auth";
import { useEffect } from "react";

export default function OAuthHandler() {
   const [attemptOauth] = useOauthMutation();
   const location = useLocation();
   const navigate = useNavigate();
   let { hash } = location;
   let responseStr = hash.split("#")[1];

   useEffect(() => {
      let parsedTokenResponse = {};
      // Parse out the response string
      responseStr.split("&").forEach((s) => {
         const [k, v] = s.split("=");
         parsedTokenResponse[k] = v;
      });
      handleAuth(parsedTokenResponse);
   }, []);

   async function handleAuth(ptr) {
      const response = await fetch(
         "https://openidconnect.googleapis.com/v1/userinfo",
         {
            headers: {
               Authorization: `${ptr.token_type} ${ptr.access_token}`,
            },
         }
      );
      const parsedData = await response.json();
      const credentials = await {
         sub: parsedData.sub,
         email: parsedData.email,
      };
      await attemptOauth(credentials);
      navigate("/home");
   }

   return <div>Loading</div>;
}
