import { CosmosClient, Container } from "@azure/cosmos";

let _client: CosmosClient | null = null;

function getClient(): CosmosClient {
  if (_client) return _client;

  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;

  if (!endpoint || !key) {
    throw new Error("Missing COSMOS_ENDPOINT or COSMOS_KEY env vars");
  }

  _client = new CosmosClient({ endpoint, key });
  return _client;
}

export function getCosmosContainer(containerName: string): Container {
  const dbName = process.env.COSMOS_DATABASE || "loansdb";
  const client = getClient();
  return client.database(dbName).container(containerName);
}
