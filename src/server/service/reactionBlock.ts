import * as config from './reaction/config.json';
import {
  Client,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User
} from 'discord.js';
import { sendLog } from '../util/sendLog';
import { timeout } from '../util/envManager';
import { timeoutEmbed } from '../util/embed';

function getReaction(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) {
  if (user.bot || !reaction.message.guild) {
    return;
  }

  const emojiName = reaction.emoji.name;
  if (!emojiName) {
    return;
  }

  return {
    reaction,
    emojiName
  };
}

async function removeReaction(
  user: User | PartialUser,
  reaction: MessageReaction | PartialMessageReaction,
  emojiName: string,
  client: Client
) {
  const guild = reaction.message.guild;
  if (!guild) {
    return;
  }
  const guildMember = await guild.members.fetch(user.id);

  if (guildMember.permissions.has(['ManageMessages'])) {
    return;
  }

  const badEmojiName = config.bad_emoji_name;
  if (!badEmojiName) {
    throw new Error(
      '禁止絵文字の指定が出来ていないか、取得に失敗しました。正常にJSONファイルごとビルドされているかどうか確認してください。\n(通常JSONファイルはビルドディレクトリ内 /service/ ディレクトリにビルド時に一緒に生成されています。)'
    );
  }

  for (let i = 0; i < badEmojiName.length; i++) {
    if (emojiName.match(badEmojiName[i])) {
      await reaction.remove().catch(console.log);
      await sendLog(user, reaction, client, emojiName);
    }
  }

  if (timeout === 'true') {
    await guildMember.timeout(
      3 * 60 * 1000,
      'BadReactionBlockerにより、3分間自動タイムアウトされました。'
    );
    await guildMember.send({ embeds: [timeoutEmbed(guild.name)] });
  }
}

export async function reactionBlock(
  client: Client,
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) {
  const reactionData = getReaction(reaction, user);
  if (!reactionData) {
    return;
  }
  const { emojiName } = reactionData;

  await removeReaction(user, reaction, emojiName, client);
}
