/* ============================================================
   THE CARD CATALOG — every book in the Library
   ------------------------------------------------------------
   To shelve a new book:
     1. Write it as a plain text file in this folder, e.g.
        posts/the-first-lantern.md  (formatting tips below)
     2. Add an entry to the list here with the same slug.

   shelf:  "chronicles"  → The Story of Trempyon (shown oldest first,
                           numbered Vol. I, II, III… in the order listed)
           "radio"       → Late Night on NeighborhoodFM (shown newest first)
   slug:   the file name without ".md" (lowercase, dashes, no spaces)
   title:  shown on the spine and the page
   date:   "YYYY-MM-DD"
   blurb:  one or two lines shown when someone hovers the book (optional)
   color:  spine color (optional, picked for you if left out)
   draft:  true keeps the book off the shelves unless you visit
           library/?drafts or radio/?drafts (handy for previewing).
           It isn't secret: anyone who knows that address can read it.

   Formatting inside the .md file:
     blank line      → new paragraph
     *words*         → italics        **words**  → bold
     ## Heading      → a heading      > words    → a quote
     * * *           → a scene break  [text](https://…) → a link
   ============================================================ */
window.TREMPYON_LIBRARY = [
  {
    shelf: "chronicles",
    slug: "arrival",
    title: "Arrival",
    date: "",
    blurb: "Forgot how you got here?",
  },
  {
    shelf: "chronicles",
    slug: "departure",
    title: "Departure",
    date: "",
    blurb: "Ready to go home?",
  },
  {
    shelf: "chronicles",
    slug: "thomas",
    title: "Thom-kin",
    date: "",
    blurb: "Wanna read more about the Lamplighter?",
  },
];
