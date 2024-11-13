import { configDotenv } from "@dotenvx/dotenvx";
configDotenv();
import nacl from "tweetnacl";
import { Buffer } from "node:buffer";
import { env } from "node:process";
import type { HonoRequest } from "hono";

/**
 * Verifies the signature of the POST request
 */
export async function verifySignature(req: HonoRequest): Promise<boolean> {
  const signature = req.header("X-Signature-Ed25519");
  const timestamp = req.header("X-Signature-Timestamp");

  if (!signature || !timestamp) {
    return false;
  }

  const body = await req.text();

  return nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(env.DISCORD_PUBLIC_KEY as string, "hex"),
  );
}

export async function DiscordRequest(
  endpoint: string,
  options: Record<string, unknown>,
) {
  const url = "https://discord.com/api/v10/" + endpoint;
  if (options.body) options.body = JSON.stringify(options.body);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  return res;
}

export async function InstallGlobalCommands(
  appId: string,
  commands: {
    name: string;
    description: string;
    type: number;
    integration_types: number[];
    contexts: number[];
    options?: { name: string; description: string; type: number }[];
  }[],
) {
  const endpoint = `applications/${appId}/commands`;

  try {
    await DiscordRequest(endpoint, { method: "PUT", body: commands });
  } catch (err) {
    console.error(err);
  }
}
