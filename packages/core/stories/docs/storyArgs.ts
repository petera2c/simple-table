/**
 * Shared Storybook args helper for Docs & Examples stories.
 */
import {
  defaultVanillaArgs,
  vanillaArgTypes,
  type UniversalVanillaArgs,
} from "../vanillaStoryConfig";

export const storyArgs = (exampleDefaults: Partial<UniversalVanillaArgs> = {}) => ({
  args: { ...defaultVanillaArgs, ...exampleDefaults },
  argTypes: vanillaArgTypes,
});
