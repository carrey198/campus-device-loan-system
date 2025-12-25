import { app, InvocationContext } from "@azure/functions";

app.eventGrid("loan-created-handler", {
    handler: async (event, context: InvocationContext) => {

        // ⭐ 日志：触发事件
        context.log("LoanCreated handler triggered");

        context.log("Event received", {
            id: event.id,
            type: event.eventType,
            topic: event.topic,
            subject: event.subject
        });

        // ⭐ 日志：事件内容
        context.log("Event data", event.data);

        return;
    }
});
