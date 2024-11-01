// @ts-nocheck
import { CharityLog } from '@/app/admin/audit-log/function';
import supabase from '@/app/utils/supabase';
import { GetUID } from '@/app/utils/user_id';
import { Button } from '@/components/Button';
import { SelectField, TextField } from '@/components/Fields'
import { ImageUpload } from '@/components/ImgUpload';
import SlideOver from '@/components/SlideOverButton';
import { TableContainer, TableHeaderButton, TableContent, Table, Thead, Tr, Th, Tbody, Td } from '@/components/Table';
import { CashReceiptEmail } from '@/components/email-template';
import Plunk from '@plunk/node';
import { render } from '@react-email/render';
import { revalidatePath } from 'next/cache';
import React from 'react';

const plunk = new Plunk("sk_23f017252b1ab41fe645a52482d6925706539b7c70be37db");

export const revalidate = 0;

export default async function ExternalTable() {
    // Function to format the timestamp as 'mm/dd/yyy'
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}/${year}`;
    };

    // Function to format the time as 'h:mm a' (e.g., '2:30 PM')
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };


    console.log("DOES IT WORK???? MAYBE: " + await GetUID())

    const uid = await GetUID()
    const { data: charity_member, error: error_2 } = await supabase.from('charity_member').select('*, charity ( id, name )').eq('user_uuid', uid)
    const charity_id = charity_member?.map(member => member.charity?.id)

    const charityId = charity_id![0]
    const { data: event } = await supabase
        .from('event')
        .select('*')
        .eq('charity_id', charityId)
        .order("id", { ascending: true })

    const { data: cash, error: cash_error } = await supabase.from('cash')
        .select('*, charity ( id, name ), donor ( id, name ), event( id, name )')
        .eq('charity_id', charityId)
        .order("id", { ascending: true })

    const { data, error } = await supabase.from('cash')
        .select('*')
        .eq('charity_id', charityId)
        .order("id", { ascending: false }).limit(1)

    const cash_id = data?.map(post => post.id)

    const handleSubmit = async (formData: FormData) => {
        'use server'

        const cash = {
            amount: formData.get('amount'),
            date: formData.get('date'),
            charity_id: charityId,
            is_external: true,
            event_id: formData.get('event')

        }

        const { data, error } = await supabase.from('cash').insert(cash).select()
        CharityLog("ADDED EXTERNAL INCOME WORTH PHP " + data![0].amount, error)
        revalidatePath('/');
    };

    const saveChanges = async (formData: FormData) => {
        'use server'
        const cashID = formData.get("id")
        const cash = {
            amount: formData.get('amount'),
            date: formData.get('date'),
            charity_id: charityId,
            is_external: true,
            event_id: formData.get('event')
        }

        const { data, error } = await supabase.from('cash').update(cash).eq("id", cashID).select()
        CharityLog("EDITED EXTERNAL INCOME WORTH PHP " + data![0].amount, error)
        revalidatePath('/');
    };

    const deletePost = async (formData: FormData) => {
        'use server'
        const cashID = formData.get("id")

        const { data, error } = await supabase.from('cash').delete().eq("id", cashID).select()
        CharityLog("DELETED EXTERNAL INCOME " + data![0].id, error)
        revalidatePath('/');
    };

    const emailReceipt = async (formData: FormData) => {
        'use server'

        const { data, error: email_error } = await supabase.from('users').select('email').eq('id', formData.get("donor_id"))

        const details = {
            amount: formData.get("amount"),
            donor: formData.get("donor"),
            date: formData.get("date"),
            charity: formData.get("charity"),
            event: formData.get("event")
        }

        const body = render(<CashReceiptEmail heading={"YOUR DONATION RECEIPT"}
            content={details} />);

        const success = await plunk.emails.send({
            to: data![0].email as string,
            subject: "THANK YOU!",
            body,
        })

        console.log("SUCCESS??? ", success)
    }
 
    return (
        <>
            <div className="sm:flex sm:items-center py-9">
                <div className="sm:flex-auto">
                </div>
            </div>

            <TableContainer>
                <TableHeaderButton header="Cash">
                    <SlideOver title="Add External Income" buttontext="Add External Income" variant="solid" color="blue">
                        <form className="py-4" action={handleSubmit} method='POST'>
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                        <div className='sm:col-span-1'></div>
                                        <div className="sm:col-span-5">

                                            <TextField
                                                label="Amount"
                                                name="amount"
                                                type="number"
                                                autoComplete="number"
                                                required
                                            />
                                            <br/>
                                            <div className="sm:col-span-4">
                                                <TextField
                                                    label="Date Donated"
                                                    name="date"
                                                    type="Date"
                                                    autoComplete="Date"
                                                    required
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                             <br/>
                                                <SelectField
                                                    label='Assign to Event'
                                                    name="event"
                                                    required
                                                >
                                                    {event?.map(event => (
                                                        <option key={event.id} value={event.id}>{event.name}</option>
                                                    ))}
                                                </SelectField>
                                                <br/>
                                                <div className="col-span-full">
                                                    <ImageUpload folderName="cash" charityID={charityId} recordID={cash_id![0] + 1} />
                                                </div>
                                                <br/>
                                                <div className="flex justify-center">
                                                    <Button type='submit' variant='solid' color='blue' style={{ width: '80%' }} className="mx-auto">Submit</Button>
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
                                <Th>Source</Th>
                                <Th>Amount</Th>
                                <Th>Date</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {cash?.map(cash =>
                                <Tr key={cash.id}>
                                    {cash.is_external ? (
                                        <Td>EXTERNAL</Td>
                                    ) : (
                                        <Td>{cash.donor?.name}</Td>
                                    )}
                                    <Td>{cash.amount}</Td>
                                    <Td>{formatDate(cash.date) + ' ' + formatTime(cash.date)}</Td>
                                    <Td>
                                        {cash.is_external ?
                                            (
                                                <SlideOver title="Edit External Income" variant="solid" color="blue" buttontext="Edit External Income">
                                                    <form className="py-1" action={saveChanges} method='PUT'>
                                                        <div className="space-y-12">
                                                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                                                                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                                                    <div className='sm:col-span-1'></div>
                                                                    <div className="sm:col-span-5">
                                                                        <TextField
                                                                            label=""
                                                                            name="id"
                                                                            type="hidden"
                                                                            defaultValue={cash.id}
                                                                            required
                                                                        />
                                                                        <br/>
                                                                        <TextField
                                                                            label="Amount"
                                                                            name="amount"
                                                                            type="number"
                                                                            defaultValue={cash.amount}
                                                                            required
                                                                        />
                                                                        <div className="sm:col-span-4 py-5">
                                                                            <TextField
                                                                                label="Date Donated"
                                                                                name="date"
                                                                                type="Date"
                                                                                autoComplete="Date"
                                                                                required
                                                                                max={new Date().toISOString().split('T')[0]}
                                                                            />
                                                                        <br/>
                                                                            <SelectField
                                                                                label='Assign to Event'
                                                                                name="event"
                                                                                required
                                                                            >
                                                                                {event?.map(event => (
                                                                                    <option key={event.id} value={event.id}>{event.name}</option>
                                                                                ))}
                                                                            </SelectField>
                                                                            <br/>
                                                                            <div className="col-span-full">
                                                                                <ImageUpload folderName="cash" charityID={charityId} recordID={cash.id} />
                                                                            </div>
                                                                            <div className="mt-6 flex items-center justify-start gap-x-6">
                                                                                <Button type='submit' variant='solid' color='blue' className="w-full">Save Changes</Button>
                                                                            </div>
                                                                            <div className="mt-6 flex items-center justify-start gap-x-6">
                                                                                <Button type="submit" variant="solid" color="red" className="w-full" formAction={deletePost}>Delete</Button>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </SlideOver>
                                            ) :
                                            (
                                                <SlideOver title="Edit Details" variant="solid" color="blue" buttontext="View Details">
                                                    <form className="py-4" action={emailReceipt} method='POST'>
                                                        <div className="space-y-12">
                                                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                                                                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                                                    <div className='sm:col-span-1'></div>
                                                                    <div className="sm:col-span-5">
                                                                        <TextField
                                                                            label=""
                                                                            name="donor_id"
                                                                            type="hidden"
                                                                            defaultValue={cash.donor?.id}
                                                                            readOnly
                                                                        />

                                                                        <TextField
                                                                            label="Donated By"
                                                                            name="donor"
                                                                            type="text"
                                                                            defaultValue={cash.donor?.name as string}
                                                                            readOnly
                                                                        />
                                                                        <br/>
                                                                        <TextField
                                                                            label="Amount"
                                                                            name="amount"
                                                                            type="number"
                                                                            defaultValue={cash.amount}
                                                                            readOnly
                                                                        />
                                                                        <br/>
                                                                        <TextField
                                                                            label="Donated on"
                                                                            name="date"
                                                                            type="text"
                                                                            defaultValue={formatDate(cash.date) + ' ' + formatTime(cash.date)}
                                                                            readOnly
                                                                        />
                                                                        <br/>
                                                                        <TextField
                                                                            label="Donated on"
                                                                            name="charity"
                                                                            type="text"
                                                                            defaultValue={cash.charity?.name}
                                                                            readOnly
                                                                        />
                                                                        <br/>
                                                                        <TextField
                                                                            label="Event Donated to"
                                                                            name="event"
                                                                            type="text"
                                                                            defaultValue={cash.event?.name}
                                                                            readOnly
                                                                        />
                                                                        <div className="col-span-full">
                                                                            </div>
                                                                            <div className="mt-6 flex items-center justify-start gap-x-6">
                                                                                <Button type='submit' variant='solid' color='blue' className="w-full">Email Receipt</Button>
                                                                            </div>
                                                                            <div className="mt-6 flex items-center justify-start gap-x-6">
                                                                                <Button type="submit" variant="solid" color="red" className="w-full" formAction={deletePost}>Delete</Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </form>
                                                </SlideOver>
                                            )}
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContent>
            </TableContainer >


            {/**Edit external income here, use slideover once its fixed */}


        </>
    )
}