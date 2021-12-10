import Image from 'next/image';
import Link from 'next/link'
import styles from '../styles/MainPanel.module.css';

const MainPanel = ({ totalIncome, totalExpense, month, year, setMonth, setYear }) => {

    const formatNumber = (total:any) => {
        
        total = Number(total)

        if (typeof total === 'number' && !Number.isNaN(total)) {
            let value = new Intl.NumberFormat('pt-BR').format(total)

            if(value.indexOf(',') === -1){
                value += ',00'
            }
            return value   
        }
        return '0,00'
    }

    return ( 
        <div className={styles.panel}>
            <Link href='/incomes'>
                <div className={styles.card}>
                    <div className={styles.text}>
                        <span>Receitas</span>
                        <span>R$ {formatNumber(totalIncome)}</span>
                    </div>
                    <Image src='/piggyIncome.svg' width={90} height={90}></Image>
                </div>
            </Link>
            <select name="months" id="months" className={styles.month} defaultValue={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="0">Janeiro</option>
                <option value="1">Fevereiro</option>
                <option value="2">Março</option>
                <option value="3">Abril</option>
                <option value="4">Maio</option>
                <option value="5">Junho</option>
                <option value="6">Julho</option>
                <option value="7">Agosto</option>
                <option value="8">Setembro</option>
                <option value="9">Outubro</option>
                <option value="10">Novembro</option>
                <option value="11">Dezembro</option>
            </select>
            <select name="years" id="years" className={styles.year} defaultValue={year} onChange={(e) => setYear(e.target.value)}>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
            </select>
            <Link href='/expenses'>
                <div className={styles.card}>
                    <div className={styles.text}>
                        <span>Despesas</span>
                        <span>R$ {formatNumber(totalExpense)}</span>
                    </div>
                    <Image src='/piggyExpense.svg' width={90} height={90}></Image>
                </div>
            </Link>
        </div>
     );
}

export default MainPanel;