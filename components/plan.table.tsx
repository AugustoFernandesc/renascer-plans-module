import EditIcon from '@mui/icons-material/Edit';
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { iconSize } from 'assets/theme/iconSize';
import { t } from 'i18next';

interface PlanTableProps{
    data:any;
    editAction:(id:string) => void;
}

export function PlanTable({data, editAction}: PlanTableProps){
    
    if(!data){
        return<div>Carregando...</div>
    }


    return(
        <Grid>
            <TableContainer sx={{marginTop: '15px', maxHeigh: '60vh', overflowY: 'auto' }}>

                <Table size='medium' stickyHeader>
                    <TableHead sx={{position: 'sticky', top:0}}>
                        <TableRow>
                            <TableCell width='25%' sx={{ backgroundColor: 'background.paper', zIndex: 1 }}>{t('plansScreen.plano')}</TableCell>
                            <TableCell width='25%' sx={{ backgroundColor: 'background.paper', zIndex: 1 }}>{t('plansScreen.valor')}</TableCell>
                            <TableCell width='25%' sx={{ backgroundColor: 'background.paper', zIndex: 1 }}>{t('plansScreen.descricao')}</TableCell>
                            <TableCell width='10%' align='center' sx={{ backgroundColor: 'background.paper', zIndex: 1 }}>{t('plansScreen.acoes')}</TableCell>
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