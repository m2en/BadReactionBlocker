import * as config from './reaction/config.json';
import {
  Client,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User
} from 'discord.js';
import { sendLog } from '../util/sendLog';

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
