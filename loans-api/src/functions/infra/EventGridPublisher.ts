import { randomUUID } from "crypto";

export class EventGridPublisher {
  async publish(eventType: string, subject: string, data: unknown): Promise<void> {
    const endpoint = process.env.EVENTGRID_TOPIC_ENDPOINT;
    const key = process.env.EVENTGRID_TOPIC_KEY;

    if (!endpoint || !key) {
      // 本地/未配置时不让系统炸（你也可以改成 throw）
      console.warn("EventGrid not configured: missing EVENTGRID_TOPIC_ENDPOINT or EVENTGRID_TOPIC_KEY");
      return;
    }

    const events = [
      {
        id: randomUUID(),
        eventType,
        subject,
        eventTime: new Date().toISOString(),
        dataVersion: "1.0",
        data,
      },
    ];

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "aeg-sas-key": key,
      },
      body: JSON.stringify(events),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`EventGrid publish failed: ${res.status} ${text}`);
    }
  }
}
