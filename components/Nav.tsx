import styles from '../styles/Nav.module.css'
import Link from 'next/link'
import Image from 'next/image'

export default function Nav() {
    return(
        <div className={styles.grid_item}>
            <div className={styles.nav}>
                <ul>
                    <li className={styles.current}>
                        <Link href='/home'>
                            <div>
                                <Image src='/homeIcon.svg' width={30} height={30} /> 
                                <p>Dashboard</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href='/incomes'>
                            <div>
                                <Image src='/incomeIcon.svg' width={40} height={40} />
                                <p>Receitas</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href='expenses'>
                            <div>
                                <Image src='/expenseIcon.svg' width={40} height={40} />
                                <p>Despesas</p>
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}