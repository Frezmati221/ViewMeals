import { Injectable } from "@nestjs/common";

@Injectable()
export class StripeService {
  constructor() {}

  async createSubscription(restaurantId: string, planId: string) {
    return { message: "Subscription created", restaurantId, planId };
  }

  async cancelSubscription(restaurantId: string) {
    return { message: "Subscription cancelled", restaurantId };
  }

  async handleWebhook(body: any, signature: string) {
    return { message: "Webhook handled" };
  }
}
