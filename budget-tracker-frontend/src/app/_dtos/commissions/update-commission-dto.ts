export interface UpdateCommissionDto {
    name: string;
    description: string;
    note?: string;
    amount: number;
    category?: string;
    userId: number;
}
