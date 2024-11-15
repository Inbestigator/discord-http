import type { Component } from "../../internal/types/config.ts";
import { join } from "node:path";
import { underline, yellow } from "@std/fmt/colors";
import loader from "../../internal/loader.ts";
import type {
  MessageComponentInteraction,
  ModalSubmitInteraction,
} from "../../internal/types/interaction.ts";
import { ComponentType } from "discord-api-types/v10";
import { fetchFiles, type WalkEntry } from "../build.ts";
import { cwd } from "node:process";

/**
 * Fetches the components from the components directory
 *
 * @returns A function that runs a component
 */
export default async function setupComponents(
  componentFiles?: WalkEntry[],
): Promise<
  (
    interaction: MessageComponentInteraction | ModalSubmitInteraction,
  ) => Promise<void>
> {
  const generatingLoader = loader("Generating components");
  let generatedN = 0;
  const generatedStr: string[][] = [[underline("\nComponent")]];

  function addComponent(
    name: string,
    category: string,
    totalComponents: number,
  ) {
    generatedN++;
    generatedStr.push([
      totalComponents === 1
        ? "-"
        : generatedN === 1
        ? "┌"
        : totalComponents === generatedN
        ? "└"
        : "├",
      name + ` (${category})`,
    ]);
  }

  if (!componentFiles) componentFiles = await fetchFiles("src/components");

  try {
    const components = await parseComponents(componentFiles);

    components.forEach((component) => {
      addComponent(component.name, component.category, components.length);
    });

    generatingLoader.resolve();

    console.log(generatedStr.map((row) => row.join(" ")).join("\n"));

    return async function runComponent(
      interaction: MessageComponentInteraction | ModalSubmitInteraction,
    ) {
      const category = getCategory();

      function getCategory() {
        switch (
          (interaction.data as { component_type: number }).component_type
        ) {
          case ComponentType.Button:
            return "buttons";
          case ComponentType.ChannelSelect:
          case ComponentType.RoleSelect:
          case ComponentType.UserSelect:
          case ComponentType.StringSelect:
          case ComponentType.MentionableSelect:
            return "selects";
          default:
            return "modals";
        }
      }

      const component = components.find((c) => {
        const pattern = c.name.replace(/\[.+?\]/g, "([a-zA-Z0-9_-]+)");
        const regex = new RegExp(`^${pattern}$`);

        return (
          regex.test(interaction.data.custom_id) && c.category === category
        );
      });

      if (!component) {
        console.warn(
          ` ${yellow("!")} Component "${interaction.data.custom_id}" not found`,
        );
        return;
      }

      const argNames = [...component.name.matchAll(/\[(.+?)\]/g)].map(
        (match) => match[1],
      );
      const pattern = component.name.replace(/\[.+?\]/g, "([a-zA-Z0-9_-]+)");
      const regex = new RegExp(`^${pattern}$`);
      const matches = regex.exec(interaction.data.custom_id);

      const args = matches
        ? argNames.reduce((acc: { [key: string]: string }, argName, index) => {
          acc[argName] = matches[index + 1];
          return acc;
        }, {})
        : {};

      const componentLoader = loader(
        `Running component "${component.name}"${
          Object.keys(args).length > 0
            ? " with args: " + JSON.stringify(args)
            : ""
        }`,
      );

      try {
        await Promise.resolve(component.default(interaction, args));
        componentLoader.resolve();
      } catch (error) {
        componentLoader.error();
        console.error(" └", error);
      }
    };
  } catch (e) {
    generatingLoader.error();
    throw e;
  }
}

const validComponentCategories = ["buttons", "modals", "selects"];

async function parseComponents(componentFiles: WalkEntry[]) {
  const componentData: Component[] = [];

  for (const file of componentFiles) {
    const componentModule = (await import(
      join("file://", cwd(), file.path)
    )) as {
      config?: Component;
      default: (
        interaction: MessageComponentInteraction | ModalSubmitInteraction,
      ) => unknown;
    };

    const category = file.path.split(/[\\\/]/)[2];

    if (!validComponentCategories.includes(category)) {
      console.warn(
        ` ${
          yellow("!")
        } Category for "${file.name}" could not be determined, skipping`,
      );
      continue;
    }

    const component: Component = {
      name: file.name,
      category: category as "buttons" | "modals" | "selects",
      default: componentModule.default,
    };

    if (
      componentData.find(
        (c) => c.name === component.name && c.category === category,
      )
    ) {
      console.warn(
        ` ${yellow("!")} ${
          component.category.slice(0, 1).toUpperCase() +
          component.category.split("s")[0].slice(1)
        } component "${component.name}" already exists, skipping the duplicate`,
      );
      continue;
    }

    componentData.push(component);
  }

  return componentData;
}
