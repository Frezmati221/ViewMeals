import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Headers,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { StripeService } from "./stripe.service";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Stripe")
@Controller("stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post("create-subscription")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create Stripe subscription" })
  @ApiResponse({
    status: 201,
    description: "Subscription created successfully",
  })
  async createSubscription(
    @Body() body: { restaurantId: string; planId: string }
  ) {
    return this.stripeService.createSubscription(
      body.restaurantId,
      body.planId
    );
  }

  @Post("cancel-subscription/:restaurantId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cancel Stripe subscription" })
  @ApiResponse({
    status: 200,
    description: "Subscription cancelled successfully",
  })
  async cancelSubscription(@Param("restaurantId") restaurantId: string) {
    return this.stripeService.cancelSubscription(restaurantId);
  }

  @Get("subscription-status/:restaurantId")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get subscription status" })
  @ApiResponse({
    status: 200,
    description: "Subscription status retrieved successfully",
  })
  async getSubscriptionStatus(@Param("restaurantId") restaurantId: string) {
    // return this.stripeService.getSubscriptionStatus(restaurantId);
    return;
  }

  @Post("webhook")
  @ApiOperation({ summary: "Handle Stripe webhook" })
  @ApiResponse({ status: 200, description: "Webhook handled successfully" })
  async handleWebhook(
    @Body() body: any,
    @Headers("stripe-signature") signature: string
  ) {
    return this.stripeService.handleWebhook(body, signature);
  }
}
