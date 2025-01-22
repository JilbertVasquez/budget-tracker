export interface UpdateFixedExpenseDto {
    name: string;
    description: string;
    note?: string;
    amount: number;
    category?: string;
    userId: number;
}
