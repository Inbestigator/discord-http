import type {
  APIMessage,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageJSONBody,
  Snowflake,
} from "discord-api-types/v10";
import { RouteBases, Routes } from "discord-api-types/v10";
import { callDiscord } from "../../internal/utils.ts";

/**
 * Lists the messages in a channel.
 * @param channel The channel to get the messages from
 */
export async function listMessages(channel: Snowflake): Promise<APIMessage[]> {
  const res = await callDiscord(Routes.channelMessages(channel), {
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
  channel: Snowflake,
  message: Snowflake,
): Promise<APIMessage> {
  const res = await callDiscord(Routes.channelMessage(channel, message), {
    method: "GET",
  });

  return res.json();
}

/**
 * Post a message to a guild text or DM channel.
 * @param channel The channel to post the message to
 * @param data The message data
 */
export async function createMessage(
  channel: Snowflake,
  data: string | RESTPostAPIChannelMessageJSONBody,
): Promise<APIMessage> {
  if (typeof data === "string") {
    data = { content: data };
  }

  const res = await callDiscord(Routes.channelMessages(channel), {
    method: "POST",
    body: data,
  });

  return res.json();
}

/**
 * Edit a previously sent message.
 * @param channel The channel to edit the message in
 * @param message The snowflake of the message to edit
 */
export async function crosspostMessage(
  channel: Snowflake,
  message: Snowflake,
): Promise<APIMessage> {
  const res = await callDiscord(
    Routes.channelMessageCrosspost(channel, message),
    {
      method: "POST",
    },
  );

  return res.json();
}

/**
 * Adds a reaction to a message.
 * @param channel The channel to add the reaction in
 * @param message The message to add the reaction to
 * @param emoji The emoji to react with
 */
export async function createReaction(
  channel: Snowflake,
  message: Snowflake,
  emoji: string,
): Promise<void> {
  await callDiscord(
    Routes.channelMessageOwnReaction(channel, message, emoji),
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
  channel: Snowflake,
  message: Snowflake,
  emoji: string,
  user?: Snowflake,
): Promise<void> {
  await callDiscord(
    Routes.channelMessageUserReaction(channel, message, emoji, user ?? "@me"),
    { method: "DELETE" },
  );
}

/**
 * Get a list of users that reacted with this emoji.
 * @param channel The channel to get the reaction in
 * @param message The message to get the reaction from
 * @param emoji The emoji to list
 * @param options Optional query parameters
 */
export async function listReactions(
  channel: Snowflake,
  message: Snowflake,
  emoji: string,
  options?: {
    /** The type of reaction */
    type?: "Normal" | "Burst";
    /** Get users after this user ID */
    after?: Snowflake;
    /** Max number of users to return */
    limit?: number;
  },
): Promise<void> {
  const url = new URL(
    Routes.channelMessageReaction(channel, message, emoji),
    RouteBases.api,
  );

  if (options?.type !== undefined) {
    url.searchParams.append("type", options.type === "Normal" ? "0" : "1");
  }
  if (options?.after) url.searchParams.append("after", options.after);
  if (options?.limit !== undefined) {
    url.searchParams.append("limit", options.limit.toString());
  }

  const res = await callDiscord(url.toString(), { method: "GET" });

  return res.json();
}

/**
 * Deletes all reactions on a message.
 * @param channel The channel to delete the reactions in
 * @param message The message to delete the reactions from
 */
export async function deleteAllReactions(
  channel: Snowflake,
  message: Snowflake,
): Promise<void> {
  await callDiscord(Routes.channelMessageAllReactions(channel, message), {
    method: "DELETE",
  });
}

/**
 * Deletes all reactions of a specific emoji on a message.
 * @param channel The channel to delete the reactions in
 * @param message The message to delete the reactions from
 * @param emoji The emoji to delete
 */
export async function deleteAllEmojiReactions(
  channel: Snowflake,
  message: Snowflake,
  emoji: string,
): Promise<void> {
  await callDiscord(
    Routes.channelMessageReaction(channel, message, encodeURIComponent(emoji)),
    { method: "DELETE" },
  );
}

/**
 * Edit a previously sent message.
 * @param channel The channel to edit the message in
 * @param message The snowflake of the message to edit
 * @param data The new message data
 */
export async function editMessage(
  channel: Snowflake,
  message: Snowflake,
  data: string | RESTPatchAPIChannelMessageJSONBody,
): Promise<APIMessage> {
  if (typeof data === "string") {
    data = { content: data };
  }

  const res = await callDiscord(Routes.channelMessage(channel, message), {
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
  channel: Snowflake,
  message: Snowflake,
): Promise<void> {
  await callDiscord(Routes.channelMessage(channel, message), {
    method: "DELETE",
  });
}

/**
 * Delete multiple messages in a single request.
 * @param channel The channel to delete messages from
 * @param messages An array of snowflakes
 */
export async function bulkDelete(
  channel: Snowflake,
  messages: Snowflake[],
): Promise<void> {
  await callDiscord(Routes.channelBulkDelete(channel), {
    method: "DELETE",
    body: { messages },
  });
}
