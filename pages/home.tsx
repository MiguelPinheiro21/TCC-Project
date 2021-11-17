import { useState } from 'react';
import { MdGridOn } from 'react-icons/md'
import { RiLayoutColumnLine } from 'react-icons/ri'
import GridIncomesExpenses from '../components/GridIncomesExpenses';
import styles from '../styles/Home.module.css';

export default function home({showDetailedView, setShowDetailedView, isIncomeLoading, incomes, onSubmitIncome, handleDeleteIncomes, isExpenseLoading, expenses, onSubmitExpense, handleDeleteExpenses}) {

    return (
        <>
            <button className={styles.view_button} onClick={() => setShowDetailedView(!showDetailedView)}>{!showDetailedView? <MdGridOn className={styles.icon}/>:<RiLayoutColumnLine className={styles.icon}/>}</button>
            <div className={!showDetailedView? styles.side_by_side_table: styles.stack_table}>
                <GridIncomesExpenses showButton={false} showDetails={showDetailedView} isIncomeExpenseLoading={isIncomeLoading} tableName='Receitas' incomesExpenses={incomes} onSubmit={onSubmitIncome} handleDelete={handleDeleteIncomes}/>
                <GridIncomesExpenses showButton={false} showDetails={showDetailedView} isIncomeExpenseLoading={isExpenseLoading} tableName='Despesas' incomesExpenses={expenses} onSubmit={onSubmitExpense} handleDelete={handleDeleteExpenses}/>
            </div>
        </>
    )
}