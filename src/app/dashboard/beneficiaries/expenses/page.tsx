import supabase from '@/app/utils/supabase';
import { Button } from '@/components/Button';
import { SelectField, TextField } from '@/components/Fields'
import { , imgPath } from '@/components/ImgUpload';
import SlideOver from "@/components/SlideOverButton"
import { TableContainer, Table, TableContent, TableHeaderButton, Tbody, Td, Thead, Tr } from '@/components/Table';
import { revalidatePath } from 'next/cache';

const header = "Expenses";
const subheader = "A table list of expenses";
const columns = ["Description", "Amount", "Date"];


export default async function Expenses() {

    const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*, charity ( id, name ), beneficiaries ( id, beneficiary_name ), event (id, name)')
        .eq('charity_id', 12)

    const { data: events, error: events_error } = await supabase
        .from('event')
        .select('*, charity ( id, name ), beneficiaries ( id, beneficiary_name )')
        .eq('charity_id', 12)

    const handleSubmit = async (formData: FormData) => {
        'use server'
        const expense = {
            amount: formData.get("amount"),
            reason: formData.get("reason"),
            event_id: formData.get("event"),
            receipt: imgPath,
        };

        await supabase.from('expenses').insert(expense);
        revalidatePath('/');
    };

    const saveChanges = async (formData: FormData) => {
        'use server'
        const expenseId = formData.get("id")
        const expense = {
            amount: formData.get("amount"),
            reason: formData.get("reason"),
            event_id: formData.get("event"),
            receipt: imgPath,
        };

        await supabase.from('expenses').update(expense).eq("id", expenseId)
        revalidatePath('/');
    };

    const deleteExpense = async (formData: FormData) => {
        'use server'
        const expenseId = formData.get("id")
        const expense = {
            amount: formData.get("amount"),
            reason: formData.get("reason"),
            event_id: formData.get("event"),
            receipt: imgPath,
        };

        await supabase.from('expenses').delete().eq("id", expenseId)
        revalidatePath('/');
    };


    return (
        <>
            <div className="sm:flex sm:items-center py-9">
                <div className="sm:flex-auto">
                </div>
            </div>

            <TableContainer>
                <TableHeaderButton header="Expenses">
                    <SlideOver buttontext="Add Expense" variant="solid" color="blue">
                        {/**This is Add expense form, put slideover on this later*/}
                        <form className="py-9" action={handleSubmit} method="POST">
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                                    <div>
                                        <h2 className="text-base font-semibold leading-7 text-gray-900">Add Expense</h2>
                                    </div>

                                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                        <div className="sm:col-span-4">
                                            <TextField
                                                label="Amount"
                                                name="amount"
                                                type="Amount"
                                                autoComplete="Amount"
                                                required
                                            />

                                            <div className="sm:col-span-4 py-5">
                                                <div className="col-span-full">
                                                    <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Description
                                                    </label>
                                                    <div className="mt-2">
                                                        <textarea
                                                            id="reason"
                                                            name="reason"
                                                            rows={3}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            defaultValue={''}
                                                        />
                                                    </div>
                                                </div>

                                                {/* NEED TO FIGURE OUT HOW TO DISPLAY NAMES OF EVENTS AS OPTIONS */}
                                                {events?.map(event => (

                                                    <SelectField
                                                        className="col-span-full py-5"
                                                        label="Assign Event"
                                                        name="event_id"
                                                        key={event.id}
                                                    >
                                                        <option value={event.id}>{event.name}</option>
                                                    </SelectField>


                                                ))}

                                                <ImageUpload charityID={12} />

                                                <div className="mt-6 flex items-center justify-start gap-x-6">
                                                    <button
                                                        type="submit"
                                                        className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    >
                                                        Save
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </SlideOver>
                </TableHeaderButton>
                <TableContent>
                    <Table>
                        <Thead>
                            <Tr>
                                <Td>Description</Td>
                                <Td>Amount</Td>
                                <Td>Beneficiary</Td>
                                <Td>Date Added</Td>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {expenses?.map(expense =>

                                <Tr key={expense.id}>
                                    <Td>{expense.reason}</Td>
                                    <Td>{expense.amount}</Td>
                                    <Td>{expense.beneficiaries.beneficiary_name}</Td>
                                    <Td>{expense.date}</Td>
                                    <Td>
                                        <SlideOver buttontext="View Details" variant='solid' color="blue">
                                            {/**This is Edit expense form, put slideover on this later*/}
                                            <form className="py-9" action={saveChanges} method="PUT">
                                                <div className="space-y-12">
                                                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                                                        <div>
                                                            <h2 className="text-base font-semibold leading-7 text-gray-900">Edit Expense</h2>
                                                        </div>

                                                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                                            <div className="sm:col-span-4">

                                                                <TextField
                                                                    label=""
                                                                    name="id"
                                                                    type="hidden"
                                                                    defaultValue={expense.id}
                                                                    required
                                                                />

                                                                <TextField
                                                                    label="Amount"
                                                                    name="amount"
                                                                    type="Amount"
                                                                    defaultValue={expense.amount}
                                                                    required
                                                                />

                                                                <div className="sm:col-span-4 py-5">
                                                                    <div className="col-span-full">
                                                                        <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">
                                                                            Description
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <textarea
                                                                                id="reason"
                                                                                name="reason"
                                                                                rows={3}
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                                defaultValue={expense.reason}
                                                                            />
                                                                        </div>
                                                                    </div>


                                                                    {/* NEED TO FIGURE OUT HOW TO DISPLAY NAMES OF EVENTS AS OPTIONS */}
                                                                    {events?.map(event => (

                                                                        <SelectField
                                                                            className="col-span-full py-5"
                                                                            label="Assign Event"
                                                                            name="event_id"
                                                                            key={event.id}
                                                                            defaultValue={expense.event.name}
                                                                        >
                                                                            <option value={event.id}>{event.name}</option>
                                                                        </SelectField>


                                                                    ))}

                                                                    <ImageUpload charityID={12} />


                                                                    <div className="mt-6 flex items-center justify-start gap-x-6">
                                                                        <Button type="submit" variant="solid" color="blue" className="w-full">
                                                                            <span>
                                                                                Update <span aria-hidden="true">&rarr;</span>
                                                                            </span>
                                                                        </Button>
                                                                        <Button type="submit" variant="solid" color="red" className="w-full" formAction={deleteExpense}>
                                                                            <span>
                                                                                Delete <span aria-hidden="true">&rarr;</span>
                                                                            </span>
                                                                        </Button>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </SlideOver>
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContent>
            </TableContainer>











        </>
    )
}