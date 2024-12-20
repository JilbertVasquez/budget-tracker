import { PeriodDto } from "../periods/periodDto";

export interface FixedExpenseDetailsDto {
    expenseId: number;
    name: string;
    description: string;
    note?: string;
    category?: string;
    amount: number;
    period: PeriodDto;
    createAt: string
}
