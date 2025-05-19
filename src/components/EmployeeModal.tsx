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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';


// Valid values for type: "Add" & "Edit"
const EmployeeModal = ({ type, employee, refreshEmployees }: { type: 'Add' | 'Edit', employee: Employee | null, refreshEmployees: () => Promise<void> }) => {

    // useStates
    const [openModal, setOpenModal] = useState(false);
    const [employeeToChange, setEmployeeToChange] = useState<Employee>({
        id: 0,
        name: "",
        jobTitle: "",
        hireDate: "",
    });

    const [token, setToken] = useState('');

    const disableBtn =
        employeeToChange.name.trim() != "" ||
        employeeToChange.jobTitle.trim() != "" &&
        employeeToChange.hireDate != "";

    // Modal Functions
    const onOpenModal = () => {
        if (type === "Edit") {
            setEmployeeToChange(employee as Employee);
        }

        setOpenModal(true);
    };

    const onCloseModal = () => {
        setOpenModal(false);
        setEmployeeToChange({ id: 0, name: "", jobTitle: "", hireDate: "" });
    };

    // Change employee functions
    const handleEmployeeToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmployeeToChange({
            ...employeeToChange,
            [e.target.id]: e.target.value,
        });
    };

    const handleEmployeeToChangeHireDate = (date: string) => {
        setEmployeeToChange({
            ...employeeToChange,
            hireDate: date,
        });
    };

    // Date functions
    const formatDateForInput = (date: string) => {
        if (!date) return undefined;

        const [year, month, day] = date.toString().split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const formatDateFromInput = (date: Date | undefined) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
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
                            <Input
                                id="jobTitle"
                                value={employeeToChange.jobTitle}
                                onChange={handleEmployeeToChange}
                            />
                            <select name="Job Title" id="jobTitle" className='hover:cursor-pointer'>
                                {
                                    <option disabled selected value={employeeToChange.jobTitle}>{employeeToChange.jobTitle === '' ? "Select Job Title" : `${employeeToChange.jobTitle}`}</option>
                                }
                                <option className='hover:cursor-pointer' value="Customer Support">Customer Support</option>
                                <option className='hover:cursor-pointer' value="IT Support Specialist">IT Support Specialist</option>
                                <option className='hover:cursor-pointer' value="Software Engineer">Software Engineer</option>
                            </select>
                            {/* <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button id="jobTitle" variant="outline" className="ml-3 text-sm border rounded p-1 cursor-pointer">
                                       {`${employeeToChange.jobTitle}`}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='bg-gray-300 z-50'>
                                    <DropdownMenuItem className='cursor-pointer' onClick={handleEmployeeToChange}>Job Title</DropdownMenuItem>
                                    <DropdownMenuItem className='cursor-pointer' onClick={handleEmployeeToChange}>Customer Support</DropdownMenuItem>
                                    <DropdownMenuItem className='cursor-pointer' onClick={handleEmployeeToChange}>IT Support Specialist</DropdownMenuItem>
                                    <DropdownMenuItem className='cursor-pointer' onClick={handleEmployeeToChange}>Software Engineer</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu> */}
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