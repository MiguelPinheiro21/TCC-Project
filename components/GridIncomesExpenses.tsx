import { useForm } from 'react-hook-form'
import styles from '../styles/GridIncomesExpenses.module.css'
import { BsFillXCircleFill } from 'react-icons/bs'
import { IoMdAdd } from 'react-icons/io'
import { FaTrash } from 'react-icons/fa'
import { useState } from 'react'


type incomesExpensesType = {
    tableName: string,
    showButton: boolean,
    showDetails: boolean,
    isIncomeExpenseLoading: boolean,
    incomesExpenses: {
        id: number,
        name: string,
        description: string,
        date: string,
        amount: string
    }[],
    onSubmit: any,
    handleDelete: Function
}

type formFields = {
    name: string;
    description: string;
    date: string;
    amount: string;
}

export default function GridIncomesExpenses({showButton, showDetails, isIncomeExpenseLoading, tableName, incomesExpenses, onSubmit, handleDelete}: incomesExpensesType) {
    
    const {register, formState: { errors }, handleSubmit, reset} = useForm<formFields>();
    const [showModal,setShowModal] = useState(false);

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

    const resetForm = () => {
        reset({name: null,description: null,date: null,amount: null})
    }

    const formRegister = () => {
        return (
            <>
                <div className={styles.darken}/>
                <div className={styles.modal}>
                    <button className={styles.close_button} onClick={() => {setShowModal(false);resetForm()}}><BsFillXCircleFill/></button>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.income_expense_form}>
                    
                        <div className={styles.form_input}>
                            <label htmlFor="Name">Nome</label>
                            <input type="text" className="Name" {...register('name',{required: 'O campo Nome não foi preenchido.'})}/>
                            
                            {errors.name && (
                                <div className={styles.error_message}>
                                {errors.name.message}
                                </div>
                            )}

                            <label htmlFor="Description">Descrição</label>
                            <input type="text" className="Description" {...register('description',{required: 'O campo Descrição não foi preenchido.'})}/>
                            
                            {errors.description && (
                                <div className={styles.error_message}>
                                {errors.description.message}
                                </div>
                            )}

                            <label htmlFor="Date">Data</label>
                            <input type="date" className="Date" {...register('date', {required: 'O campo Data não foi preenchido.'})}/>
                            
                            {errors.date && (
                                <div className={styles.error_message}>
                                {errors.date.message}
                                </div>
                            )}

                            <label htmlFor="Amount">Valor</label>
                            <input type="text" className="Amount" {...register('amount',{required: 'O campo Valor não foi preenchido.'})}/>
                            
                            {errors.amount && (
                                <div className={styles.error_message}>
                                {errors.amount.message}
                                </div>
                            )}
                        </div>

                        <div className={styles.buttons}>
                            <button type="reset" onClick={() => {setShowModal(false);resetForm()}}>Cancelar</button>
                            <button type="submit">Salvar</button>
                        </div>
                    </form>
                </div>
            </>
        )
    }

    const tableRows = () => {
        
        const data = incomesExpenses.map((prop) => (
            <tr key={prop.id}>
                <td>{prop.name}</td>
                <td className={showDetails? styles.show: styles.no_show}>{prop.description}</td>
                <td className={showDetails? styles.show: styles.no_show}>{prop.date}</td>
                <td>R$ {formatNumber(prop.amount)}</td>
                <td className={showDetails? styles.show: styles.no_show} id={styles.delete_button}>
                    <button id={styles.delete_button} onClick={() => handleDelete(prop.id)}><FaTrash fill='red'/></button>
                </td>
            </tr>
        ))
        
        if (isIncomeExpenseLoading) {
            return (
                <tr>
                    <td colSpan={ showDetails? 4: 2} id={styles.no_data}>Loading...</td>
                </tr>
            )
        }

        if (data.length > 0) {
            return (data)
        }

        return (
            <tr>
                <td colSpan={ showDetails? 4: 2} id={styles.no_data}>Não há {tableName} cadastradas</td>
            </tr>
        )
    }

    return (
        <>
            {showButton? (<button className={styles.add_button} onClick={() => setShowModal(true)}><IoMdAdd/>Adicionar</button>): null}
            <div className={styles.table_container}>
                {showModal? formRegister(): null}
                <span className={styles.main_header}>{tableName}</span>
                <table className={styles.incomes_expenses_table}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th className={showDetails? styles.show: styles.no_show}>Descrição</th>
                            <th className={showDetails? styles.show: styles.no_show}>Data</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody className={styles.table_body}>
                        {tableRows()}
                    </tbody>
                </table>
            </div>
        </>
    )
}