# Trempyon — www.VisitTrempyon.com

A static site with no build step: plain HTML, CSS, and JS.

## Everyday edits
Your links, handle, pre-show length, and nightly stream names are in **`js/config.js`**.

## Live indicator & schedule (mostly automatic)
- **Live badge:** the site checks Twitch every minute. When you're live, it shows a red LIVE badge in the menu,
  a banner with your stream title, "ON AIR" on the TV, and 🔴 in the browser tab.
- **Schedule:** read automatically from your **Twitch schedule** (Creator Dashboard → Settings → Stream → Schedule).
  Times show in each visitor's own timezone. Doors open `preshowMinutes` (15) before the show starts.
- **Cancel a stream:** cancel that day's segment in your Twitch schedule. The site shows it crossed out.
- **Automatic states:** at doors time (7:45) it says *"Doors are opening"*. If you're not live by
  8:00, it says *"Running a little late"* for up to an hour (`lateGraceMinutes`). You don't have to touch anything.

### Manual overrides: `status.json`
Use this for anything Twitch can't express. Dates are in Eastern time, `YYYY-MM-DD`; times are 24-hour.
```json
{
  "notice": "Starting a bit late tonight, grabbing snacks!",
  "late": { "2026-10-08": "20:30" },
  "cancel": ["2026-10-09"]
}
```
- `notice`: a message shown at the top of the page and above the schedule. Set it back to `""` to clear it.
- `late`: moves that day's show to a new start time (the doors time moves too).
- `cancel`: marks those days cancelled, even if they're still on your Twitch schedule.

Tip: on GitHub Pages you can edit `status.json` right on github.com from your phone, and it updates in about a minute.

**Preview the live look anytime:** visit `/?demo=live`.

## Where things live
| File | What it is |
|---|---|
| `index.html` | All page content (town lore, Library stories, notice board notes, ticker) |
| `css/styles.css` | All styling. Colors are at the top under `:root` |
| `js/main.js` | Town skyline, falling leaves, clock, Twitch TV, guestbook, "Leave Town" |
| `404.html` | "You seem a little lost" page |
| `CNAME` | For GitHub Pages custom domain (delete if you host elsewhere) |

## Preview locally
```
python -m http.server 8080
```
Then open http://localhost:8080. The "Tune in here" Twitch button only appears when the site is
served from a web address (not when you double-click the file). That's because Twitch requires a domain.

## Hosting (pick one, all free)
- **Netlify / Cloudflare Pages:** drag this folder in, then add `visittrempyon.com` under custom domains.
- **GitHub Pages:** push to a repo, turn on Pages, and the `CNAME` file sets the domain.

Then point your domain's DNS at the host (each host walks you through it).

## Notes
- The guestbook saves only in each visitor's own browser. A shared guestbook needs a backend or a service.
- The visitor counter is decorative.
