import { DatingConcept } from '../types';

export const DATING_CONCEPTS: DatingConcept[] = [
  {
    term: 'Rizz',
    tag: 'Core Charisma',
    definition: 'The ability to effortlessly charm, build tension, and attract someone through witty, confident banter.',
    wingmanRule: 'True rizz is calibrated. Never try too hard. Unspoken comfort and teasing confidence beat 5-paragraph essays every time.',
    example: '"I was gonna say something smooth, but your dog in photo 3 stole all your spotlight."',
  },
  {
    term: 'Talking Stage',
    tag: 'Phase 1',
    definition: 'The delicate initial messaging period before regular dates. Momentum is make-or-break here.',
    wingmanRule: 'Do not stay in the talking stage past 5-7 days of texting without setting up a real meetup. Otherwise, you become pen pals.',
    example: '"We\'re having way too much fun debating this over text. Thursday drinks, you pick the spot or I pick the drinks?"',
  },
  {
    term: 'Situationship',
    tag: 'Relationship Status',
    definition: 'A romantic or physical connection without explicit labels or mutual clarity.',
    wingmanRule: 'If you want more, test investment with bold, casual dates. Never have "the talk" over text — do it in person with calm confidence.',
    example: '"Are we pretending we\'re just friends who accidentally text each other every single morning, or are we admitting it?"',
  },
  {
    term: 'Ghosting',
    tag: 'Disappearing Act',
    definition: 'When they abruptly stop responding without explanation after active conversation.',
    wingmanRule: 'Zero anger, zero guilt-trips. Do not send "Did I do something wrong?". Either let it go with dignity or send a lighthearted 48-hour re-hook.',
    example: '"Glad to see you survived the weekend abduction. Did the aliens at least have good taste in pizza?"',
  },
  {
    term: 'Breadcrumbing',
    tag: 'Red Flag',
    definition: 'Sending sporadic, low-effort pings ("hey stranger", random fire emoji, viewing all your stories) to keep you on the hook with zero real effort.',
    wingmanRule: 'Call it out playfully or demand real action. Match their low effort with playful boundary setting.',
    example: '"You drop by my DMs once a week like a mysterious seasonal guest. What\'s the scheme here?"',
  },
  {
    term: 'Orbiting',
    tag: 'Social Media',
    definition: 'Viewing every story and liking posts within minutes, but never initiating or answering a real conversation.',
    wingmanRule: 'Don\'t mistake story views for romantic investment. Story watching is passive; real dates take effort.',
    example: '"You\'re first in line on my story views every day, but silent in the DMs. Fan club membership is $5/month."',
  },
  {
    term: 'Love Bombing',
    tag: 'Danger Warning',
    definition: 'Excessive flattery, future-faking ("you\'re my soulmate" in week one), and overwhelming affection used as a hook.',
    wingmanRule: 'Slow them down. Maintain your frame and observe consistency over time before matching intensity.',
    example: '"Hold up, we haven\'t even fought over where to eat tacos yet and you\'re already picking out our vacation cabin?"',
  },
  {
    term: 'Left on Read',
    tag: 'Anxiety Trigger',
    definition: 'When the messaging app shows "Read / Seen" with no response.',
    wingmanRule: 'Rule #1: Put your phone down. Never panic double-text in the same hour. Wait at least 24 hours, then start a totally fresh, unrelated topic.',
    example: '"Okay but serious question: is pineapple on pizza actually a crime or are people just followers?"',
  },
  {
    term: 'Double Texting',
    tag: 'Strategy',
    definition: 'Sending a second message before they replied to your previous one.',
    wingmanRule: 'Only double-text if you are pivoting to high-value humor, a funny photo, or a time-sensitive plan. Never double text to ask why they didn\'t reply.',
    example: '"Saw this dog in sunglasses today and immediately thought of your bio. Had to share."',
  },
  {
    term: 'Dry Texter',
    tag: 'Frustration',
    definition: 'Someone who responds with "k", "haha", "nice", or "cool" without giving conversational hooks.',
    wingmanRule: 'Stop feeding them essays! Tease their dryness playfully, or give them a multiple choice challenge.',
    example: '"Whoa, calm down with all that enthusiasm, save some excitement for the weekend."',
  },
  {
    term: 'Killer Openers',
    tag: 'Technique',
    definition: 'Specific, observation-based conversation starters instead of boring "hey" or "how was your day".',
    wingmanRule: 'Pick a distinct detail in their photo or prompt. Make an assumption or light tease rather than a generic question.',
    example: '"I\'m getting strong \'orders dessert first and regrets nothing\' vibes from your second photo."',
  },
  {
    term: 'Asking For The Date',
    tag: 'Closing Technique',
    definition: 'The smooth transition from digital texting banter to a real-life meetup.',
    wingmanRule: 'Pivot on a high point of humor. Suggest a low-pressure, specific activity with a timeframe: "Drinks this Thursday" beats "We should hang out sometime".',
    example: '"You seem dangerously fun. Let\'s grab a drink this Thursday and see if your banter holds up in person."',
  },
];

export const SAMPLE_CHATS = [
  {
    title: 'Dry Reply: "haha yeah"',
    text: 'Her: haha yeah it was pretty chill I guess',
    context: 'Asked how her weekend trip to the beach went',
    mood: 'funny',
  },
  {
    title: 'Flirty Ping: "what are you doing tonight?"',
    text: 'Her: so what are you up to tonight? 👀',
    context: 'Been chatting on Hinge for 2 days with good banter',
    mood: 'spicy',
  },
  {
    title: 'Ghost Revival: "hey stranger"',
    text: 'Her: hey stranger! haha how have you been?',
    context: 'Disappeared 2 weeks ago after we talked about favorite movies',
    mood: 'flirty',
  },
  {
    title: 'Playful Tease: "you seem like trouble"',
    text: 'Her: haha idk you seem like trouble tbh 🙈',
    context: 'Debating our favorite music festivals on Tinder',
    mood: 'flirty',
  },
  {
    title: 'Hard Day: "work was exhausting"',
    text: 'Her: honestly today was the most exhausting day ever at work, just crashed on the couch',
    context: 'Texting after work, want to be supportive yet charming',
    mood: 'motivating',
  },
];
