/* ============================================================
   THE CARD CATALOG — every book in the Library
   ------------------------------------------------------------
   To shelve a new book:
     1. Write it as a plain text file in this folder, e.g.
        posts/the-first-lantern.md  (formatting tips below)
     2. Add an entry to the list here with the same slug.

   shelf:  "lore"        → Lore (shown oldest first,
                           numbered Vol. I, II, III… in the order listed)
           "writing"     → Writing (shown newest first)
           "tools"       → Tools (shown in the order listed)
   slug:   the file name without ".md" (lowercase, dashes, no spaces)
   title:  shown on the spine and the page
   date:   "YYYY-MM-DD"
   blurb:  one or two lines shown when someone hovers the book (optional)
   color:  spine color (optional, picked for you if left out)
   url:    a page to open instead of a Markdown post (optional)
   draft:  true keeps the book off the shelves unless you visit
           library/?drafts (handy for previewing).
           It isn't secret: anyone who knows that address can read it.

   Formatting inside the .md file:
     blank line      → new paragraph
     *words*         → italics        **words**  → bold
     ## Heading      → a heading      > words    → a quote
     * * *           → a scene break  [text](https://…) → a link
   ============================================================ */
window.TREMPYON_LIBRARY = [
  {
    shelf: "lore",
    slug: "arrival",
    title: "Arrival",
    date: "",
    blurb: "Forgot how you got here?",
  },
  {
    shelf: "lore",
    slug: "departure",
    title: "Departure",
    date: "",
    blurb: "Ready to go home?",
  },
  {
    shelf: "lore",
    slug: "torment",
    title: "Exile",
    date: "",
    blurb: "Curious about where the bad people go?",
  },
  {
    shelf: "lore",
    slug: "thomas",
    title: "Thom-kin",
    date: "",
    blurb: "Wanna read more about the Lamplighter?",
  },
  {
    shelf: "writing",
    slug: "queens",
    title: "For the Queens!",
    date: "",
    blurb: "A Warframe short story.",
  },
  {
    shelf: "writing",
    slug: "tavern",
    title: "Oath Breaker",
    date: "",
    blurb: "A D&D Themed 30 minute writing challenge.",
  },
  {
    shelf: "writing",
    slug: "radio",
    title: "Enlightened Radio",
    date: "",
    blurb: "What's this? This book looks like it's been here a while...",
  },
  {
    shelf: "tools",
    slug: "warframe-damage-calculator",
    title: "Warframe Damage Calculator",
    date: "",
    blurb: "Calculate a build's effective DPS.",
    url: "../warframe/damage/",
  },
  {
    shelf: "tools",
    slug: "warframe-quiz",
    title: "Warframe Quiz",
    date: "",
    blurb: "Find a Warframe that suits your playstyle.",
    url: "../warframe/quiz/",
  },
  {
    shelf: "tools",
    slug: "warframe-effective-hp-calculator",
    title: "Effective HP Calculator",
    date: "",
    blurb: "Calculate and compare effective health.",
    url: "../warframe/health/",
  },
];
