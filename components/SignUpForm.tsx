import { useForm } from 'react-hook-form';
import { auth, db } from '../config/firebase';
import Link from 'next/link';
import styles from '../styles/SignInSignUp.module.css';
import { useRouter } from 'next/dist/client/router';

interface SignUpData {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export default function SignUpForm() {
    const { register, formState: { errors }, reset, handleSubmit } = useForm();

    const router = useRouter();

    const onSubmit = (data: SignUpData) => {

        if (data.password != data.passwordConfirm)
            return alert('As senhas não são iguais.');
        return signUp(data).then(() => {
            auth.onAuthStateChanged((user) =>{
                if (user){
                    console.log(user)
                }
            })
            reset();
            alert('Conta criada com sucesso!');
            router.push('/home')
        });
    };
    
    const signUp = ({ name, email, password }) => {
        return auth
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
        return createUser({ uid: response.user.uid, email, name });
        })
        .catch((error) => {
        return { error };
        });
    };
    
    const createUser = (user: {uid: string,name: string,email:string}) => {
        return db
        .collection('users')
        .doc(user.uid)
        .set({
            name: user.name,
            email: user.email,
        })
        .then(() => {
        console.log("Document successfully written!")
        })
        .catch((error) => {
        console.log('Error while writing the document: ' + error)
        });
    };

    return (
        <div className={styles.form_signup_container}>
            <h2>Cadastrar</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.input_group}>
                <label htmlFor='name'>Nome</label>
                <input 
                    type='text' 
                    id='name' 
                    name='name' 
                    placeholder='John Doe'
                    {...register('name',{
                        required: 'Por favor, digite o seu nome.',
                    })}
                />
                {errors.name && (
                    <div className={styles.error_message}>
                    {errors.name.message}
                    </div>
                )}
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
                    placeholder='digite sua senha'
                    {...register('password',{
                        required: 'Por favor digite uma senha.',
                        minLength: {
                            value: 6,
                            message: 'A senha deve ter no mínimo 6 caracteres.',
                        },
                    })}
                />
                {errors.password && (
                    <div className={styles.error_message}>
                    {errors.password.message}
                    </div>
                )}
            </div>
            <div className={styles.input_group}>
                <label htmlFor='confirmPassword'>Confirmar Senha</label>
                <input 
                    type='password' 
                    id='confirmPassword' 
                    name='confirmPassword' 
                    placeholder='confirme sua senha'  
                    {...register('passwordConfirm',{
                        required: 'Por favor digite uma senha.',
                        minLength: {
                            value: 6,
                            message: 'A senha deve ter no mínimo 6 caracteres.',
                        },
                    })}
                />
                {errors.passwordConfirm && (
                    <div className={styles.error_message}>
                    {errors.passwordConfirm.message}
                    </div>
                )}
            </div>
            <button type='submit' className={styles.button_enter}>Cadastrar</button>
            <Link href='/' >Entrar</Link>
            </form> 
        </div>
    )
}