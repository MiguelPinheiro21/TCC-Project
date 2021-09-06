import { useForm } from "react-hook-form"

type incomesExpensesType = {
    incomesExpenses: {
        id: number,
        date: string,
        description: string,
        amount: string
    }[],
    onSubmit: any,
    handleDelete: Function
}

type formFields = {
    date: string;
    description: string;
    amount: string;
}

export default function GridIncomesExpenses({incomesExpenses, onSubmit, handleDelete}: incomesExpensesType) {
    
    const {register, formState: { errors }, handleSubmit} = useForm<formFields>();

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                
                <label htmlFor="Date">Data</label>
                <input type="date" className="Date" {...register('date', {required: 'O campo Data não foi preenchido.'})}/>
                
                {errors.date && (
                    <div >
                    {errors.date.message}
                    </div>
                )}

                <label htmlFor="Description">Descrição</label>
                <input type="text" className="Description" {...register('description',{required: 'O campo Descrição não foi preenchido.'})}/>
                
                {errors.description && (
                    <div >
                    {errors.description.message}
                    </div>
                )}

                <label htmlFor="Amount">Valor</label>
                <input type="text" className="Amount" {...register('amount',{required: 'O campo Valor não foi preenchido.'})}/>
                
                {errors.amount && (
                    <div >
                    {errors.amount.message}
                    </div>
                )}

                <button type="submit" onClick={(e) => {e}}>Submit</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Qtd</th>
                    </tr>
                </thead>
                <tbody>
                    {incomesExpenses.map((prop) => (
                        <tr key={prop.id}>
                            <td>{prop.date}</td>
                            <td>{prop.description}</td>
                            <td>R${prop.amount}</td>
                            <td><button onClick={() => handleDelete(prop.id)} >Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}