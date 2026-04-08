import { Grid, Paper, TablePagination } from '@mui/material';
import { useMaterialUIController } from 'context';
import MDButton from '../../../../components/MDButton';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useEffect, useState } from 'react';
import { PlanFilter } from './components/plan.filter';
import { t } from 'i18next';
import { PlanModal } from './components/plan.modal';
import { PlanTable } from './components/plan.table';
import { PlanHook } from './hooks/plans.hook';
import { PlanService } from './services/plan.service';
import { Combo } from '@types_main/combo';


export const Plans = () => {
    
    const [controller] = useMaterialUIController();
    const {sidenavColor} = controller;

    const planSerivce = new PlanService;
    const [totais, setTotais] = useState<number>(0)

    //busca
    const [valueFieldFilter, setValueFieldFilter] = useState('');
    const [filterFinal, setFilterFinal] = useState<string>('');
    const [refresh, setRefresh] = useState<boolean>(true);

    //modal
    const [open, setOpen] = useState(false);
    const [planEdit, setPlanEdit] = useState<any>(null);

    //tabela
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [orderDirection, setOrderDirection] = useState<'desc'| 'asc'> ('asc')


    const {json} = new PlanHook({
        page,
        limit: rowsPerPage,
        orderBy: 'Title',
        orderDirection,
        filter: filterFinal,
        refresh,
        service: planSerivce
    }).getJson();

    async function handleEditAction(id: string){
        try{
            const response = await planSerivce.getById(id);
            setPlanEdit(response.data.data);
            setOpen(true);
        }catch(err){
            console.error('Eerro ao buscar plano para edição:', err);
        }

    }


    async function getAll() {
        setRefresh((prev) => !prev)
    }

    function handleSearch(){
        const filter = valueFieldFilter ? `?title=${valueFieldFilter}` : '';
        setFilterFinal(filter);
        setPage(0)
        setRefresh(!refresh);
    }
    function clearSearch(){
        setValueFieldFilter('');
        setFilterFinal('');
        setPage(0);
        setRefresh(!refresh)
    }

    function handleOrderList(){
        orderDirection === 'asc' ? setOrderDirection('desc') : setOrderDirection('asc')
        setRefresh(prev => !prev); 
    }

    useEffect(() => {
        setTotais(json?.data?.totalItens ?? 0);
    }, [json]);


    function handleModal(){
        if(open){
            setPlanEdit(null);
        }

        setOpen(!open)
    }

    function handleKeyDown(event:any){
        if(event.key === 'Enter'){
            handleSearch();
        }
    }

    return(
        <DashboardLayout>
            <DashboardNavbar title= {t('Planos')} />
            <Grid container spacing={1}>
                <PlanFilter
                    valueFieldFilter={valueFieldFilter}
                    setValueFieldFilter={setValueFieldFilter}
                    searchFilter={handleSearch}
                    clearSearch={clearSearch}
                    onEnter={handleKeyDown}
                />
                <Grid >
                    <MDButton
                        fullWidth
                        variant='gradient'
                        color={sidenavColor}
                        onClick={() => handleModal()}
                        title={t('general.adicionar')}
                        sx={{width: '12vw'}}
                    >
                        {t('general.adicionar')}
                    </MDButton>
                </Grid>
            </Grid>
            
            <PlanModal
                open={open}
                handleModal={handleModal}
                edit={planEdit}
                clearSearch={clearSearch}
                getAll={getAll}
            />

            <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
                <PlanTable
                    data={json}
                    editAction={handleEditAction}
                    orderDirection={orderDirection}
                    handleOrderList={handleOrderList}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    openModal={open}
                    setOpenModal={setOpen}
                    
                />
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    rowsPerPage={rowsPerPage}
                    count={totais}
                    page={page}
                    onPageChange={(e, p) => setPage(p)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value));
                        setPage(0);
                    }}
                />
            </Paper>
        </DashboardLayout>
    )
}
