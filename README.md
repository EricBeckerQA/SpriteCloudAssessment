# spriteCloud Test Automation Challenge — UI + API (Playwright / JavaScript)

A consultant-grade end-to-end automation framework covering **UI testing** against
[SauceDemo](https://www.saucedemo.com) and **API testing** against
[DummyJSON](https://dummyjson.com), built with **Playwright Test** in JavaScript.

The repository is structured the way a high-priority client hand-off should be:
clear architectural layers, no magic strings, configuration driven by environment
variables, deep assertions, and a CI pipeline that runs everything and attaches a
report.

---

## Quick start

```bash
# 1. Install dependencies
npm ci          # or: npm install

# 2. Install the Playwright browser (Chromium)
npx playwright install --with-deps chromium

# 3. (Optional) configure environment
cp .env.example .env      # defaults already point at the public demo apps

# 4. Run everything
npm test

# Targeted runs
npm run test:ui           # UI suite only
npm run test:api          # API suite only

# View the HTML report after a run
npm run report
```

No `.env` is required to run — the framework falls back to the public demo URLs
and credentials. `.env` exists so you can repoint the suite at another
environment without touching code.

---

## Architecture

The framework is deliberately layered so that **test logic, page objects, and the
business layer are separate** — no locators or raw HTTP live in a spec.

```
Test Spec  →  Business Flow  →  Page Object / API Client  →  Playwright API
 what +          user            locators / endpoints         browser / http
 assert        journey
```

```
.
├── src/
│   ├── config/          # env-driven URLs + centralised test data (no magic strings)
│   ├── ui/
│   │   ├── pages/       # Page Objects: locators + atomic actions only
│   │   └── flows/       # Business layer: composes pages into user journeys
│   ├── api/
│   │   ├── clients/     # One client per resource over Playwright's request context
│   │   └── schemas/     # JSON-Schema response contracts + AJV validator
│   └── utils/           # Framework-agnostic helpers (price math)
├── tests/
│   ├── ui/              # checkout · sorting · failed-login
│   └── api/             # auth · product · cart · delete · negative
├── fixtures/            # Custom Playwright fixtures (dependency injection)
├── .github/workflows/   # CI pipeline
└── playwright.config.js # Two projects (ui, api), reporters, trace/screenshot/video
```

### Layer responsibilities

| Layer | Lives in | Responsibility | Never does |
|-------|----------|----------------|------------|
| **Spec** | `tests/` | Describes a scenario; owns **all** assertions | Touch locators or URLs |
| **Flow** (business layer) | `src/ui/flows/` | Orchestrates page objects into a journey | Assert |
| **Page Object** | `src/ui/pages/` | Locators + atomic actions | Assert / business logic |
| **API Client** | `src/api/clients/` | One resource's endpoints | Assert |

---

## Test coverage

### UI — `https://www.saucedemo.com`

| # | Scenario | Spec | Key assertion |
|---|----------|------|---------------|
| 1 | Full checkout of two items + validate final price | `tests/ui/checkout.spec.js` | Expected subtotal/tax/total are **computed from the item prices on screen** and matched against the app's breakdown — not hardcoded |
| 2 | Sort items by name Z-A and validate sorting | `tests/ui/sorting.spec.js` | Rendered order must deep-equal the same list sorted descending — catches partial sorts |
| 3 | Failed login validation | `tests/ui/login-negative.spec.js` | Error banner visible, exact message, **and** user kept off the inventory page |

### API — `https://dummyjson.com`

| # | Scenario | Spec | Key assertion |
|---|----------|------|---------------|
| 1 | Successful login | `tests/api/auth.spec.js` | 200 + non-empty token + response describes the requested user |
| 2 | Get a product, validate content | `tests/api/product.spec.js` | Full response validated against a JSON-Schema **contract**, plus business fields |
| 3 | Create a cart of 3 products for the same user id | `tests/api/cart.spec.js` | Logs in, reuses the returned user id, validates schema + **reconciles totals/quantities** against line items |
| 4 | DELETE operation | `tests/api/delete.spec.js` | `isDeleted === true`, correct id, parseable `deletedOn` timestamp |
| 5 | Two negative scenarios, two endpoints | `tests/api/negative.spec.js` | Bad login → 400 + message; unknown product → 404 + message (status **and** body) |

---

## Why these tools

- **Playwright Test for both UI and API.** Playwright's `APIRequestContext`
  handles HTTP natively, so UI and API tests share one runner, one config, one
  report and one trace viewer. That's a simpler, more maintainable hand-off than
  pairing a UI tool with a separate HTTP library.
- **AJV (JSON Schema) for API validation.** Asserting an entire response shape in
  one statement catches contract regressions that a few field-by-field checks
  would miss — the "deep assertion" bar applied to the API layer.
- **Custom fixtures for dependency injection.** Specs declare what they need
  (`{ checkoutFlow }`, `{ cartClient }`) and receive a ready instance, so object
  construction lives in one place and tests stay declarative.
- **Derived price assertion.** The checkout test reads the prices SauceDemo
  displays and computes the expected tax/total from them, so the test validates
  the *math* rather than memorising a dollar figure that breaks when the catalogue
  changes.

---

## Reporting

Every run produces a **Playwright HTML report** in `playwright-report/`
(`npm run report` to open it). In CI the report is uploaded as a build artifact
on every run — including failures — so each execution has an attached, browsable
report with traces, screenshots and video for any failed test.

## Debuggability

`playwright.config.js` retains a **trace on first retry**, a **screenshot on
failure** and **video on failure**. Open the HTML report, click a failed test,
and replay exactly what happened — no local reproduction required.

---

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`:
installs dependencies, installs Chromium, runs the full UI + API suite, and
uploads the HTML report. The pipeline fails if any test fails, so a green
pipeline means a green suite.

---

## Assumptions

1. **DummyJSON is a mock API.** Its `add`/`delete` operations are simulated and
   not persisted server-side. The tests therefore validate the **response
   contract** (status, shape, echoed values, internal consistency) rather than
   durable state — which is the correct thing to assert against a mock.
2. **DummyJSON token field.** Recent DummyJSON returns `accessToken`; older
   versions returned `token`. The auth test accepts either so it's resilient to
   that version difference.
3. **SauceDemo sales tax** is applied at the rate shown in its checkout UI (8%,
   kept in `src/config/test-data.js`). The price test derives the expected tax
   from that rate and the on-screen prices rather than trusting a hardcoded total.
4. **Happy-path UI user** is `standard_user`; the failed-login test uses
   deliberately invalid credentials.
5. **Runtime**: Node 18+ and the Chromium build pinned by the installed Playwright
   version. CI uses Node 20.

---

## Use of AI

Per the challenge instructions, AI usage is disclosed here. An AI assistant
(Anthropic's Claude) was used to help **scaffold the framework structure, draft
boilerplate (page objects, clients, config), and draft this README**. All
architectural decisions were reviewed and owned by the author, every test was run
and verified to pass against the live demo applications, and the assertions and
assumptions were validated against the actual API/UI behaviour.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run the full UI + API suite |
| `npm run test:ui` | Run UI tests only |
| `npm run test:api` | Run API tests only |
| `npm run report` | Open the last HTML report |
| `npm run lint` | Run ESLint |
