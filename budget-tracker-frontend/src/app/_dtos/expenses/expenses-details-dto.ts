export interface ExpenseDetailsDto {
    expenseId: number;
    name: string;
    description: string;
    note?: string;
    category?: string;
    amount: number;
    createdAt: string
}
