import { auth, db } from "../config/firebase";
import router from "next/dist/client/router";
import styles from '../styles/Header.module.css';
import { ImExit } from 'react-icons/im';
import { FaUserCircle } from 'react-icons/fa';
import { useEffect, useState } from "react";
 
const Header = ({ pageName }) => {

    const [userName,setUserName] = useState('')
    const [showOptions,setshowOptions] = useState(false)

    const getUserName = () => {
        
        auth.onAuthStateChanged((user) => {
            if(user){
                db.collection('users').doc(user.uid)
                .get().then((doc) => {
                    if (doc.exists) {
                        setUserName(doc.data().name)
                    }else{
                        console.log('An error occurred')
                    }
                })
            }
        })
    }

    const logUserOut = () => {
        auth.signOut().then(() => {
            router.push('/')
        }).catch((error) => {
            console.log(error)
        });
    }
    
    const name = () => {
        if (pageName === 'home') {
            return 'Dashboard'
        }else if (pageName === 'incomes'){
            return 'Receitas'
        }else if (pageName === 'expenses'){
            return 'Despesas'
        }
    }

    useEffect(() => {
        getUserName()
    }, [])

    return (
        <div className={styles.header}>
            <header>{name()}</header>
            <div className={styles.user}>
                <span className={styles.user_name}>{userName}</span>
                <button className={styles.user_button} onClick={() => setshowOptions(!showOptions)}>
                    <FaUserCircle className={styles.user_icon}/>
                </button>
                {showOptions? (
                    <div className={styles.options}>
                        <button onClick={logUserOut}>
                            Sair <ImExit className={styles.exit_icon}/>
                        </button>
                    </div>
                    ):null}
            </div>
        </div>
     );
}
 
export default Header;