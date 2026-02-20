# Publer Auto-Post Setup

## What it does
На всеки push към `main` с промени в `src/data/blog/index.ts` — автоматично публикува новата статия в свързаните social media профили.

## 1. Създай Publer акаунт
1. Отиди на [publer.com](https://publer.com) и се регистрирай
2. Свържи профилите си: Facebook Page, LinkedIn, X/Twitter, Instagram
3. Запиши **Workspace ID** от Settings → API → Workspace ID

## 2. Генерирай API токен
1. Settings → API → Generate Token
2. Запиши токена — показва се само веднъж!

## 3. Вземи Account IDs
1. GET `https://app.publer.com/api/v1/accounts` с хедър `Authorization: Bearer-API YOUR_TOKEN`
2. Копирай `id` полетата за профилите, в които искаш да постваш
3. Разделяй ги с запетая: `id1,id2,id3`

```bash
curl https://app.publer.com/api/v1/accounts \
  -H "Authorization: Bearer-API YOUR_TOKEN" \
  -H "Publer-Workspace-Id: YOUR_WORKSPACE_ID"
```

## 4. Добави GitHub Secrets

В GitHub repo → Settings → Secrets → Actions:

| Secret | Стойност |
|--------|----------|
| `PUBLER_API_TOKEN` | API токена от стъпка 2 |
| `PUBLER_WORKSPACE_ID` | Workspace ID от стъпка 1 |
| `PUBLER_ACCOUNT_IDS` | Comma-separated account IDs от стъпка 3 |

## 5. Тест
Push промяна в `src/data/blog/index.ts` → Actions tab → провери логовете.

## Формат на поста
```
📊 {Заглавие на статията}

{Описание}

🔗 https://spesti.app/blog/{slug}

#спести #финанси #Bulgaria
```
