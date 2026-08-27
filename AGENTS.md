# sample-panel — состояние проекта для агента

Админ-панель менеджера киберлиги (backend: `api.manager.development.clp.cyberboxing.ru`). SPA, не Next.js.

**Ветка:** `feat/auth` (от `develop`). Последний коммит: `feat: added login page`.

**Незакоммичено (на момент 2026-08-26):**
- `react-router-dom` в `package.json` — пакет есть, роутера в коде нет.
- `src/shared/api/fetcher.ts` — на 401 чистит `localStorage.token`.
- `src/shared/api/middleware.ts` — пустой файл, никуда не подключён.

---

## Стек

- Vite 8, React 19, TypeScript, pnpm
- Tailwind 4 + shadcn (`base-luma`, Base UI, `src/components/ui/`)
- TanStack Query v5, TanStack Table
- Orval → React Query клиент + Zod-схемы
- FSD-скелет + `@conarti/eslint-plugin-feature-sliced`
- Алиас `@` → `src/`
- Dev-сервер: `host: true`, порт **5183**

Зависимости есть, но **не используются**: `react-router-dom`, `i18next`, `@hookform/resolvers`, `msw`. `react-hook-form` в deps нет.

---

## Архитектура (FSD, частично)

```
src/
  main.tsx                 ← реальная точка входа (не app/)
  app/                     ← пустой Public API, не используется
  pages/main-page.tsx      ← единственная страница: логин + две таблицы
  widgets/login-form/      ← форма логина
  features/                ← пустой слой
  entities/
    auth/auth-api.ts       ← логин, запись JWT
    boxer/                 ← list-таблица
    streams/               ← list-таблица
  shared/
    api/fetcher.ts         ← customFetch для Orval
    api/base-url.ts
    api/middleware.ts      ← пусто
    api/schema.ts          ← openapi-typescript (устаревший дубль)
    lib/getToken.ts
    ui/DynamicTable.tsx
    model/petstore.ts      ← Orval, НЕ ПРАВИТЬ
    model/schemas/*.zod.ts ← Orval, НЕ ПРАВИТЬ
    model/schemas/configInterface.ts  ← рукописный (см. риск ниже)
  components/ui/           ← shadcn, не FSD-путь
  lib/utils.ts             ← shadcn `cn()`
```

Слои созданы скриптом `init-fsd.js`. Public API (`index.ts`) у `app/pages/widgets/features/entities` — заглушки `export {}`. Импорты идут напрямую (`@/entities/boxer`, `@/widgets/login-form/login-form`).

Известные отклонения от FSD: shadcn в `src/components/` и `src/lib/`, точка входа в `main.tsx` вместо `app/`. Не ломать ради чистоты, пока явно не попросили.

**Правило импортов:** `shared` не импортирует `entities` / `features` / `pages` / `widgets`. Редирект и `queryClient.clear()` нельзя класть в `fetcher.ts`.

---

## API: как сделано

### Генерация

```bash
pnpm generate:api   # orval
```

Конфиг: `orval.config.ts`.

- Spec: `https://api.manager.development.clp.cyberboxing.ru/documentation-json`
- Клиент: `src/shared/model/petstore.ts` (`mode: single`, `client: react-query`, `mock: true`)
- Zod: `src/shared/model/schemas/`
- Mutator: `customFetch` из `src/shared/api/fetcher.ts`
- Хуки: `useQuery` + infinite/suspense; `useMutation: false` — мутации только как async-функции

`src/shared/api/schema.ts` сгенерирован `openapi-typescript` раньше; актуальный клиент — Orval/`petstore.ts`.

**Риск:** `configInterface.ts` лежит в папке Orval-схем и может быть затёрт при `pnpm generate:api`. Перед регенерацией проверить, что файл на месте; лучше вынести в `src/shared/model/configInterface.ts`.

### customFetch

Возвращает `{ data, status, headers }`, не «голое» тело. Поэтому строки списка достают так:

```ts
getRows: (res) => res.data.data.boxers   // boxers / streams / …
```

