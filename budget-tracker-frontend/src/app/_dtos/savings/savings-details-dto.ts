export interface SavingsDetailsDto {
    savingId: number;
    name: string;
    description: string;
    note?: string;
    category?: string;
    amount: number;
    createdAt: string
}
