import * as dotenv from 'dotenv';

dotenv.config();
export function envManager<K extends readonly string[]>(
  keys: K
): Record<K[number], string> {
  const env: Partial<Record<K[number], string>> = {};
  for (let i = 0; i < keys.length; ++i) {
    const key: K[number] = keys[i];
    if (process.env[key] !== undefined && process.env[key] !== '') {
      env[key] = process.env[key];
    } else {
      throw new Error(`必要な環境変数が指定されていません: ${key}`);
    }
  }

  return env as Record<K[number], string>;
}

dotenv.config();
export const {
  DISCORD_TOKEN: token,
  PREFIX: prefix,
  LOG_CHANNEL_ID: channelId,
  GUILD_ID: guildId
} = envManager(['DISCORD_TOKEN', 'PREFIX', 'LOG_CHANNEL_ID', 'GUILD_ID']);
