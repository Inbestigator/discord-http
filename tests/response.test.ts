import { runInteraction } from "@dressed/dressed/server";
import { generateXSignature } from "./signature.test.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.env.set("DISCORD_TOKEN", "bot_token");

Deno.test(async function replying() {
  const stamp = Date.now().toString();

  const defaultBody = {
    type: 0,
    id: "int_id",
    token: "int_token",
    data: {
      id: "cmd_id",
      name: "cmd_name",
      custom_id: "cpt_id",
    },
  };

  for (const n of [1, 2, 3, 5]) {
    const body = { ...defaultBody, type: n };
    const requests: {
      input: string | URL | Request;
      init?: RequestInit;
    }[] = [];
    // @ts-ignore This is fine
    // deno-lint-ignore no-global-assign
    fetch = function fetch(
      input: string | URL | Request,
      init?: globalThis.RequestInit,
    ) {
      requests.push({ input, init });
      return new Response(null, { status: 204 });
    };

    const res = await runInteraction(
      (i) => {
        i.reply("Command received");
      },
      (i) => {
        i.reply("Component received");
      },
      new Request("http://localhost:8000", {
        method: "POST",
        headers: {
          "X-Signature-Ed25519": generateXSignature(
            stamp,
            JSON.stringify(body),
          ),
          "X-Signature-Timestamp": stamp,
        },
        body: JSON.stringify(body),
      }),
    );

    // Ping test case
    if (n === 1) {
      assertEquals(res.status, 200);
      assertEquals(
        await res.json(),
        { type: 1 },
      );
      continue;
    }

    assertEquals(requests.length, 1);
    assertEquals(
      requests[0].input,
      new URL(
        "https://discord.com/api/v10/interactions/int_id/int_token/callback",
      ),
    );
    assertExists(requests[0].init);
    assertEquals(
      requests[0].init.method,
      "POST",
    );
    assertEquals(
      requests[0].init.headers,
      {
        Authorization: "Bot bot_token",
        "Content-Type": "application/json",
      },
    );
    assertEquals(
      requests[0].init.body,
      JSON.stringify({
        type: 4,
        data: { content: `${n === 2 ? "Command" : "Component"} received` },
      }),
    );
  }
});
