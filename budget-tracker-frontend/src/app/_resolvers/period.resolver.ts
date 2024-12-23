// import { inject } from '@angular/core';
// import {ResolveFn} from '@angular/router';
// import { PeriodService } from '../_services/period.service';
// import { PeriodForListDto } from '../_dtos/periods/period-for-list-dto';
// import { PeriodDto } from '../_dtos/periods/periodDto';

// export const loadPeriodResolver: ResolveFn<PeriodDto[]> = async () => {
//     const periodService = inject(PeriodService);

//     if (periodService.periods().length) return periodService.periods();

//     await periodService.loadPeriods();
//     return periodService.periods();
// };
