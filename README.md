# BadReactionBlocker

行儀上悪いリアクションを貼っちゃった可愛い君を通報して、そのリアクションを削除しちゃうぞ！

## Usage

```shell
git clone git@github.com:m2en/BadReactionBlocker.git
cd BadReactionBlocker

docker build ./ bad-reaction-blocker
docker run --env-file ./.env bad-reaction-blocker
```

## How to

Botはギルドに参加した時点から有効になります。

リアクションが付与されたときにそのリアクションの名前・Unicodeが [`config.json`](https://github.com/m2en/BadReactionBlocker/blob/main/src/server/service/reaction/config.json) の `bad_emoji_name` に一致した際に、削除します。

削除したあとは `.env` の `LOG_CHANNEL_ID` で指定したチャンネルにログを送信します。

- このBotより、権限を持っているユーザーのリアクションは削除できません。
- `MANAGE_MESSAGE` を持っているユーザーのリアクションは例外的に無視されます。

## Config

絵文字を追加する際は [`config.json`](https://github.com/m2en/BadReactionBlocker/blob/main/src/server/service/reaction/config.json) ( `src/server/service/reaction/config.json` ) に対して、PRを送ってください。

- カスタム絵文字の場合はそのカスタム絵文字の名前を指定します。
  - Discordクライアントにて `\` のあと絵文字を入力して送信すれば名前とIDを入手できます。

  ![絵文字の出し方](/docs/image/img.png)

- Unicode絵文字はそのまま指定します。(Discordの仕様)


