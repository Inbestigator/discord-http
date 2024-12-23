import type {
  APIMessage,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageJSONBody,
  Snowflake,
} from "discord-api-types/v10";
import { callDiscord } from "../../internal/utils.ts";

/**
 * Post a message to a guild text or DM channel.
 * @param channel The channel to post the message to
 * @param data The message data
 */
export async function createMessage(
  channel: string,
  data: string | RESTPostAPIChannelMessageJSONBody,
): Promise<APIMessage> {
  if (typeof data === "string") {
    data = { content: data };
  }

  const res = await callDiscord(`channels/${channel}/messages`, {
    method: "POST",
    body: data,
  });

  return res.json();
}

/**
 * Retrieves the messages in a channel.
 * @param channel The channel to get messages from
 */
export async function getMessages(channel: string): Promise<APIMessage[]> {
  const res = await callDiscord(`channels/${channel}/messages`, {
    method: "GET",
  });

  return res.json();
}

/**
 * Retrieves a specific message in the channel.
 * @param channel The channel to get the message from
 * @param message The snowflake of the message to get
 */
export async function getMessage(
  channel: string,
  message: string,
): Promise<APIMessage> {
  const res = await callDiscord(`channels/${channel}/messages/${message}`, {
    method: "GET",
  });

  return res.json();
}

/**
 * Edit a previously sent message.
 * @param channel The channel to edit the message in
 * @param message The snowflake of the message to edit
 * @param data The new message data
 */
export async function editMessage(
  channel: string,
  message: string,
  data: string | RESTPatchAPIChannelMessageJSONBody,
): Promise<APIMessage> {
  if (typeof data === "string") {
    data = { content: data };
  }

  const res = await callDiscord(`channels/${channel}/messages/${message}`, {
    method: "PATCH",
    body: data,
  });

  return res.json();
}

/**
 * Delete a message. If operating on a guild channel and trying to delete a message that was not sent by the current user, this endpoint requires the `MANAGE_MESSAGES` permission.
 * @param channel The channel to delete the message from
 * @param message The snowflake of the message to delete
 */
export async function deleteMessage(
  channel: string,
  message: string,
): Promise<void> {
  await callDiscord(`channels/${channel}/messages/${message}`, {
    method: "DELETE",
  });
}

/**
 * Delete multiple messages in a single request.
 * @param channel The channel to delete messages from
 * @param messages An array of snowflakes
 */
export async function bulkDelete(
  channel: string,
  messages: Snowflake[],
): Promise<void> {
  await callDiscord(`channels/${channel}/messages/bulk-delete`, {
    method: "DELETE",
    body: { messages },
  });
}

/**
 * Adds a reaction to a message.
 * @param channel The channel to add the reaction in
 * @param message The message to add the reaction to
 * @param emoji The emoji to react with
 */
export async function createReaction(
  channel: string,
  message: string,
  emoji: string,
): Promise<void> {
  await callDiscord(
    `channels/${channel}/messages/${message}/reactions/${emoji}/@me`,
    { method: "PUT" },
  );
}

/**
 * Deletes a reaction from a message.
 * @param channel The channel to delete the reaction in
 * @param message The message to delete the reaction from
 * @param emoji The emoji to delete
 * @param user The user to delete the reaction for (defaults to self)
 */
export async function deleteReaction(
  channel: string,
  message: string,
  emoji: string,
  user?: string,
): Promise<void> {
  await callDiscord(
    `channels/${channel}/messages/${message}/reactions/${emoji}/${
      user ?? "@me"
    }`,
    { method: "DELETE" },
  );
}
