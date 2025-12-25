import { Loan } from "./loan";



export interface LoanRepo {
  createLoan(loan: Loan): Promise<void>;
  getLoan(id: string): Promise<Loan | null>;
  listLoans(): Promise<Loan[]>;
}
