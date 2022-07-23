import {
  ActionRowBuilder,
  ButtonBuilder,
  ChannelType,
  Client,
  EmbedBuilder,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User
} from 'discord.js';
import { channelId, guildId } from './envManager';
import { logEmbed } from './embed';

async function getChannel(client: Client, channelId: string, guildId: string) {
  const targetGuild = await client.guilds.fetch(guildId);
  if (!targetGuild) {
    throw new Error(
      'ギルドを取得することが出来ませんでした。ギルドIDが正しいかどうか確認してください。'
    );
  }

  const targetChannel = await targetGuild.channels.fetch(channelId);
  if (!targetChannel || targetChannel.type !== ChannelType.GuildText) {
    throw new Error(
      'チャンネルを取得できなかったか、テキストチャンネルではないチャンネルが指定されています。IDが正しいかどうか確認してください。'
    );
  }

  return targetChannel;
}

function createEmbed(
  user: User | PartialUser,
  reaction: MessageReaction | PartialMessageReaction,
  emojiName: string
) {
  try {
    return logEmbed({
      description: `<@${user.id}> のリアクションを正常にブロックしました。`,
      fields: [
        {
          name: '絵文字',
          value: emojiName,
          inline: true
        },
        {
          name: '送信者',
          value: `<@${user.id}>`,
          inline: true
        },
        {
          name: 'チャンネル',
          value: `<#${reaction.message.channelId}>`,
          inline: true
        }
      ]
    });
  } catch (e) {
    console.error(e);
    return new EmbedBuilder()
      .setTitle('エラー')
      .setDescription(`エラーが発生しました。`)
      .setColor('Red');
  }
}

function createToMessageButton(messageLink: string) {
  return new ButtonBuilder()
    .setStyle(5)
    .setLabel('該当メッセージへ移動')
    .setEmoji('👉')
    .setURL(messageLink);
}

export async function sendLog(
  user: User | PartialUser,
  reaction: MessageReaction | PartialMessageReaction,
  client: Client,
  emojiName: string
) {
  const logChannel = await getChannel(client, channelId, guildId);
  if (!logChannel) {
    return;
  }

  const logEmbed = createEmbed(user, reaction, emojiName);
  if (!logEmbed) {
    return;
  }

  const toMessageButton = createToMessageButton(reaction.message.url);
  if (!toMessageButton) {
    return;
  }

  await logChannel.send({
    embeds: [logEmbed],
    components: [
      new ActionRowBuilder<ButtonBuilder>().setComponents([toMessageButton])
    ]
  });
}
