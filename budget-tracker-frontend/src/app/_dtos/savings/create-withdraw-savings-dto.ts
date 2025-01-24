export interface CreateWithdrawSavingsDto {
    name: string;
    description: string;
    note?: string;
    amount: number;
    category?: string;
    userId: string;
}
