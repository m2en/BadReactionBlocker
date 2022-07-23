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

export function timeoutEmbed(guildName: string) {
  return new EmbedBuilder()
    .setTitle('タイムアウト')
    .setDescription(
      '以下のギルドで許可されていない絵文字をリアクションで送信したため、3分間タイムアウトされました。'
    )
    .addFields([
      {
        name: '対象ギルド名',
        value: guildName
      }
    ])
    .setColor('Red');
}
