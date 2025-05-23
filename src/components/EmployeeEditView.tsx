'use client'

import { Employee } from '@/lib/interfaces/interfaces'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
// import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import { getEmployeeById, getEmployees, updateEmployee } from '@/lib/services/employee-service'
import { formatDateForInput, formatDateFromInput } from '@/lib/services/formatting-service'

const EmployeeEditView = ({ employee, setEdit, employeeIdNum}: { employee: Employee, setEdit: (value: boolean) => void, employeeIdNum: number}) => {
    const [employeeToChange, setEmployeeToChange] = useState<Employee>({
        id: 0,
        name: "",
        jobTitle: "",
        hireDate: "",
        details: "",
        status: "",
    });
    // const [date, setDate] = useState<Date | undefined>(new Date())
    const [token, setToken] = useState('');

    useEffect(() => {
        const handleToken = async () => {
            if (localStorage.getItem('user')) {
                setToken(await JSON.parse(localStorage.getItem('user')!).token);
            }
            if (sessionStorage.getItem('user')) {
                setToken(await JSON.parse(sessionStorage.getItem('user')!).token);
            }
        }

        handleToken();
    }, []);

        useEffect(() => {
        const getEmployee = async () => {
            if (token != '') {
                const tempEmployee = await getEmployeeById(token, employeeIdNum);
                if (tempEmployee)
                    setEmployeeToChange(tempEmployee);
            }
        }
        

        if (employeeIdNum != 0) {
            getEmployee();
        }
    }, [token, employeeIdNum])


    useEffect(() => {
        setEmployeeToChange(employee);
    }, [employee])

    // Change employee functions
    const handleJobTitleChange = (jobTitle: string) => {
        setEmployeeToChange({
            ...employeeToChange,
            jobTitle: jobTitle
        });
    };

    const handleEmployeeToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmployeeToChange({
            ...employeeToChange,
            [e.target.id]: e.target.value,
        });
    };
    useEffect(() => {
        console.log(employeeToChange)
    }, [employeeToChange])
    console.log()
    const handleEmployeeToChangeHireDate = (newDate: string) => {
        setEmployeeToChange({
            ...employeeToChange,
            hireDate: newDate,
        });
    };


const handleEmployee = async () => {
  const employeeWithChanges = {
  ...employeeToChange,
  name: employeeToChange.name?.trim() ?? '',
  jobTitle: employeeToChange.jobTitle?.trim() ?? '',
  details: employeeToChange.details?.trim() ?? '',
  status: employeeToChange.status?.trim() ?? '',
};
console.log(employeeWithChanges)

  if (await updateEmployee(token, employeeWithChanges)) {
    await getEmployees(token);
  }
  setEdit(false);
}

const handleStatusChange = (newStatus: string) => {
    setEmployeeToChange({
        ...employeeToChange,
        status: newStatus,
    });
};


    return (
        <>
        {
            employee !== null &&
            (<div>
                <p className="text-sm font-semibold">Job Title</p>
                <Select disabled defaultValue={employee.jobTitle} onValueChange={(newJobTitle) => { handleJobTitleChange(newJobTitle) }}>
                    <SelectTrigger>
                        <SelectValue placeholder={employee !== undefined && employee.jobTitle === "" ? "Select New Job Title" : `${employeeToChange.jobTitle}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem className="hover:cursor-pointer" value="Customer Support">Customer Support</SelectItem>
                        <SelectItem className="hover:cursor-pointer" value="IT Support Specialist">IT Support Specialist</SelectItem>
                        <SelectItem className="hover:cursor-pointer" value="Software Engineer">Software Engineer</SelectItem>
                    </SelectContent>
                </Select>
            </div>)
        }

            <div>
                <p className="text-sm font-semibold">Details</p>
                <Input
                    id='details'
                    value={employeeToChange.details ?? ''}
                    onChange={handleEmployeeToChange}
                />
            </div>

            <div>
                <p className="text-sm font-semibold">Status</p>
                <Select  value={employeeToChange.status ?? ''}
                    onValueChange={handleStatusChange}>
                    <SelectTrigger className='hover:cursor-pointer'>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem className='hover:cursor-pointer' value="Active">Active</SelectItem>
                            <SelectItem className='hover:cursor-pointer' value="Sick">Sick</SelectItem>
                            <SelectItem className='hover:cursor-pointer' value="Out of Office">Out of Office</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <p className="text-sm font-semibold">Hire Date</p>
                <Popover>
                    <PopoverTrigger disabled asChild>
                        <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal text-muted-foreground")}
                        >
                            <CalendarIcon />
                            {employeeToChange.hireDate ? employeeToChange.hireDate : <span>Pick a date</span>}                                </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={formatDateForInput(employeeToChange.hireDate)}
                            onSelect={(e) =>
                                handleEmployeeToChangeHireDate(formatDateFromInput(e))}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>


            <div className="flex justify-between pt-4">
                <Button className='hover:cursor-pointer' onClick={() => setEdit(false)}>Cancel</Button>
                {employee && <Button className='hover:cursor-pointer' variant="outline" onClick={handleEmployee}>Save Edits</Button>}
            </div>
        </>
    )
}

export default EmployeeEditView