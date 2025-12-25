export type LoanStatus = "reserved" | "collected" | "returned" | "cancelled";

export interface Loan {
    id: string;
    userId: string;       
    productId: string;    
    createdAt: string;    
    dueAt: string;        
    status: LoanStatus;

    collectedAt?: string;
    returnedAt?: string;
}
