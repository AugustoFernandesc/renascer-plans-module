import {
    Box,
    DialogActions,
    FormControl,
    Grid,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import { Form } from '@components/Form';
import MDButton from '@components/MDButton';
import { useForm, FormProvider } from 'react-hook-form';
import { setLoading, useMaterialUIController } from '@context/index';
import { useAlert } from '@components/showAlert/useAlertHook';
import { PlanService } from '../services/plan.service';
import { useEffect } from 'react';


interface PlanModalProps{
    open:boolean;
    handleModal: () => void;
    edit?: any
    refreshList: () => void;
}

export const PlanModal = ({open, handleModal, edit, refreshList} : PlanModalProps) => {
    const {t} = useTranslation();
    const [controller, dispatch] = useMaterialUIController();
    const {alert: showAlert} = useAlert();
    const planService = new PlanService();

    const createPlanForm = useForm({
        defaultValues: {
            title: '',
            value: '',
            description: ''
        }
    });

    const {handleSubmit, reset} = createPlanForm;

    useEffect(() => {
        if(edit && open){
            reset(edit);
        }
        else{
            reset({title: '', value: '', description: ''});
        }
    }, [edit, open, reset])

    async function saveChanges(data:any){
        setLoading(dispatch, true);

        try{
            if(edit?.id){
                await planService.update(edit.id, data);
                showAlert('Plano atualizado com sucesso!', 'success', 2500);
            }
            else{
                await planService.create(data);
                showAlert('Plano criado com sucesso!', 'success', 2500);
            }

            refreshList();
            handleModal();
        }catch(err){
            showAlert('Erro ao salvar plano. Verifique os dados', 'error', 3000);
            console.error(err);
        }
        finally{
            setLoading(dispatch, false);
        }
    }


return(

    <Dialog open={open} onClose={handleModal} fullWidth maxWidth="md" scroll ="paper">
        <DialogTitle> {edit ? "Editar Plano" : "Adicionar Plano"} </DialogTitle>

        <FormProvider {...createPlanForm}>
        <form onSubmit={handleSubmit(saveChanges)}>
        <DialogContent style={{minHeight: '300px'}}>
            <Grid container spacing={2} sx={{mt: 1}}>
                <Grid size={{xs: 12}}>
                    <FormControl fullWidth>
                        <Form.Label>
                            Nome do Plano <Form.MandatoryIcon/>
                        </Form.Label>
                        <Form.Input name='title' type='text' placeholder='Ex: Plano Familiar'/>
                    </FormControl>
                </Grid>

                <Grid size={{xs: 12, md:6}}>
                    <FormControl fullWidth>
                        <Form.Label>
                            Valor <Form.MandatoryIcon/>
                        </Form.Label>
                        <Form.Input name='value' type='number' placeholder='R$ 0,00'/>
                    </FormControl>
                </Grid>

                <Grid size={{xs: 12}}>
                    <FormControl fullWidth>
                        <Form.Label> Descrição </Form.Label>
                        <Form.Input name='description' type='text' multiline rows={3} placeholder='Descreva os detalhes do plano...'/>
                    </FormControl>
                </Grid>
            </Grid>
        </DialogContent>

        <DialogActions sx={{p:3}}>
            <Box display='flex' gap={1}>
                <MDButton
                variant='gradient'
                color='dark'
                onClick={handleModal}
            >
                CANCELAR

            </MDButton>
            
            <MDButton
                variant='gradient'
                color='success'
                type='submit'
            >
                SALVAR

            </MDButton>
            </Box>
        </DialogActions>
        </form>
        </FormProvider>
    </Dialog>
);

}