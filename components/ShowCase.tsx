import Image from 'next/image'
import styles from '../styles/SignInSignUp.module.css'

const SignInShowcase = () => (
    <div className={styles.hero}>
        <h1>Organizar sua vida financeira nunca foi tão fácil!</h1>
        <Image src='/heroImage.svg' width={350} height={350}></Image>
    </div>
)

const SignUpShowcase = () => (
    <div className={styles.hero}>
        <h1>Cadastre-se hoje para começar a poupar e ter tranquilidade financeira</h1>
        <Image src='/heroImage2.svg' width={350} height={350}></Image>
    </div>
)

export default function Showcase( { name }: { name: string } ) {
    if (name == 'sign in'){
        return <SignInShowcase />
    }
    return <SignUpShowcase />
}