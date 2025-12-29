import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function getDevicesHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  const devices = [
    {
      id: "1",
      name: "Arduino Uno",
      type: "microcontroller",
      status: "available",
      totalCount: 10,
      availableCount: 7,
    },
    {
      id: "2",
      name: "Raspberry Pi 4",
      type: "single-board-computer",
      status: "available",
      totalCount: 5,
      availableCount: 2,
    }
  ];

  return {
    status: 200,
    jsonBody: devices,
  };
}
