export interface CreateFixedExpenseDto {
    name: string;
    description: string;
    note?: string;
    amount: number;
    category?: string;
    periodId: number;
    userId: number;
}