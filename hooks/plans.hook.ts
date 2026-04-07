import { AbstractHook } from '@hooks/abstraction';
import { PlanService } from '../services/plan.service';
import { PlanResponse } from '../services/responses/plan.response';

export class PlanHook extends AbstractHook<PlanResponse, PlanService> {}
