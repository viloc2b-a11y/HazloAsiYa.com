import crypto from "crypto";

const subscriberHash = crypto
  .createHash("md5")
  .update(email.toLowerCase())
  .digest("hex");

const res = await fetch(
  `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${subscriberHash}`,
  {
    method: "PUT",
    headers: {
      Authorization: `Basic ${btoa(`any:${MAILCHIMP_API_KEY}`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: "subscribed",
      status: "subscribed",
      merge_fields: {
        FNAME: firstName || "",
        TRAMITE: tramite || "general",
      },
    }),
  }
);