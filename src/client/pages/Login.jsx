import AuthForm from "../components/authForm/AuthForm";

export default function Login() {
   function oauthRedirect() {}

   return (
      <div className="login-container">
         <div>
            <AuthForm />
         </div>
         <div></div>
         <div>
            <button onClick={oauthRedirect}></button>
         </div>
      </div>
   );
}
