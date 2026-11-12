# incremental-react-migration

**Migrate a legacy React app to a modern stack one page at a time, with no rewrite and no feature freeze.**

A React 16 + Redux application hosts migrated pages built in React 19 + TypeScript + Redux Toolkit. The new code ships as a framework-agnostic custom element, and both runtimes share a single Redux store, auth layer and router.

This is a from-scratch rebuild of an architecture I work in day to day. It contains no proprietary code. The domain (experiments and groups) is just there to make the demo concrete.

---

## Quick start

Requires Node 20+.

```bash
npm run setup   # install both apps
npm run dev     # build next-app, serve the host at http://localhost:5173
npm test        # unit tests
```

## The 60-second demo

1. **Experiments**: a page still rendered by the legacy React 16 app.
2. **Groups**: a migrated page. The badge reads `React 19.1.0` inside a `React 16.14.0` shell.
3. Select **Growth Team** and **Payments Squad**, then click **Archive selected**.
   - One succeeds and one fails (the mock API rejects it on purpose).
   - The UI reports *"Archived 1 of 2"* with the reason and keeps the failed row selected for a one-click retry.
   - The header counter, rendered by **React 16**, drops from 4 to 3 instantly. Both apps read the same store.
4. **Back to experiments**: the new app navigates through the host's router. It never owns routing.

---

## Architecture

```
 legacy-host · React 16                              next-app · React 19 (separate bundle)
┌──────────────────────────────────┐               ┌────────────────────────────────────┐
│ Redux store (single owner)       │── .store ────▶│ <Provider store={hostStore}>       │
│ API client (auth, errors)        │── .bridge ───▶│ HostContext { bridge, callbacks }  │
│ Router                           │◀─ callbacks ──│ view registry → <ViewGroups />     │
│ reducers handle "groups/*"       │◀─ dispatch ───│ RTK slice action creators          │
└──────────────────────────────────┘               │ Shadow DOM · scoped styles         │
                                                   └────────────────────────────────────┘
          <next-app view="Groups">  ← the only thing the host renders
```

The host renders `<next-app view="…">` wherever a page has been migrated. Everything the new app may use from the host is declared in one file: [`next-app/src/host/types.ts`](next-app/src/host/types.ts).

```ts
interface HostBridge    { fetch<T>(method: string, url: string, body?: unknown): Promise<{ status: number; data: T }> }
interface HostCallbacks { navigate(page: string): void }
// plus .store: the host's Redux store
```

Migrating a page means building it in `next-app`, registering it in the view registry, and swapping one line in the host.

### Project structure

```
legacy-host/                     React 16 · Redux · thunk · class components
  src/components/NextAppBridge.jsx   mounts <next-app>, injects store/bridge/callbacks
  src/reducers/groups.js             reduces the new app's RTK action types
  src/fakeApi.js                     in-memory backend with a deterministic failure

next-app/                        React 19 · TypeScript (strict) · Redux Toolkit · Vite lib build
  src/registerElement.tsx            custom element: lifecycle, Shadow DOM, React root
  src/host/                          host contract (types + context)
  src/views/                         view registry; views own data and side effects
  src/components/                    presentational components only
  src/hooks/useGroups.ts             data fetching through the host bridge
  src/actions/archiveGroups.ts       batch action with per-item results (+ spec)
```

---

## Key decisions

| Decision | Why | Cost |
| --- | --- | --- |
| **Custom element as the boundary** | Two React majors can't share a tree. A custom element is a native boundary that any framework can render, with no iframe isolation problems (layout, auth, shared state). | React ships twice (+~80 kB gzip) until the legacy app is gone. |
| **Single shared store, owned by the host** | Pages that haven't migrated yet keep reading the same data. No sync layer, no stale state. | The legacy reducers must handle the new action types. This duplication is deliberate, temporary and isolated in one file per slice. |
| **Host owns fetch and routing** | Auth, token refresh, error logging and URLs stay in one place. The new app stays testable with a fake bridge. | The contract has to be versioned with care. |
| **Shadow DOM** | Legacy global CSS can't leak into the new design system, and the reverse. | Portals and modals need an in-shadow mount point, and design tokens must be passed explicitly. |
| **Views own data, components are pure** | Components stay reusable and trivially testable. Side effects live in one layer. | Somewhat more prop drilling in deep trees. |
| **`Promise.allSettled` for batch actions** | `Promise.all` rejects on the first error even though other requests already succeeded server-side, so the UI would misreport state. | Per-item result handling in the UI. |

## Edge cases handled

- **Objects passed to custom elements from React 16.** React < 19 sets everything on a custom element as a string attribute (`"[object Object]"`). The bridge sets DOM *properties* through a ref. → [`NextAppBridge.jsx`](legacy-host/src/components/NextAppBridge.jsx)
- **Properties set before the element is defined.** An instance property shadows the class setter. `connectedCallback` re-applies them ("upgrade property" pattern). → [`registerElement.tsx`](next-app/src/registerElement.tsx)
- **Root lifecycle.** The React 19 root is created on connect and unmounted on disconnect, so navigating away doesn't leak.
- **`process.env.NODE_ENV` in library builds.** Vite doesn't replace it in lib mode, and React would throw in the browser. It is defined at build time.
- **Partial batch failure.** The store is updated only for confirmed successes, each failure is surfaced with its reason, and failed items stay selected for retry.

## Testing

- Unit tests (Vitest) cover the batch action: all succeed, mixed results, non-`Error` rejections, and an empty selection.
- CI runs typecheck, tests and both builds on every push.

## Production considerations (beyond this demo)

- **Contract versioning.** Expose a `contractVersion` on the element and fail loudly on mismatch when the bundles deploy independently.
- **Reducer injection.** Register slice reducers at runtime instead of mirroring action types in the legacy reducers.
- **Batch scale.** Add a concurrency limit, retry with backoff for transient errors, or a bulk endpoint that returns per-item results.
- **Observability.** Add an error boundary per view that reports through the host's logger, plus timing for mounts and requests.
- **Accessibility.** Manage focus across the shadow boundary on navigation, and announce batch results through a live region (the banner uses `role="status"`).
- **End-to-end tests.** Run Playwright against the embedded build. Shadow DOM is pierced by default.

## Stack

React 16.14 · React 19.1 · TypeScript 5 · Redux 4 · Redux Toolkit 2 · Vite 5 · Vitest 2

## License

MIT
