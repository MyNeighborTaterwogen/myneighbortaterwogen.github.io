/* ============================================================
   TREMPYON — SITE SETTINGS
   This is the only file you need to touch for everyday updates.
   (Running late / one-off notes go in status.json instead.)
   ============================================================ */
window.TREMPYON = {
  // Your handle as shown around the site
  handle: "@MyNeighborTaterwogen",

  // Your YouTube handle
  youtubeHandle: "@taterwogen",

  // Twitch channel name (used for the live indicator, TV embed + links)
  twitchChannel: "MyNeighborTaterwogen",

  links: {
    twitch:  "https://www.twitch.tv/myneighbortaterwogen",
    youtube: "https://www.youtube.com/channel/UC4PK_4fGu3wCr8UdeoYJedA",
    discord: "https://discord.gg/V9WZgfvvw9",
    writing: "#library"                               // ← e.g. your Substack / AO3 / Wattpad
  },

  /* ---------- Schedule ----------
     The schedule is read automatically from your Twitch schedule
     (Creator Dashboard → Settings → Stream → Schedule). Cancel a stream
     there and the site shows it as cancelled. */
  twitchBroadcasterId: "1527630774",

  // You go live this many minutes before the scheduled start (the pre-show)
  preshowMinutes: 15,

  // How long after the scheduled start the site says "running a little late"
  lateGraceMinutes: 60,

  // Optional names for each night's stream (Twitch's schedule titles are used if you set them there)
  dayTitles: {
    Monday:    "Town Hall Broadcast",
    Tuesday:   "Town Hall Broadcast",
    Wednesday: "Town Hall Broadcast",
    Thursday:  "Town Hall Broadcast",
    Friday:    "Friday Fright Night",
    Saturday:  "Town Hall Broadcast",
    Sunday:    "Town Hall Broadcast"
  },

  // Backup schedule, only used if Twitch can't be reached.
  // Times are 24h in scheduleTimezone (the SHOW start, not the pre-show).
  scheduleTimezone: "America/New_York",
  schedule: [
    { day: "Monday",    time: "20:00" },
    { day: "Tuesday",   time: "20:00" },
    { day: "Wednesday", time: "20:00" },
    { day: "Thursday",  time: "20:00" },
    { day: "Friday",    time: "20:00" },
    { day: "Saturday",  time: "20:00" },
    { day: "Sunday",    time: "20:00" }
  ],
  streamHours: 4
};
