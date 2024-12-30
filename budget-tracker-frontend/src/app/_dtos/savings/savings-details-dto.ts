export interface SavingsDetailsDto {
    savingsId: number;
    name: string;
    description: string;
    note?: string;
    category?: string;
    amount: number;
    createdAt: string
}
