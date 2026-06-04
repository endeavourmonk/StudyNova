import { createUser } from "@/db/queries/users";
import { generateUsername } from "@/lib/generateUsername";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );

    if (evt.type === "user.created") {
      console.log("User created", evt.data);

      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0].email_address;
      const username = generateUsername(first_name ?? "");

      // Create user in database
      const user = await createUser({
        clerkUserId: id,
        email,
        username,
        firstName: first_name ?? "",
        lastName: last_name ?? "",
      });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
