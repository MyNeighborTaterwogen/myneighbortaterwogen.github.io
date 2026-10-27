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
    slug: "the-first-lantern",
    title: "The First Lantern",
    date: "2026-10-28",
    blurb: "It was already burning when everyone arrived. It has never once gone out.",
  },
];
