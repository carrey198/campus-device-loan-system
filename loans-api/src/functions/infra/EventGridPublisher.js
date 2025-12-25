"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventGridPublisher = void 0;
const axios_1 = __importDefault(require("axios"));
class EventGridPublisher {
    constructor() {
        this.endpoint = process.env.EVENT_GRID_TOPIC_ENDPOINT;
        this.key = process.env.EVENT_GRID_TOPIC_KEY;
    }
    async publish(eventType, subject, data) {
        const events = [
            {
                id: Date.now().toString(),
                eventType,
                subject,
                eventTime: new Date().toISOString(),
                data,
                dataVersion: "1.0"
            }
        ];
        await axios_1.default.post(this.endpoint, events, {
            headers: {
                "aeg-sas-key": this.key,
                "Content-Type": "application/json"
            }
        });
    }
}
exports.EventGridPublisher = EventGridPublisher;
