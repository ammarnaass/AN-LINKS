### Task 2: Core Validation Utilities (Sanitizer, Bot Detector, Reserved Names)

**Files:**
- Create: `src/lib/url-sanitizer.ts`
- Create: `src/lib/bot-detector.ts`
- Create: `src/lib/reserved-usernames.ts`
- Test: `tests/unit/url-sanitizer.test.ts`
- Test: `tests/unit/bot-detector.test.ts`
- Test: `tests/unit/reserved-usernames.test.ts`

**Interfaces:**
- Produces:
  - `sanitizeUrl(rawUrl: string): { valid: boolean; normalizedUrl?: string; error?: string }`
  - `isBotOrPrefetch(userAgent: string | null, headers: Headers): boolean`
  - `isUsernameReserved(username: string): boolean`
  - `truncateIp(ip: string): string`

- [ ] **Step 1: Write failing unit tests for `url-sanitizer`, `bot-detector`, and `reserved-usernames`**
  - Verify rejection of `javascript:`, `data:`, raw IP addresses (`http://192.168.1.1`), and double shorteners (`bit.ly`).
  - Verify auto-prefixing of `https://` for valid domains without protocols.
  - Verify detection of `facebookexternalhit`, `Twitterbot`, `TelegramBot`, `WhatsApp`, `Bytespider`, and `Purpose: prefetch`.
  - Verify rejection of reserved names (`api`, `dashboard`, `admin`, `login`, `register`, `go`).
  - Verify IP truncation (`192.168.1.50` -> `192.168.1.0/24`).

- [ ] **Step 2: Run tests to verify failures**
- [ ] **Step 3: Implement validation utilities in `src/lib/`**
- [ ] **Step 4: Run tests to verify all pass**
- [ ] **Step 5: Commit**
  `git commit -m "feat: add url sanitization, bot detection, and reserved usernames utilities"`

---

