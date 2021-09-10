import { useState } from "react";
import ShowCase from "../components/ShowCase";
import SignInForm from "../components/SignInForm"
import SignUpForm from "../components/SignUpForm";
import styles from '../styles/SignInSignUp.module.css';

export default function SignIn() {

  const [signIn,setSignIn] = useState(true);

  const changeView = () => setSignIn(!signIn)

  const signInSignUp = () => {
    if (signIn){
      return (
        <>
          <SignInForm changeView={changeView}/>
          <ShowCase name = 'sign in'/>
        </>
      )
    }
    return (
      <>
        <SignUpForm changeView={changeView} />
        <ShowCase name='sign up' />
      </>
    )
  }

  return (
    <div className={styles.container}>
      {signInSignUp()}
    </div>
  )
}
