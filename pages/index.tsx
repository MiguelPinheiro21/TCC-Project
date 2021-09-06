import ShowCase from "../components/ShowCase";
import SignInForm from "../components/SignInForm"
import styles from '../styles/SignInSignUp.module.css';

export default function SignIn() {
  return (
    <div className={styles.main_container}>
      <SignInForm />
      <ShowCase name = 'sign in'/>
    </div>
  )
}
