const DELAY = global.bot.config.halimaw.replyDelay;

const REPLIES = [
  "Bro really thought that was necessary",
  "Confidence... delusion... unmatched",
  "Say less, lost brain cells reading that",
  "You typed all that just to embarrass yourself?",
  "Main character energy but plot is mid",
  "Who hurt you? That hurt all of us",
  "Please stop before they file a restraining order",
  "You really said that out loud... permanently",
  "Audacity loud, intelligence on mute",
  "This is why mute buttons exist",
  "Chose violence against English language",
  "Not mad, just disappointed",
  "Aged like milk in the sun",
  "Grammar teachers crying somewhere",
  "Energy: I peaked in high school",
  "Dropped that like it was fire — it wasn't",
  "Chat was peaceful until you arrived",
  "Log off for everyone's mental health",
  "That was a bold... terrible choice",
  "Taking notes on how NOT to communicate",
  "Keyboard called — wants its letters back",
  "Silence golden, your message bronze",
  "Explain wrong? Not enough bandwidth",
  "Every type = angel loses brain cells",
  "Not wrong, just not trying",
  "Not hot take — cold mess",
  "Some questions better unanswered — yours",
  "Not everyone has good judgment",
  "Message empty like cloud",
  "Confidence 100 / Sense 0",
  "Aged faster than milk",
  "Bravery = knowing when to shut up",
  "Not every thought needs airtime",
  "Almost making sense... almost",
  "Filed under: Why though?",
  "Silence is okay, really",
  "Volume ≠ value",
  "Thinking hard? Don't hurt yourself",
  "That's not a take, that's mistake",
  "Agree = both wrong",
  "Instructions on shampoo bottles exist for a reason",
  "Would argue, don't speak nonsense",
  "Loud not clear — like bad speaker",
  "Floor is yours — give it back",
  "Not laughing AT you, laughing with concern",
  "Mystery — no solution found",
  "Bold typing choice",
  "We all have moments — this is yours",
  "Say less mean less",
  "Contribution zero, confidence infinite",
  "Making noise not history",
  "Sound not thought",
  "Reply properly? Nonsense takes time",
  "Keep talking — enjoying the example",
  "Words free, patience not",
  "Skipped thinking part",
  "Not every opinion needs airing",
  "Brave... wrong",
  "Don't ask what you mean, don't want to know",
  "Why can't we have nice quiet chats",
  "Question mark with no answer",
  "Not helping conversation",
  "Some shine — you just reflect",
  "Not a point, a post",
  "Don't type just because you can",
  "Akala mo may kwenta? Wala naman",
  "Kalmahan mo, hindi karera",
  "Ang tapang sa chat, tahimik sa personal",
  "Oras mo sayang diyan",
  "Bakit parang galit?",
  "Tumigil ka bago mahalin sarili mong salita",
  "Pahinga ka muna, nakakapagod ka",
  "Ang lakas ng loob, kulang sa laman",
  "Magsalita lang kung may sasabihin",
  "Paulit-ulit walang saysay",
  "Bakit sumagot kung di nakaintindi",
  "Mag-isip bago mag-send — libre naman",
  "Hindi lahat dapat sinasabi",
  "Ang gulo parang buhay mo",
  "Huwag mag-alala, di ka naman pinapakinggan",
  "Ang taas lipad, bagsak sa laman",
  "Sana kasing talino ng bilis mag-type",
  "Ang dami sinabi, wala naman napatunayan",
  "Tumahimik ka, mas mukha kang matalino"
];

module.exports.config = {
  name: "halimaw",
  version: "3.0.0",
  description: "Dashboard Login Version"
};

module.exports.run = async function ({ api, event, react, stats }) {
  const { threadID, messageID } = event;

  react("haha", messageID);

  setTimeout(() => {
    const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    api.sendMessage(reply, threadID);
    stats.repliesSent++;
    stats.lastReply = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
  }, DELAY);
};
