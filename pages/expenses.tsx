import { useState } from 'react';
import GridIncomesExpenses from '../components/GridIncomesExpenses';
import styles from '../styles/IncomesExpenses.module.css';

export default function expenses({isExpenseLoading,expenses,onSubmitExpense,handleDeleteExpenses}){

    return (
        <div className={styles.single_table}>
            <GridIncomesExpenses showButton={true} showDetails={true} isIncomeExpenseLoading={isExpenseLoading} tableName='Despesas' incomesExpenses={expenses} onSubmit={onSubmitExpense} handleDelete={handleDeleteExpenses}/>
        </div>
    )
}