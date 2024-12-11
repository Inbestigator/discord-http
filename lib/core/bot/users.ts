import type { APIUser } from "discord-api-types/v10";
import { DiscordRequest } from "../../internal/utils.ts";

/**
 * Returns a user object for a given user ID.
 * @param id The ID of the user to fetch
 */
export async function getUser(id: string): Promise<APIUser> {
  const res = await DiscordRequest(`users/${id}`, {
    method: "GET",
  });

  return res.json();
}
