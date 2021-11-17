import { useState } from 'react';
import GridIncomesExpenses from '../components/GridIncomesExpenses';
import styles from '../styles/IncomesExpenses.module.css';

export default function incomes({isIncomeLoading, incomes, onSubmitIncome, handleDeleteIncomes}){

    return (
        <div className={styles.single_table}>
            <GridIncomesExpenses showButton={true} showDetails={true} isIncomeExpenseLoading={isIncomeLoading} tableName='Receitas' incomesExpenses={incomes} onSubmit={onSubmitIncome} handleDelete={handleDeleteIncomes}/>
        </div>
    )
}