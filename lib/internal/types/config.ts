import type {
  CommandInteraction,
  MessageComponentInteraction,
  ModalSubmitInteraction,
} from "./interaction.ts";
import type {
  APIApplicationCommandOption,
  LocalizationMap,
  Permissions,
} from "discord-api-types/v10";

/**
 * The configuration for the bot.
 */
export interface BotConfig {
  /** The ID for the bot */
  clientId: string;
  /** The bot's secret */
  clientSecret?: string;
  /** The endpoint that Discord will use */
  endpoint?: string;
  /** Are you using Deno? Defaults to `true` */
  deno?: boolean;
}

export interface Command {
  name: string;
  /**
   * Localization dictionary for the name field. Values follow the same restrictions as name
   */
  name_localizations?: LocalizationMap | null;
  /**
   * The localized name
   */
  name_localized?: string;
  /**
   * 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands
   */
  description: string;
  /**
   * Localization dictionary for the description field. Values follow the same restrictions as description
   */
  description_localizations?: LocalizationMap | null;
  /**
   * The localized description
   */
  description_localized?: string;
  /**
   * The parameters for the `CHAT_INPUT` command, max 25
   */
  options?: APIApplicationCommandOption[];
  /**
   * Set of permissions represented as a bitset
   */
  default_member_permissions?: Permissions | null;
  /**
   * Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible
   *
   * @deprecated Use `contexts` instead
   */
  dm_permission?: boolean;
  /**
   * Whether the command is enabled by default when the app is added to a guild
   *
   * If missing, this property should be assumed as `true`
   *
   * @deprecated Use `dm_permission` and/or `default_member_permissions` instead
   */
  default_permission?: boolean;
  /**
   * Indicates whether the command is age-restricted, defaults to `false`
   */
  nsfw?: boolean;
  default: (interaction: CommandInteraction) => unknown;
}

export interface Component {
  name: string;
  category: "buttons" | "modals" | "selects";
  default: (
    interaction: MessageComponentInteraction | ModalSubmitInteraction,
    args?: Record<string, string>,
  ) => unknown;
}
