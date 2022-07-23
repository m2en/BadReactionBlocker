import * as config from './service/reaction/config.json';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { prefix, token } from './util/envManager';
import { reactionBlock } from './service/reactionBlock';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.login(token).catch(console.error);

client.on('ready', () => {
  const blacklist = config.bad_emoji_name;
  console.log('==========================');
  console.log('BadReactionBlockerを起動しました。');
  console.log(`prefix: ${prefix}`);
  console.log(`ブラックリストに追加されている絵文字数: ${blacklist.length}`);
  console.log(
    `ブラックリストに追加されている絵文字:\n(警告: Unicode絵文字は正しく表示されない場合があります) `
  );
  blacklist.forEach((value) => {
    console.log(value.split(','));
  });
  console.log(
    '注意: ブラックリストに絵文字を追加するにはBadReactionBlockerのソースコードにPRを送る必要があります。詳細はReadme.mdを参照してください。\nhttps://github.com/m2en/BadReactionBlocker'
  );
  console.log('==========================');
});

client.on('messageReactionAdd', async (reaction, user) => {
  await reactionBlock(client, reaction, user);
});
