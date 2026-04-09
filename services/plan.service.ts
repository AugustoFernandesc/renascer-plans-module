import { BaseService } from "@services/route.service";
import { PlanResponse } from "./responses/plan.response";
import IService from "@types_main/iservice";
import { PagedResponse } from "@types_main/paged-response";
import { PagedParams } from "@types_main/paged.params";
import { AxiosResponse } from "axios";
import { PlanBody } from "./requests/plan.request";


export class PlanService extends BaseService implements IService<PlanResponse> {

    resource: number = 0;

    protected get resourceName(): string{
        if(this.resource == 1){
            return 'payment-books';
        }
        else{
            return 'payment-books/paginated';
        }
    }

    public create(body: PlanBody): Promise<AxiosResponse<PlanResponse>>{
        this.resource = 1;
        return this.post(body);
    }
      
     public async getAll(filter?: string, params?: PagedParams): Promise<AxiosResponse<PagedResponse<PlanResponse>>> {
        this.resource = 2;
        return await this.get(filter?? '', params);
    }

    public async getById(id: string): Promise<AxiosResponse<{ data: PlanResponse; }, any, {}>> {
        this.resource = 1;
        return await this.get(`${id}`);
    }
    
    public async update(id: string, body: PlanBody): Promise<AxiosResponse<PlanResponse, any, {}>> {
        this.resource = 1;
        return await this.put(`${id}`, body);
    }

    public async deleteById(id: string): Promise<AxiosResponse<any>> {
        this.resource = 1;
        return await this.delete(`${id}`);
    }

}