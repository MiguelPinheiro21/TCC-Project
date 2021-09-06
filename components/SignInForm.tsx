import { useForm } from 'react-hook-form';
import { auth} from '../config/firebase';
import Link from 'next/link';
import styles from '../styles/SignInSignUp.module.css';
import { useRouter } from 'next/dist/client/router';

interface SignUpData {
    email: string;
    password: string;
}

export default function SignInForm() {
    
    const router = useRouter();
    const { register, formState: { errors }, handleSubmit } = useForm();
    const onSubmit = (data: SignUpData) => {

        auth.signInWithEmailAndPassword(data.email,data.password)
        .then((userCredential) => {
            let user = userCredential.user;
            // console.log(user)
            router.push('/home')
          })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;

            if (errorCode === 'auth/user-not-found'){
                alert('O email informado não foi encontrado.')
            }else if (errorCode === 'auth/wrong-password'){
                alert('O email ou senha estão errados.')
            }
            console.log(errorCode,errorMessage)
        });
    };

    return (
        <div className={styles.form_container}>
            <h2>Entrar</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.input_group}>
                <label htmlFor='email'>Email</label>
                <input 
                    type='text' 
                    id='email' 
                    name='email' 
                    placeholder='exemplo@email.com'
                    {...register('email',{
                    required: 'Por favor, digite um email.',
                    pattern: {
                    value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: 'Digite um email válido.',
                    }
                })}
                />
                {errors.email && (
                    <div className={styles.error_message}>
                    {errors.email.message}
                    </div>
                )}
                </div>
                <div className={styles.input_group}>
                <label htmlFor='password'>Senha</label>
                <input 
                    type='password' 
                    id='password' 
                    name='password' 
                    placeholder='********'
                    {...register('password',{
                    required: 'Por favor digite a senha.',
                })}
                />
                {errors.password && (
                    <div className={styles.error_message}>
                    {errors.password.message}
                    </div>
                )}
                </div>
                <button type='submit' className={styles.button_enter} >Entrar</button>
                <Link href='/signup'>Cadastre-se</Link>
            </form>
        </div>
    )
}