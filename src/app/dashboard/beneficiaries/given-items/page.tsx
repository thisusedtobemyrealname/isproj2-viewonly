import {Table, TableHeader} from '@/components/table/Table'
import { SelectField, TextField } from '@/components/Fields'


const header = "Beneficiary Item";
const subheader = "A table list of beneficiaries' item";
const columns = ["Item", "Quantity", "Date"];
const people = [
  { Item: 'Canned Goods', Quantity: '69', Date: 'January 20,2030'},
  { Item: 'T-shirt', Quantity: '50', Date: 'January 20,2030'},

  // More people...
];


export default function beneficiaryitem() {
    return (
        <>    
            <div className="sm:flex sm:items-center py-9">
                <div className="sm:flex-auto">
                </div>
            </div>

            <Table columnNames={columns} tableRows={people} header={header} subHeader={subheader}/>

            {/**Edit Given Items form here */}
            <form className="py-9">
            <div className="space-y-12">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Edit Given Items</h2>
                </div>

                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                    <div className="sm:col-span-4">
                    <TextField
                        label="Quantity"
                        name="Quantity"
                        type="Quantity"
                        autoComplete="Quantity"
                        required
                    />

                    <SelectField
                        className="col-span-full py-5"
                        label="Pick Item"
                        name="Pick Item"
                        >
                        <option>Canned Goods</option>
                        <option>T-Shirt</option>
                    </SelectField>
                    
                    <SelectField
                        className="col-span-full py-5"
                        label="Pick Event"
                        name="Pick event"
                        >
                        <option>Yolanda</option>
                        <option>Blood Donation</option>
                    </SelectField>
                        
        
                    <div className="col-span-full py-6">
                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                        Upload Receipt/s
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    

                    <div className="mt-6 flex items-center justify-start gap-x-6">
                        <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Save
                        </button>
                        <button
                        type="submit"
                        className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </form>
        </>
    )
}