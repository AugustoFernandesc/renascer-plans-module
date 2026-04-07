import MDButton from "@components/MDButton";
import { useMaterialUIController } from "@context/index";
import { Grid, TextField } from "@mui/material";
import { t } from "i18next";



interface FilterProps{
    valueFieldFilter:string;
    setValueFieldFilter: (e:string) => void;
    searchFilter: () => void;
    clearSearch: () => void;
    onEnter: (e:any) => void;
}


export function PlanFilter(props: FilterProps){


    const [controller] = useMaterialUIController();
    const {sidenavColor} = controller;

    return(

        <Grid container spacing={1} size={{ xs: 12, md: 10 }}>
            <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                    fullWidth
                    size="medium"
                    placeholder="Plano"
                    value={props.valueFieldFilter}
                    onChange={(e) => props.setValueFieldFilter(e.target.value)}
                    onKeyDown={props.onEnter}
                />
            </Grid>

            <Grid size={{xs:12, md:4}} sx={{display: 'flex', gap: '8px'}} spacing={1}>
                <MDButton
                    variant="gradient"
                    color={sidenavColor}
                    onClick={props.searchFilter}
                    title="Filtrar Plano"
                >
                    {t('general.buscar')}

                </MDButton>

                <MDButton
                    variant="gradient"
                    color={sidenavColor}
                    onClick={props.clearSearch}
                    title="Limpar Plano"
                >
                    {t('general.limpar')}
                    
                </MDButton>
            </Grid>
        </Grid>

    );
}