# spriteCloud Test Automation Challenge

End-to-end test automation for the spriteCloud assignment: UI checks against
[SauceDemo](https://www.saucedemo.com) and API checks against
[DummyJSON](https://dummyjson.com), built with Playwright Test in JavaScript.

I went with Playwright for both halves rather than pairing a UI tool with a
separate HTTP client — its `APIRequestContext` handles the API side natively,
so the whole suite shares one runner, one config and one HTML report. One
trace viewer to debug everything in, instead of two toolchains.

The layout below is how I'd actually want to find a project like this if I
inherited it from someone else: tests don't know about locators or HTTP
calls, page objects don't assert anything, and nothing about *which*
environment you're hitting is hardcoded into a spec.

---

## Running it

```bash
npm ci
npx playwright install --with-deps chromium

npm test            # everything
npm run test:ui     # just SauceDemo
npm run test:api    # just DummyJSON
npm run report      # open the last HTML report
```

You don't need a `.env` file — it falls back to the public demo apps and
credentials out of the box. If you want to point it at a different
environment, copy `.env.example` to `.env` and override `BASE_URL_UI` /
`BASE_URL_API` (and the auth fields, if needed). Nothing else in the codebase
hardcodes a host.

---

## How it's put together

```
Test Spec  →  Business Flow  →  Page Object / API Client  →  Playwright
 asserts        journey            locators / endpoints
```

Specs own every assertion. Flows just stitch page objects together into a
journey ("log in, add two items, reach checkout"). Page objects and API
clients are the only things that know a locator or an endpoint path exists.
If you're reading a spec and wondering what selector something uses, that's
on purpose — you shouldn't have to care.

```
src/
  config/     env-driven base URLs + test data, no magic strings in specs
  ui/pages/   one class per screen — locators + actions, never assertions
  ui/flows/   composes pages into a user journey
  api/clients/ one class per resource, returns the raw response
  api/schemas/ JSON-Schema contracts + the AJV wrapper that checks them
  utils/      pure helpers (price math) that don't touch Playwright at all
tests/
  ui/         checkout · sorting · failed login
  api/        auth · product · cart · delete · update · negative cases
fixtures/     custom Playwright fixtures — specs ask for {checkoutFlow} etc
              and get a wired-up instance, no `new` calls in test files
.github/workflows/  CI pipeline
```

---

## What's actually being tested

### UI — saucedemo.com

| Spec | What it checks |
|---|---|
| `checkout.spec.js` | Adds three items, then **derives** the expected subtotal/tax/total from the on-screen prices and compares that against what the app shows — rather than hardcoding a dollar figure that breaks the moment the catalogue changes |
| `sorting.spec.js` | Sorts Z→A and checks the rendered list equals the same items sorted descending — catching a partial sort, not just "the first item looks right" |
| `login-negative.spec.js` | Bad credentials → the right error text shows up *and* the URL never moves past the login page (a banner that flashes while the app lets you through anyway would still pass a weaker check) |

### API — dummyjson.com

| Spec | What it checks |
|---|---|
| `auth.spec.js` | Login returns 200, a non-empty token, and the response actually describes the user you asked for |
| `product.spec.js` | Full response validated against a JSON-Schema contract, plus the specific fields the test cares about |
| `cart.spec.js` | Logs in, builds a cart for that same user id, validates the schema, then reconciles the server's totals/quantities against the line items it returned |
| `delete.spec.js` | `isDeleted` is true, the id matches, and `deletedOn` parses as a real date |
| `update.spec.js` *(extra)* | PUT a couple of fields, get a merged object back with a 2xx — added this to round out CRUD since the brief only asked for create/read/delete |
| `negative.spec.js` | Two endpoints, two failure modes: bad login → 400 with a message, unknown product → 404 with a message. Status code alone isn't enough; the body has to say the right thing too |

---

## Some notes on the choices I made

- **Derived assertions over hardcoded ones.** Both the checkout price check
  and the sort check compute what they expect from data the page actually
  shows, instead of pinning a number that'll quietly go stale. I'd rather a
  test fail because the math is wrong than because the catalogue changed.
- **AJV for schema validation.** One `validateSchema()` call checks an entire
  response shape — required fields, types, the works — which catches contract
  drift a handful of individual `expect()` calls would miss. (This is also
  exactly what bit the cart test mid-build: DummyJSON quietly renamed a
  per-line-item field from `discountedTotal` to `discountedPrice`, and the
  schema caught it immediately instead of the test failing somewhere
  downstream with a confusing message.)
- **Fixtures instead of `new`-ing things in specs.** A spec asks for
  `{ checkoutFlow }` or `{ cartClient }` and gets a ready instance. Object
  construction lives in one file (`fixtures/test-fixtures.js`), so specs stay
  about behaviour, not setup.
- **The "extra" `update.spec.js` isn't padding.** It exists because, while
  working through the brief, the missing PUT coverage stood out as something
  I'd actually want on a real project — not because ten tests looks better
  than nine.

---

## Reporting & debugging

Every run writes a Playwright HTML report to `playwright-report/` (`npm run
report` opens it). CI uploads it as an artifact on every run, pass or fail.
Failures keep a trace, a screenshot, and video — open the report, click the
failed test, and you're looking at exactly what happened without needing to
reproduce it locally first.

## CI

`.github/workflows/ci.yml` runs the full suite on every push and PR to
`main` (and on demand via `workflow_dispatch`): installs deps, installs
Chromium, runs `npm test`, uploads the report. A green check here means the
suite actually passed, not just that the job didn't crash.

---

## Assumptions I made

1. **DummyJSON doesn't persist writes.** `add`/`update`/`delete` are
   simulated — the API echoes back a plausible response but nothing changes
   server-side. So these tests validate the *response contract* (status,
   shape, echoed values, internal consistency), which is the right thing to
   assert against a mock rather than chasing state that was never really
   written.
2. **The auth token field has changed over time.** Current DummyJSON returns
   `accessToken`; older docs/examples reference `token`. The auth test
   accepts either so it doesn't break on a naming detail.
3. **SauceDemo's tax rate (8%)** lives in `src/config/test-data.js` and the
   checkout test derives the expected tax from it rather than trusting a
   hardcoded total — see "derived assertions" above.
4. **Happy-path UI user** is `standard_user`; the negative-login test uses
   credentials that are deliberately wrong.
5. Built and run against Node 18+; CI pins Node 20.

---

## On AI usage

Per the challenge instructions: yes, I used an AI assistant (Claude) while
building this — mainly to move faster on boilerplate (page object
skeletons, API clients, the initial README draft) and as a sounding board
for structuring the layered architecture. I read and own every line in here,
ran the full suite against the live demo apps myself to confirm it actually
passes, and the schema fix mentioned above (DummyJSON's `discountedTotal` →
`discountedPrice` rename) is a real bug I hit and fixed after the fact, not
something scaffolded in from the start.

---

## Scripts

| Command | What it does |
|---|---|
| `npm test` | Full UI + API suite |
| `npm run test:ui` | UI suite only |
| `npm run test:api` | API suite only |
| `npm run report` | Open the last HTML report |
| `npm run lint` | ESLint |