Токен: `getToken()` → `localStorage.token`. В `Authorization` кладётся **сырой JWT без `Bearer `**. Бэкенд куки не принимает.

На 401 сейчас только `localStorage.removeItem("token")`. Редиректа и сброса Query-кэша нет.

### Dev-прокси (CORS)

`VITE_API_BASE_URL` в `.env` пустой → запросы same-origin. Vite проксирует на `VITE_API_PROXY_TARGET` (по умолчанию `http://192.168.1.223:3000`).

Префиксы в `vite.config.ts`: `boxer|tournament|terminal|overlay|health|stream|event|venue|manager`.

Если дергать **match / round / report / station** — добавить префикс в proxy, иначе 404 от Vite.

### Домены бэка (клиент уже сгенерирован)

CRUD/list есть в `petstore.ts`: boxer, stream, tournament, event, venue, overlay, terminal, manager, match, round, report, station, health.

В UI подключены только **boxer list** и **stream list**.

---

## Auth: как сделано

1. `LoginForm` (виджет) держит стейт `{ data: { manager: { username, password } } }` — форма тела совпадает с OpenAPI `ManagerAuthSchema`.
2. Сабмит → `authApi` → `managerControllerHandleManagerAuth` (POST `/manager/auth`).
3. JWT берётся из `data.data.meta.jwt` и пишется в `localStorage.token`.
4. Все следующие Orval-вызовы подставляют токен через `customFetch`.

Форма и таблицы на **одной** `MainPage`. Нет: роутера, guard, logout UI, валидации, авторефетча таблиц после логина (Query уже мог уйти в error без токена).

Опечатка в форме: `handleSumbit`.

### Куда класть HTTP-middleware (уже решено)

Не создавать слой `src/middleware/` и не ждать Next.js-`middleware.ts`.

| Что | Куда |
|-----|------|
| JWT в заголовок, парсинг, статус | `shared/api/fetcher.ts` |
| Чтение/запись токена | `shared/lib/getToken.ts` (можно расширить до `token.ts`) |
| Логин / logout | `entities/auth/` |
| Редирект, `queryClient.clear()` | `app/` (когда появится) |
| Guard роутов | `app/`, когда будет роутер |

Пока interceptors не нужны — логика остаётся в `fetcher.ts`. Пустой `middleware.ts` не подключать, пока нет нескольких независимых шагов.

---

## Таблицы сущностей: паттерн (повторять)

Эталон: `entities/boxer` и `entities/streams`.

```
entities/<name>/
  api/<name>-api.ts     # defineTableConfig + orval useXxxList
  ui/<name>-table.tsx   # <DynamicTable config={…} />
  index.ts              # export таблицы
```

Конфиг (`defineTableConfig` в `configInterface.ts`):

- `entityName` — человекочитаемое имя
- `table.useHook` — обёртка над orval-хуком; params пока захардкожены `{ skip: 0, take: 10 }`
- `table.getRows` — путь до массива в ответе
- `table.columns` — `{ header, accessorKey }` где `accessorKey` — ключ строки

`DynamicTable` (`shared/ui`): loading → `Spinner`, error → текст, empty → «Нет данных», иначе TanStack Table + shadcn `Table`. Пагинации, сортировки, create/update/delete нет.

Опечатка в заголовках колонок: «Обовлен» вместо «Обновлен».

---

## UI

shadcn: `button`, `input`, `table`, `badge`, `spinner`. Стили: `src/index.css` (Inter Variable, CSS variables, taupe). Не тащить новые UI-киты.

---

## Что не сделано

- Роутинг и отдельные страницы
- Защита роутов / редирект на логин
- Слой `features/`
- CRUD кроме list
- Пагинация UI (только `skip/take` в хуке)
- Остальные сущности бэка
- i18n, формы на RHF, MSW в рантайме
- Слой `app/` как композиция провайдеров

---

## Команды

```bash
pnpm dev            # vite :5183
pnpm build          # tsc -b && vite build
pnpm lint
pnpm generate:api   # orval; не коммитить случайно стёртый configInterface.ts
```

`.env` в gitignore. Шаблон: `.env.example`.
