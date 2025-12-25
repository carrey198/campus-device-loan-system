import { SubscriptionRepo } from "./subscription-repo";
import { CosmosSubscriptionRepo } from "./cosmos-subscription-repo";

export const subscriptionRepo: SubscriptionRepo =
  new CosmosSubscriptionRepo();
