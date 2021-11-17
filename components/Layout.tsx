import Head from 'next/head'
import Nav from './Nav'
import styles from '../styles/Layout.module.css';
import Header from './Header';
import MainPanel from './MainPanel';

// From Home
import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
// From Home ---

const Layout = ({ children }) => {

    // From Home
    const [isIncomeLoading,setIsIncomeLoading] = useState(true);
    const [isExpenseLoading,setIsExpenseLoading] = useState(true);
    const [month,setMonth] = useState(String(new Date().getMonth()));
    const [year,setYear] = useState(String(new Date().getFullYear()));
    const [totalIncome,setTotalIncome] = useState('0,00');
    const [totalExpense,setTotalExpense] = useState('0,00');
    const [incomes,setIncomes] = useState([]);
    const [expenses,setExpenses] = useState([]);
    const [showDetailedView,setShowDetailedView] = useState(false);

    // Writing to the firestore ----
    const createIncomeExpense = (type: string, data: {name: string,description: string,date: any,amount: number}) => {
        
        if (!auth.currentUser.uid){
            alert('Não foi possível gravar a despesa.')
            return
        }
        
        const year = String(data.date.getFullYear())
        const month = monthNames[data.date.getMonth()]

        db.collection('users').doc(auth.currentUser.uid)
        .collection(type).doc(year)
        .collection(month).doc().set({
            name: data.name,
            description: data.description,
            date: data.date,
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
    const getIncomesExpenses = () => {

        const selectedMonth = monthNames[month]

        auth.onAuthStateChanged((user) => {
            if (user) {
                // Getting Incomes
                
                setIsIncomeLoading(true)

                db.collection('users').doc(user.uid)
                .collection('incomes').doc(year)
                .collection(selectedMonth)
                .get().then((querySnapshot) => {
                    
                    const incomesArr = []

                    querySnapshot.forEach((snapshot) => {
                        
                        incomesArr.push({
                            id: snapshot.id,
                            name: snapshot.data().name,
                            description: snapshot.data().description,
                            date: formatDate(snapshot.data().date.seconds),
                            amount: snapshot.data().amount,
                        })
                    })

                    setIncomes(incomesArr)
                    setTotalIncome(sumIncomesExpenses(incomesArr))
                    setIsIncomeLoading(false)
                })
            
                // Getting Expenses

                setIsExpenseLoading(true)

                db.collection('users').doc(user.uid)
                .collection('expenses').doc(year)
                .collection(selectedMonth)
                .get().then((querySnapshot) => {
                    
                    const expensesArr = []

                    querySnapshot.forEach((snapshot) => {

                        expensesArr.push({
                            id: snapshot.id,
                            name: snapshot.data().name,
                            description: snapshot.data().description,
                            date: formatDate(snapshot.data().date.seconds),
                            amount: snapshot.data().amount,
                        })
                    })

                    setExpenses(expensesArr)
                    setTotalExpense(sumIncomesExpenses(expensesArr))
                    setIsExpenseLoading(false)
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

    const onSubmitIncome = (data: {name: string,description:string,date:string,amount:string}) => {
        
        let dayMonthYear = data.date.split('-')
        let dateObj = new Date(`${dayMonthYear[1]}/${dayMonthYear[2]}/${dayMonthYear[0]}`)
        let amountValue = Number(data.amount)
        data.date = `${dayMonthYear[2]}/${dayMonthYear[1]}/${dayMonthYear[0]}`

        let newDataObj = {name: data.name, description: data.description, date: dateObj, amount: amountValue}

        createIncomeExpense('incomes', newDataObj)
    }

    const onSubmitExpense = (data: {name: string,description:string,date:string,amount:string}) => {

        let dayMonthYear = data.date.split('-')
        let dateObj = new Date(`${dayMonthYear[1]}/${dayMonthYear[2]}/${dayMonthYear[0]}`)
        let amountValue = Number(data.amount)
        data.date = `${dayMonthYear[2]}/${dayMonthYear[1]}/${dayMonthYear[0]}`

        let newDataObj = {name:data.name,description: data.description,date: dateObj, amount: amountValue}

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
    // From Home ---

    const display = () => {
        if (children.type.name !== 'SignInSignUp') {

            const page = children.type

            const displayPageContent = () => {
                if (children.type.name == 'home') {
                    return page({
                            showDetailedView,setShowDetailedView,
                            isIncomeLoading,incomes,onSubmitIncome,handleDeleteIncomes,
                            isExpenseLoading,expenses,onSubmitExpense,handleDeleteExpenses
                        })
                }else if (children.type.name == 'incomes'){
                    return page({isIncomeLoading,incomes,onSubmitIncome,handleDeleteIncomes})
                }else if (children.type.name == 'expenses'){
                    return page({isExpenseLoading,expenses,onSubmitExpense,handleDeleteExpenses})
                }
            }

            return (
                <div className={styles.main_container}>
                    <Nav pageName={children.type.name}/>
                    <div className={styles.page}>
                        <Header pageName={children.type.name}/>
                        <MainPanel 
                            totalIncome={totalIncome} 
                            totalExpense={totalExpense} 
                            month={month} 
                            year={year} 
                            setMonth={setMonth} 
                            setYear={setYear}
                        />
                        {displayPageContent()}
                    </div>
                </div>
            )
        }

        return (<>{children}</>)
    }

    return(
        <div>
            <Head>
                <title>Personal Finance App</title>
                <meta name="Personal Finance App" content="Control your personal finances" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {display()}
            </main>
        </div>
    )
}

export default Layout