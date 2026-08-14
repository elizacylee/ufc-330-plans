# Setup — see her answers automatically

You'll do two quick things: (A) make a free "inbox" that collects her answers, and
(B) put the page on a real web link you can send her. ~10 minutes total, one time.

---

## A) The answer inbox (Google Sheet + script)

Every answer she taps becomes a row in a Google Sheet you own, and you get an
email the moment she gives a final yes/no.

1. Go to <https://sheets.new> to make a new blank Google Sheet. Name it anything.
2. In the menu: **Extensions → Apps Script**. A code editor opens.
3. Delete whatever sample code is there. Open `google-apps-script.gs` from this repo,
   copy **all** of it, and paste it in.
4. Near the top, set `NOTIFY_EMAIL` to the email you want alerts sent to.
5. Click **Deploy → New deployment**.
   - Click the gear ⚙ next to "Select type" → choose **Web app**.
   - **Execute as:** Me.
   - **Who has access:** **Anyone**. (Required so the page can post to it. It's an
     unguessable URL — no one sees it unless you share it.)
   - Click **Deploy**. Approve the Google permission prompt (it's your own script).
6. Copy the **Web app URL** it gives you. It ends in `/exec`.

## B) Put your URL into the page

1. Open `index.html`. Near the top of the `<script>` find:
   ```js
   var CONFIG = { logEndpoint: "" };
   ```
   Paste your `/exec` URL between the quotes. Save.
   *(Or just send me the URL and I'll paste it in and push it for you.)*

## C) Give it a real web link (GitHub Pages — free)

The page must be hosted so she can open it on her phone.

1. On GitHub, go to this repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Pick the branch (`main` after we merge, or the working branch) and folder `/ (root)`. **Save**.
4. Wait ~1 minute. Your link will be:
   `https://elizacylee.github.io/git_test/index.html`

---

## How you'll see answers

- **Live progress:** keep the Google Sheet open. Rows appear as she taps —
  location, gym, food, UFC, and finally `yes` or `no`. Even if she closes it
  halfway, a `left` row shows where she stopped.
- **Email alert:** you get an email the second she picks yes or no, with the full plan.

## Testing it as many times as you want

- Just open the link and run through it — each run is a fresh `Session` in the sheet.
- To label a test run, add `?by=friend` to the link, e.g.
  `.../index.html?by=friend`. Those rows show up tagged "friend" so they
  don't get confused with her real run (which is tagged "her" by default).
- Nothing to reset between runs — there's a **↺ start over** button at the end too.
