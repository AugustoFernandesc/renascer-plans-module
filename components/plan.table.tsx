import EditIcon from '@mui/icons-material/Edit';
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Skeleton,
} from '@mui/material';
import { ITableProps } from '@types_main/itable.props';
import { iconSize } from 'assets/theme/iconSize';
import { t } from 'i18next';
import { PlanResponse } from '../services/responses/plan.response';

export function PlanTable(props: ITableProps<PlanResponse>){
    const{data, editAction, orderDirection, handleOrderList} = props;
    
    if(!data){
        return(
            <TableContainer sx={{marginTop: '15px'}}>
                <Table>
                    <TableBody>
                        {Array.from({length: 5}).map((_, index) =>(
                            <TableRow key={index}>
                                <TableCell><Skeleton variant='rectangular' height={30}/></TableCell>
                                <TableCell><Skeleton variant='rectangular' height={30}/></TableCell>
                                <TableCell><Skeleton variant='rectangular' height={30}/></TableCell>
                                <TableCell><Skeleton variant='rectangular' height={30}/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    return(
        <Grid>
            <TableContainer sx={{marginTop: '15px', maxHeight: '60vh', overflowY: 'auto' }}>

                <Table size='medium' stickyHeader>
                    <TableHead sx={{position: 'sticky', top:0}}>
                        <TableRow>
                            <TableCell width='25%' sx={{ backgroundColor: 'background.paper', zIndex: 1 }}>
                            {t('plans.plano')}
                              <TableSortLabel
                                active={true}
                                direction={orderDirection}
                                onClick={handleOrderList}>
                            </TableSortLabel>    
                            </TableCell>
                            <TableCell width='25%' sx={{ backgroundColor: 'background.paper', zIndex: 1 }}>{t('plans.valor')}</TableCell>
                            <TableCell width='25%' sx={{ backgroundColor: 'background.paper', zIndex: 1 }}>{t('plans.descricao')}</TableCell>
                            <TableCell width='10%' align='center' sx={{ backgroundColor: 'background.paper', zIndex: 1 }}>{t('plans.acoes')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.data?.records?.length > 0 ? (
                            data.data.records.map((item:any) => (
                                <TableRow hover key={item.id}>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>R$ {item.value}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell align='center'>
                                        <EditIcon
                                            style={iconSize}
                                            onClick={() => editAction(item.id)}
                                            titleAccess='Editar Plano'
                                        />
                                    </TableCell>

                                </TableRow>
                            ))
                        
                        ):(
                            <TableRow>
                                <TableCell colSpan={4} align='center'>
                                    {t('general.nenhumRegistro')}
                                </TableCell>
                            </TableRow>

                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );  

}