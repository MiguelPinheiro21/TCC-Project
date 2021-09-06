import Showcase from '../components/ShowCase';
import SignUpForm from '../components/SignUpForm';
import styles from '../styles/SignInSignUp.module.css';

export default function SignUp() {
    return (
        <div className={styles.main_container}>
            <SignUpForm />
            <Showcase name='sign up' />
        </div>
    )
}