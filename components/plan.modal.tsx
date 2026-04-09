import {
    Box,
    DialogActions,
    FormControl,
    Grid,
    TextField
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import { Form } from '@components/Form';
import MDButton from '@components/MDButton';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { setLoading, useMaterialUIController } from '@context/index';
import { useAlert } from '@components/showAlert/useAlertHook';
import { PlanService } from '../services/plan.service';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlanBody } from '../services/requests/plan.request';
import { IModalProps } from '@types_main/imodal.props';
import { PlanResponse } from '../services/responses/plan.response';
import { NumericFormat } from 'react-number-format';

export const PlanModal = ({open, handleModal, edit, getAll, clearSearch} : IModalProps<PlanResponse>) => {
    const {t} = useTranslation();
    const [controller, dispatch] = useMaterialUIController();
    const {alert: showAlert} = useAlert();
    const planService = new PlanService();

    const createPlanFormSchema = z.object({
        id: z.string().nullable().optional(),
        title: z.string().min(1, t('plans.nomeObrigatorio')),
        value: z.coerce.number().min(0.01, t('plans.valorObrigatorio')),
        description: z.string().optional().nullable()
    })

    const clear:any = {
        id: '',
        title: '',
        value: '',
        description: ''
    }


    type CreatePlanFrom = z.infer<typeof createPlanFormSchema>

    const methods = useForm<CreatePlanFrom>({
        resolver: zodResolver(createPlanFormSchema),
        defaultValues: clear
    });

    const {handleSubmit, reset, formState: {errors}} = methods;
    

    useEffect(() => {
        if(edit && open){
            reset(edit);
        }
        else{
            reset(clear);
        }
    }, [edit, open, reset])

    useEffect(() => {
        if(Object.keys(errors).length > 0){
            showAlert(t('plans.envioErro'), 'error', 2500)
        }
    }, [errors]);


    async function createPlan(data: PlanBody) {
        setLoading(dispatch, true);

        await planService
        .create(data)
        .then((res) => {
            clearSearch();
            handleModal();
            reset();
            showAlert(t('plans.envioSucesso'), 'success', 2500);
        })
        .catch((err) =>{
            console.error("Erro ao criar plano: ", err);
            showAlert(t('plans.envioErro'), 'error', 3000);
        })
        .finally(() => {
            setLoading(dispatch, false);
        })
    }

    async function updatePlan(id: string, data: PlanBody) {
        setLoading(dispatch, true);

        await planService
        .update(id, data)
        .then(() => {
            getAll();
            clearSearch();
            handleModal();
            reset();
            showAlert(t('plans.edicaoSucesso'), 'success', 2500);
        })
        .catch((err) =>{
            console.error("Erro ao atualizar plano: ", err);
            showAlert(t('plans.edicaoErro'), 'error', 3000);
        })
        .finally(() => {
            setLoading(dispatch, false);
        })
    }

    async function saveChanges(data: PlanBody) {
        edit ? await updatePlan(edit.id, data) : await createPlan(data);
    }


    // async function createPlan(data:any){
    //     setLoading(dispatch, true);

    //     try{
    //         if(edit?.id){
    //             await planService.update(edit.id, data);
    //             showAlert('Plano atualizado com sucesso!', 'success', 2500);
    //         }
    //         else{
    //             await planService.create(data);
    //             showAlert('Plano criado com sucesso!', 'success', 2500);
    //         }

    //         refreshList();
    //         handleModal();
    //     }catch(err){
    //         showAlert('Erro ao salvar plano. Verifique os dados', 'error', 3000);
    //         console.error(err);
    //     }
    //     finally{
    //         setLoading(dispatch, false);
    //     }
    // }


return(

    <Dialog open={open} onClose={handleModal} fullWidth maxWidth="md" scroll ="paper">
        <DialogTitle> {edit ? t('general.editar') :  t('plans.adicionarPlano') } </DialogTitle>

        <FormProvider {...methods}>
        <form onSubmit={handleSubmit(saveChanges)}>
        <DialogContent style={{minHeight: '300px'}}>
            <Grid container spacing={2} sx={{mt: 1}}>
                <Grid size={{xs: 12}}>
                    <FormControl fullWidth>
                        <Form.Label>
                            {t('plans.plano')} <Form.MandatoryIcon/>
                        </Form.Label>
                        <Form.Input name='title' type='text' placeholder='Ex: Plano Familiar' error={!!errors.title}/>
                        <Form.ErrorMessage field='title'/>
                    </FormControl>
                </Grid>

                <Grid size={{xs: 12, md:6}}>
                    <FormControl fullWidth>
                        <Form.Label>
                            Valor <Form.MandatoryIcon/>
                        </Form.Label>
                        <Controller
                            name= 'value'
                            control={methods.control}
                            render={({field, fieldState}) =>(
                                <NumericFormat
                                    value={field.value}
                                    onValueChange={(vals) =>{
                                        field.onChange(vals.floatValue ?? 0)
                                    }}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    decimalScale={2}
                                    fixedDecimalScale
                                    prefix='R$ '
                                    allowNegative={false}
                                    customInput={TextField}
                                    fullWidth
                                    size='medium'
                                    autoComplete='off'
                                    placeholder='R$ 0,00'
                                    error={!!fieldState.error}
                                />
                            )}
                        />
                        
                        <Form.ErrorMessage field="value" />
                    </FormControl>
                </Grid>

                <Grid size={{xs: 12}}>
                    <FormControl fullWidth>
                        <Form.Label> {t('plans.descricao')} </Form.Label>
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
                {t('plans.cancelar')}

            </MDButton>
            
            <MDButton
                variant='gradient'
                color='success'
                type='submit'
            >
                {t('plans.salvar')}

            </MDButton>
            </Box>
        </DialogActions>
        </form>
        </FormProvider>
    </Dialog>
);

}