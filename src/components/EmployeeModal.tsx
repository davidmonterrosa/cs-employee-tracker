'use client'

import { Employee } from '@/lib/interfaces/interfaces'
import { addEmployee, updateEmployee } from '@/lib/services/employee-service';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { FaPlus } from 'react-icons/fa';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatDateForInput, formatDateFromInput } from '@/lib/services/formatting-service';


// Valid values for type: "Add" & "Edit"
const EmployeeModal = ({ type, employee, refreshEmployees }: { type: 'Add' | 'Edit', employee: Employee | null, refreshEmployees: () => Promise<void> }) => {

    // useStates
    const [openModal, setOpenModal] = useState(false);
    const [employeeToChange, setEmployeeToChange] = useState<Employee>({
        id: 0,
        name: "",
        jobTitle: "",
        hireDate: "",
        details: "",
        status: "",
    });

    const [token, setToken] = useState('');

    const disableBtn =
        employeeToChange.name.trim() == "" ||
        employeeToChange.jobTitle.trim() == "" ||
        employeeToChange.hireDate == "";

    // Modal Functions
    const onOpenModal = () => {
        if (type === "Edit") {
            setEmployeeToChange(employee as Employee);
        }

        setOpenModal(true);
    };

    const onCloseModal = () => {
        console.log(openModal);
        setOpenModal(false);
        setEmployeeToChange({ id: 0, name: "", jobTitle: "", hireDate: "", details: "", status: "" });
    };

    // Change employee functions
    const handleEmployeeToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmployeeToChange({
            ...employeeToChange,
            [e.target.id]: e.target.value,
        });
    };

    // Change employee functions
    const handleJobTitleChange = (jobTitle: string) => {
        setEmployeeToChange({
            ...employeeToChange,
            jobTitle: jobTitle
        });
    };

    const handleEmployeeToChangeHireDate = (date: string) => {
        setEmployeeToChange({
            ...employeeToChange,
            hireDate: date,
        });
    };



    // Add & Edit function
    const handleEmployee = async () => {
        try {
            const employeeWithChanges = {
                ...employeeToChange,
                name: employeeToChange.name.trim(),
                jobTitle: employeeToChange.jobTitle.trim(),
            };

            if (type === "Add") {
                if (await addEmployee(token, employeeWithChanges)) {
                    await refreshEmployees();
                }
            } else {
                if (await updateEmployee(token, employeeWithChanges)) {
                    await refreshEmployees();
                }
            }

            setEmployeeToChange({
                id: 0,
                name: "",
                jobTitle: "",
                hireDate: "",
                details: "",
                status: "",
            });
        } catch (error) {
            console.log("error", error);
        }

        onCloseModal();
    };

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


    return (
        <Dialog >
            <DialogTrigger asChild>
                {/* <Button variant="outline">Edit Profile</Button> */}
                <Button
                    color="success"
                    className={type === "Add" ? "flex items-center gap-1 cursor-pointer" : "cursor-pointer"}
                    onClick={onOpenModal}
                >
                    {type === "Add" ? <FaPlus className="mt-[0.2rem]" /> : "Edit"}
                </Button>
            </DialogTrigger>
            <DialogContent className='w-[40rem]'>
                <DialogHeader className='pb-3'>
                    <DialogTitle>
                        {type === "Add"
                            ? "Add New Employee"
                            : "Update Employee Information"}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 min-h-[30rem]">
                    <div>
                        <div className='pb-5'>
                            <div className="mb-2 block">
                                <Label htmlFor="name">Employee name</Label>
                            </div>
                            <Input
                                id="name"
                                value={employeeToChange.name}
                                onChange={handleEmployeeToChange}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="jobTitle">Job title</Label>
                            </div>
                            <Select defaultValue={employeeToChange.jobTitle} onValueChange={(newJobTitle) => {handleJobTitleChange(newJobTitle)}}>
                                <SelectTrigger>
                                    <SelectValue placeholder={employeeToChange.jobTitle.trim() === "" ? "Select New Job Title" : `${employeeToChange.jobTitle}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem className="hover:cursor-pointer" value="Customer Support">Customer Support</SelectItem>
                                    <SelectItem className="hover:cursor-pointer" value="IT Support Specialist">IT Support Specialist</SelectItem>
                                    <SelectItem className="hover:cursor-pointer" value="Software Engineer">Software Engineer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>Date hired</Label>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal cursor-pointer",
                                        !employeeToChange.hireDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {employeeToChange.hireDate ? employeeToChange.hireDate : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formatDateForInput(employeeToChange.hireDate)}
                                    onSelect={(e) =>
                                        handleEmployeeToChangeHireDate(formatDateFromInput(e))
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            onClick={handleEmployee}
                            color="success"
                            disabled={disableBtn}
                            className='cursor-pointer'
                        >
                            {type === "Add" ? "Add" : "Update"} Employee
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmployeeModal