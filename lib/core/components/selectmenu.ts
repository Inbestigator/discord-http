import type {
  APISelectMenuComponent,
  ComponentType,
} from "discord-api-types/v10";

enum SelectType {
  Channel = 8,
  Mentionable = 7,
  Role = 6,
  String = 3,
  User = 5,
}

type SelectMap = {
  [Key in keyof typeof ComponentType]: Extract<
    APISelectMenuComponent,
    { type: typeof ComponentType[Key] }
  >;
};

/**
 * Creates a select menu component
 */
export function SelectMenu<K extends keyof typeof SelectType>(
  data:
    & Omit<
      SelectMap[
        K extends "Channel" ? "ChannelSelect"
          : K extends "Mentionable" ? "MentionableSelect"
          : K extends "Role" ? "RoleSelect"
          : K extends "String" ? "StringSelect"
          : K extends "User" ? "UserSelect"
          : never
      ],
      "type"
    >
    & {
      type: K;
    },
): APISelectMenuComponent {
  const select = {
    ...data,
    type: SelectType[data.type],
  };

  return select as unknown as APISelectMenuComponent;
}
