export interface CreateExpenseDto {
    name: string;
    description: string;
    note?: string;
    amount: number;
    category?: string;
    // periodId: number;
    userId: number;
}
