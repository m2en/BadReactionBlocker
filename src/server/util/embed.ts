import { EmbedBuilder } from 'discord.js';

export interface logEmbedFieldsOption {
  name: string;
  value: string;
  inline?: boolean;
}

export type logEmbedOptions = {
  description: string;
  fields: logEmbedFieldsOption[];
};

export function logEmbed(options: logEmbedOptions) {
  return new EmbedBuilder()
    .setAuthor({
      name: 'BadReactionBlocker'
    })
    .setDescription(options.description)
    .setColor('Blue')
    .addFields(options.fields);
}
