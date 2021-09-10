import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import Image from 'next/image';
import Nav from '../components/Nav';
// import Link from 'next/link';
// import Table from '../components/Table';
// import GridIncomesExpenses from '../components/GridIncomesExpenses';
// import { Icon, InlineIcon } from '@iconify/react';
// import grid3x3 from '@iconify/icons-bi/grid-3x3';
import styles from '../styles/Home.module.css';
import GridIncomesExpenses from '../components/GridIncomesExpenses';
import { useRouter } from 'next/dist/client/router';


const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function home(){

    const [month, setMonth] = useState(String(new Date().getMonth()));
    const [year, setYear] = useState(String(new Date().getFullYear()));
    const [totalIncome, setTotalIncome] = useState('0,00');
    const [totalExpense, setTotalExpense] = useState('0,00');
    const [incomes,setIncomes] = useState([]);
    const [expenses,setExpenses] = useState([]);

    // Writing to the firestore ----
    const createIncomeExpense = (type: string, data: {date: any,description: string, amount: number}) => {
        
        if (!auth.currentUser.uid){
            alert('Não foi possível gravar a despesa.')
            return
        }
        
        const year = String(data.date.getFullYear())
        const month = monthNames[data.date.getMonth()]

        db.collection('users').doc(auth.currentUser.uid)
        .collection(type).doc(year)
        .collection(month).doc().set({
            date: data.date,
            description: data.description,
            amount: data.amount
        })
        .then(() => {
            console.log("Document successfully written!");
            getIncomesExpenses()
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }
    //Getting Incomes and Expenses from firestore ----
    const getIncomesExpenses = () =>{

        const selectedMonth = monthNames[month]

        auth.onAuthStateChanged((user) => {
            if (user) {
                // Getting Incomes
                db.collection('users').doc(user.uid)
                .collection('incomes').doc(year)
                .collection(selectedMonth)
                .get().then((querySnapshot) => {
                    
                    const incomesArr = []

                    querySnapshot.forEach((snapshot) => {
                        
                        incomesArr.push({
                            id: snapshot.id,
                            date: formatDate(snapshot.data().date.seconds),
                            description: snapshot.data().description,
                            amount: snapshot.data().amount,
                        })
                    })

                    setIncomes(incomesArr)
                    setTotalIncome(sumIncomesExpenses(incomesArr))
                })
            
                // Getting Expenses
                db.collection('users').doc(user.uid)
                .collection('expenses').doc(year)
                .collection(selectedMonth)
                .get().then((querySnapshot) => {
                    
                    const expensesArr = []

                    querySnapshot.forEach((snapshot) => {

                        expensesArr.push({
                            id: snapshot.id,
                            date: formatDate(snapshot.data().date.seconds),
                            description: snapshot.data().description,
                            amount: snapshot.data().amount,
                        })
                    })

                    setExpenses(expensesArr)
                    setTotalExpense(sumIncomesExpenses(expensesArr))
                })
            
            } else {
                console.log(user, 'Oh no, we are in else')
            }
        });

        
    }

    const formatDate = (seconds: number) =>{
        
        let dateObj = new Date(seconds * 1000)
        let day: string
        let month: string
        let currentMonth = dateObj.getMonth() + 1
        
        if (dateObj.getDate() < 10)
            day = `0${dateObj.getDate()}`
        else
            day = dateObj.getDate().toString()
        
        if (currentMonth < 10)
            month = `0${currentMonth}`
        else
            month = currentMonth.toString()


        return `${day}/${month}/${dateObj.getFullYear()}`
    }

    const sumIncomesExpenses = (incomesExpenses) => {
        let value: number

        if (incomesExpenses.length > 0){
            const values = incomesExpenses.map(incomeExpense => incomeExpense.amount)
            value = values.reduce((previousValue: number, currentValue: number) => {
                return previousValue + currentValue
            })
        }else{
            value = 0.00
        }
        
        return String(value.toFixed(2))
    }

    const onSubmitIncome = (data: {date:string,description:string,amount:string}) => {
        
        let dayMonthYear = data.date.split('-')
        let dateObj = new Date(`${dayMonthYear[1]}/${dayMonthYear[2]}/${dayMonthYear[0]}`)
        let amountValue = Number(data.amount)
        data.date = `${dayMonthYear[2]}/${dayMonthYear[1]}/${dayMonthYear[0]}`

        let newDataObj = {date: dateObj,description: data.description, amount: amountValue}

        createIncomeExpense('incomes', newDataObj)
    }

    const onSubmitExpense = (data: {date:string,description:string,amount:string}) => {

        let dayMonthYear = data.date.split('-')
        let dateObj = new Date(`${dayMonthYear[1]}/${dayMonthYear[2]}/${dayMonthYear[0]}`)
        let amountValue = Number(data.amount)
        data.date = `${dayMonthYear[2]}/${dayMonthYear[1]}/${dayMonthYear[0]}`

        let newDataObj = {date: dateObj,description: data.description, amount: amountValue}

        createIncomeExpense('expenses', newDataObj)
    }

    const handleDeleteIncomes = (id: string) => {

        let selectedMonth = monthNames[month]

        if (confirm('Deseja realmente excluir o registro?')) {
            db.collection('users').doc(auth.currentUser.uid)
            .collection('incomes').doc(year)
            .collection(selectedMonth).doc(id).delete().then(() => {
                console.log("Document successfully deleted!");
                getIncomesExpenses()
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }
    }

    const handleDeleteExpenses = (id: string) => {

        let selectedMonth = monthNames[month]

        if (confirm('Deseja realmente excluir o registro?')) {
            db.collection('users').doc(auth.currentUser.uid)
            .collection('expenses').doc(year)
            .collection(selectedMonth).doc(id).delete().then(() => {
                console.log("Document successfully deleted!");
                getIncomesExpenses()
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }
    }

    useEffect(() => {
        getIncomesExpenses()
    }, [month,year])

    const router = useRouter();

    return (
        <div className={styles.main_container}>
            <Nav />
            <div className={`${styles.grid_item} ${styles.grid_main_container}`}>
                <div className={styles.top_container}>
                    <div className={styles.header_menu}>
                        <header>Dashboard</header>
                    </div>
                    <button onClick={() => {
                        auth.signOut().then(() => {
                            router.push('/')
                          }).catch((error) => {
                            console.log(error)
                          });
                    }}><Image src='/personIcon.svg' alt='Profile picture' width={40} height={40}></Image></button>
                </div>
                <div className={styles.grid_incomes_expenses}>
                    <div className={styles.totals}>
                        <div className={styles.total_incomes_card}>
                            <div className={styles.card}>
                                <div className={styles.card_text}>
                                    <text>Receitas</text>
                                    <text>R$ {totalIncome}</text>
                                </div>
                                <Image src='/piggyIncome.svg' width={90} height={90}></Image>
                            </div>
                        </div>
                        <select name="months" id="months" defaultValue={month} onChange={(e) => setMonth(e.target.value)}>
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
                        <select name="years" id="years" defaultValue={new Date().getFullYear()} onChange={(e) => setYear(e.target.value)}>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                        </select>
                        <div className={styles.total_expenses_card}>
                            <div className={styles.card}>
                                <div className={styles.card_text}>
                                    <text>Despesas</text>
                                    <text>R$ {totalExpense}</text>
                                </div>
                                <Image src='/piggyExpense.svg' width={90} height={90}></Image>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className={styles.blocks_grids}>
                            {/* <Icon icon={grid3x3} style={{ color: '#000', fontSize: '31px' }} /> */}
                        </span>
                        <div className={styles.incomes_expenses}>
                            {/* <div className={styles.no_individual_incomes_expenses}>
                                <Table></Table>
                            </div>
                            <div className={styles.no_individual_incomes_expenses}>
                                <text>Nenhuma despesa cadastrada</text>
                            </div> */}
                            {/* <GridIncomesExpenses /> */}
                        </div>
                        <GridIncomesExpenses incomesExpenses={incomes} onSubmit={onSubmitIncome} handleDelete={handleDeleteIncomes}/>
                        <GridIncomesExpenses incomesExpenses={expenses} onSubmit={onSubmitExpense} handleDelete={handleDeleteExpenses}/>
                    </div>
                </div>
            </div>
        </div>
    )
}