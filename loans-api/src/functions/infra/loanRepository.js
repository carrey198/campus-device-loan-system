"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanRepository = void 0;
const cosmosClient_1 = require("./cosmosClient");
class LoanRepository {
    constructor() {
        this.container = (0, cosmosClient_1.getLoansContainer)();
    }
    async addLoan(loan) {
        await this.container.items.create(loan);
    }
    async getLoan(id) {
        const { resource } = await this.container.item(id, id).read();
        return resource !== null && resource !== void 0 ? resource : null;
    }
    async updateLoan(loan) {
        await this.container.item(loan.id, loan.id).replace(loan);
    }
    async deleteLoan(id) {
        await this.container.item(id, id).delete();
    }
    async createLoan(loan) {
        return this.addLoan(loan);
    }
}
exports.LoanRepository = LoanRepository;
