export { createInstance } from "../core/instance.ts";
import setupCommands from "../core/bot/commands.ts";
import setupComponents from "../core/bot/components.ts";
import type { Command } from "../internal/types/config.ts";

/**
 * Configuration for a specific command.
 *
 * Specify the description and options here.
 */
export interface CommandConfig extends Omit<Command, "name" | "default"> {}

export type { BotConfig } from "../internal/types/config.ts";

export type {
  CommandInteraction,
  MessageComponentInteraction,
  ModalSubmitInteraction,
} from "../internal/types/interaction.ts";

export * from "../core/server.ts";

export { verifySignature } from "../internal/utils.ts";

export { setupCommands };

export { setupComponents };

export * from "../core/build.ts";

export * from "../core/components/actionrow.ts";
export * from "../core/components/button.ts";
export * from "../core/components/selectmenu.ts";
export * from "../core/components/textinput.ts";
export * from "../core/bot/options.ts";

export {
  getGuild,
  getMember,
  listChannels,
  listMembers,
} from "../core/bot/guilds.ts";
export {
  bulkDelete,
  createMessage,
  createReaction,
  deleteMessage,
  deleteReaction,
  editMessage,
  getMessage,
  getMessages,
} from "../core/bot/messages.ts";
export {
  deleteChannel,
  getChannel,
  modifyChannel,
} from "../core/bot/channels.ts";
export {
  addThreadMember,
  createForumThread,
  createThread,
  joinThread,
  leaveThread,
  removeThreadMember,
} from "../core/bot/threads.ts";
export { getUser } from "../core/bot/users.ts";
