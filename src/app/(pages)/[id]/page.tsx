import EmployeeViewPage from '@/components/EmployeeViewPage';

const page = async ({ params }: {params: Promise<{id: number}>}) => {
    const { id } = await params;
    // const { employeeId } = useAppContext();
    return (
        <>
            <EmployeeViewPage employeeId={id} />
        </>
    )
}

export default page