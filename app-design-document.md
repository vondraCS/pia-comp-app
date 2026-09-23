# [App Name] — Prototype Design Document

> **Status:** Prototype design for a presentation demo · **Date:** September 22, 2026
> **Platform:** Platform-neutral mobile app (shown in phone mockups)
> **Audience:** ASU students (ASU-only access)

"[App Name]" is a placeholder used throughout. Swap it in once a name is chosen.

---

## 1. Overview

### The problem
Students do a lot: part-time jobs, class projects, clubs, volunteering, side projects. Most can't **put those experiences into words** that work on a resume, in an interview, or in a networking conversation. They also rarely meet students outside their own circle who could help them grow professionally.

### The idea
[App Name] is a **platonic, career-focused matching app**, like Hinge but for professional connection. Students swipe on anonymous-leaning profiles built around goals, experiences and ambitions, match with peers, and move the conversation to a coffee chat. Along the way, the app helps them **translate their experiences into resume-ready language**.

### Why it matters to ASU
- Connects students across majors, years and campuses.
- Makes career thinking part of everyday student life, not something that happens senior year.
- Surfaces ASU's career resources (events, workshops, career services) where students already spend time.
- Shifts the story from "party school" to **a school where students build careers together.**

### What the prototype needs to show
It is a clickable demo, not a working product. It needs to show clearly:
1. How a student sets up a profile that describes their experience well.
2. How matching works and why it feels professional, not romantic.
3. How the community (forum) and messaging lead to real-world coffee chats.
4. How the Experience Translator turns everyday experiences into career material.

---

## 2. Core Principles

| Principle | What it means in the design |
|---|---|
| **Substance over looks** | Photos stay hidden until two people match. Cards lead with goals, titles and experiences. |
| **Everything is a conversation starter** | Prompts, experiences and posts are written so someone can reply to them. |
| **Nudge, don't nag** | The app suggests coffee chats and events gently, with no pressure, streaks or guilt. |
| **Calm, readable, uncluttered** | One idea per screen, generous whitespace, a clear type hierarchy, one accent color. |
| **Career language made easy** | The app does the hard wording work so students can focus on what they did. |

---

## 3. Visual Design System

### Direction: Court
Neutral monochrome surfaces, one saturated raspberry accent, a grotesque
display face and softly rounded, gently elevated cards. Everything on screen is
grey except the accent, so the accent carries all the emphasis on its own. It should read as
**current and confident**: professional without the magazine costume, and
recognisably built for students rather than for a careers office.

*Chosen September 2026, replacing an earlier warm-editorial direction (warm
paper, Newsreader serif, evergreen accent) that read as too serious for the
audience. That direction is preserved as `[data-theme="editorial"]` in
`demo/css/themes.css`, along with three other candidates (Signal, Nightshift,
Grove), so the choice can be shown against what it replaced. Press `T` in the
demo to open the comparison panel, or link one with `?theme=signal`.*

### Inspirations (and what to borrow)
| App | What to borrow |
|---|---|
| **Hinge** | Prompt cards, the "Likes you" list, commenting on a specific part of a profile. |
| **Bumble BFF / Bizz** | Platonic and professional framing of swipe matching; clear "this isn't dating" tone. |
| **Read.cv / Posts.cv** | Profile as a clean, typographic resume; experiences laid out like a portfolio. |
| **Threads** | Minimal, text-first feed; thin dividers instead of heavy cards; quiet action icons. |
| **Airbnb** | Bottom sheets for filters and details; soft, confident rounded corners. |
| **Apple Messages / iMessage** | Familiar, uncluttered chat layout. |
| **Lunchclub** | The idea of the coffee chat as the goal of every match. |

### Color palette
No ASU maroon or gold. One accent, used sparingly for primary actions and key
moments. Every pair below meets WCAG AA (4.5:1) in the combinations the UI
actually uses.

| Token | Hex | Use |
|---|---|---|
| **Paper** | `#F2F2F1` | App background |
| **Surface** | `#FCFCFB` | Cards, sheets, input fields |
| **Ink** | `#171717` | Headlines, primary text, primary icons |
| **Ink Muted** | `#636363` | Secondary text, metadata, placeholder text |
| **Hairline** | `#E2E2E1` | Dividers, card borders |
| **Raspberry** (accent) | `#BE2853` | Primary buttons, active states, links, the "Connect" action |
| **Raspberry Soft** | `#FBE3EB` | Selected chips, tag backgrounds, highlighted cards |
| **Accent Ink** | `#FFFBFC` | Text on the accent |
| **Graphite** (secondary) | `#262626` | Rare emphasis only: the match moment, "Likes you" count |
| **Sand** | `#EAEAE8` | Subtle section backgrounds (Experience Translator, event strip) |
| **Error** | `#B3261E` | Errors and destructive actions |

**Rules**
- Ink Muted is `#636363` rather than a lighter grey because it has to clear AA on Sand, which now backs the inset data panels as well as section bands. Every theme holds the same invariant.
- About 90% of any screen is Paper, Surface and Ink. Raspberry appears only on what matters.
- Graphite is the spice, and it is deliberately neutral: the page has one accent and no competing second hue. It appears in at most one place per screen.
- No gradients or glows. Elevation is the one exception to the flatness rule, and it is deliberately faint: a card carries two wide, very low-alpha shadow layers (no tight contact layer, so there is no hard edge), and floating elements (swipe card, compose button) carry a slightly stronger version of the same pair. The shadow should read as the card sitting in light, never as an outline drawn underneath it. Two layers describe one light source; anything beyond that is decoration.
- The landing page mirrors these tokens and adds a dark set, where the accent lifts to `#EC5B86` to stay legible on a dark surface.

### Typography
| Role | Typeface | Size / weight | Notes |
|---|---|---|---|
| Display (names, big headings) | **Bricolage Grotesque** | 32 / Bold | Tight letter-spacing, -3% |
| Title (screen titles) | Bricolage Grotesque | 24 / Bold | |
| Prompt question | Bricolage Grotesque | 18 / Semibold | Carries its pull-quote role with weight, not italic |
| Body | **Geist** | 16 / Regular | Line height 1.5 |
| Label / button | Geist | 15 / Medium | |
| Meta (year, time, tags) | Geist | 13 / Regular, Ink Muted | |
| Overline (section labels) | Geist | 12 / Medium, uppercase, +6% tracking | E.g., "EXPERIENCES", "GOALS" |

Both fonts are free (Google Fonts). Use the display face only for names,
headings and prompt questions, never for body text or buttons.

Bricolage Grotesque has no true italic, so nothing in display type is
italicised: a synthesised slant on a grotesque reads as a rendering fault.
Where display type needs emphasis, it takes the accent colour instead. Body
copy set in Geist keeps real italics.

### Layout and shape
- **Spacing:** 8-point grid; 20px side margins; 24–32px between sections.
- **Corner radius:** surfaces are softly rounded, interactive controls are pills. 20px for swipe cards and sheets, 14px for content cards, 12px for inputs, 10px for panels inset inside a card, 18px for message bubbles, fully rounded (pill) for buttons, chips and the segmented control. A nested surface sits one step tighter than the surface holding it, so a panel inside a card reads as nested rather than as a second card.
- **Elevation over borders:** a card is separated from the page by light, not by a line — `--shadow-card`, with `--card-ring` transparent. Hairlines stay, but only *inside* a card, dividing its bands. The exception is Nightshift: a dark shadow on a dark page reads as nothing, so there `--card-ring` is visible and the lifted surface does the work.
- **Icons:** Thin, outline icon set (e.g., Phosphor "Light" or Lucide at 1.5px stroke). Active tab icons switch to filled.
- **Avatars:** Before a match, people appear as a **monogram tile**: initials in Bricolage Grotesque on a softly tinted square. The five tints are greys with a whisper of hue, so tiles vary without introducing a second accent. After matching, the real photo replaces it.

### Components
- **Primary button:** Raspberry pill, Accent Ink text, full width at the bottom of flows.
- **Secondary button:** Transparent with 1px Ink border.
- **Tertiary:** Text-only link in Raspberry.
- **Chips:** Pill, Hairline border; selected state fills Raspberry Soft with Raspberry text.
- **Card anatomy:** every card that describes a person uses the same three parts, so the deck card, the Likes cell and the full profile state things the same way.
  - *Identity band* (`.card-id`) — avatar at the left, name / role / status stacked beside it. Horizontal, because stacking under a centred avatar costs vertical space the fixed-height deck does not have.
  - *Data panel* (`.data-panel`) — grouped facts on their own Sand surface inset inside the card, small muted label above a larger dark value. Used for the Now/Dream pair everywhere it appears. Facts get a surface instead of floating under a rule; this is the single move that does the most for a dense card's readability.
  - *Bands divided by hairlines* — the prompt sits under a rule rather than being one more paragraph in the stack.
- **Action hierarchy:** one primary per surface. Everything else is a secondary outline, a quiet icon button or a plain text link. Never two buttons of equal weight.
- **Bottom sheets:** Surface, 20px top radius, small grab handle, dimmed background behind.
- **Toasts:** Ink background, Surface text, bottom of screen above the tab bar, auto-dismiss.

### Motion
- Swipe cards follow the finger and tilt slightly (max ~8°). A small word label fades in: **"Connect"** (Raspberry, right) or **"Pass"** (Ink Muted, left).
- Screens push and slide; sheets rise with a soft spring.
- The match moment is the only "celebration" animation: two tiles slide together and the photos fade in.
- Nothing bounces, sparkles or uses confetti.

### Tone of voice
Warm, direct and a little bit wise, like a helpful older student.
- ✅ "Who do you want to meet?" · "Nice. That's a real accomplishment." · "Grab coffee?"
- ❌ "Let's gooo! 🔥" · "Find your perfect match 💘" · "Crush your career!"
- Never use dating language: "Connect," not "Like." "Connection," not "Match" in most UI (the match moment can still say "It's a connection").

### Accessibility
- All text/background pairs meet WCAG AA contrast.
- Tap targets are at least 44×44.
- Swipe actions always have button equivalents.
- Photos in prompts need alt descriptions (entered by the user).

---

## 4. App Structure

### Navigation
A bottom tab bar with five tabs, always visible except during onboarding, full-screen flows and the match moment.

| Tab | Icon | Purpose |
|---|---|---|
| **Home** | Stacked cards | Swipe to connect; see who wants to connect with you |
| **Forum** | Speech bubbles | Community feed of posts, questions, opportunities, study groups and campus events |
| **Search** | Magnifying glass | Find people and posts |
| **Messages** | Paper plane | Conversations with connections and anyone you've reached out to |
| **Profile** | Monogram/photo | View and edit your profile; Experience Translator lives here |

Tab bar style: Surface background, 1px Hairline top border, labels under icons in 11px, active tab in Ink with filled icon, inactive in Ink Muted. A small Clay dot marks unread messages or new "Likes you."

### Screen map
```
Onboarding
 ├─ Welcome
 ├─ Sign in with ASU email → Verify code
 ├─ The basics (name, major, year)
 ├─ Titles (current + dream)
 ├─ Goals
 ├─ Bio
 ├─ Prompts (choose + answer 2)
 ├─ Photo (hidden until you connect)
 ├─ Try the Experience Translator (optional)
 ├─ Resume (optional)
 ├─ Deck preferences
 └─ You're in

Home
 ├─ Discover (swipe deck)
 │   ├─ Full profile (expanded card)
 │   ├─ Deck preferences (sheet)
 │   └─ Connection moment (full-screen popup)
 └─ Likes you (list) → Full profile

Forum
 ├─ Feed (with tag filters + campus events strip)
 ├─ Post detail (replies)
 ├─ Event detail (sheet)
 └─ New post (full-screen sheet)

Search
 ├─ Search home (recent + suggestions)
 ├─ Results: People | Posts
 └─ Person profile (Message · Connect · Posts)

Messages
 ├─ Inbox (new connections row + conversations)
 └─ Chat (with coffee-chat nudge card)

Profile
 ├─ My profile (Edit / Preview)
 ├─ Edit sections (basics, titles, goals, bio, prompts, resume)
 ├─ Experiences → Experience Translator flow
 ├─ My posts · Saved
 └─ Settings
```

---

## 5. How the App Works (Non-Technical Mechanics)

### Who can join
Only ASU students. Sign-in uses an ASU email address, verified with a one-time code. In the prototype, this is simulated.

### What others see
Before connecting, other students see a **professional profile with no photo**:
- Name
- Major
- Year (Freshman, Sophomore, Junior, Senior, Graduate)
- Current job title and/or dream job title
- Goals for using the app (e.g., Networking, Entrepreneurship, Career development, Finding a mentor, Being a mentor, Study partners, Finding co-founders)
- Bio (short blurb)
- One to three answered prompts (text or photo)
- Experiences written with the Experience Translator (if the student chose to show them)
- Resume (optional, if the student chose to share it)

The **profile photo is revealed only after a mutual connection.** Forum posts and search results show the monogram tile, not the photo, unless you're already connected.

### Matching (swiping)
- **Swipe right = Connect. Swipe left = Pass.** Buttons at the bottom of the card do the same thing.
- Swiping is **unlimited**. When there's no one left, an end-of-deck message appears.
- If both students choose Connect, it becomes a **connection**: photos are revealed and a chat opens.
- **Likes you:** Students can see a list of people who already chose Connect on them, and connect back or pass directly.
- The last Pass can be undone.

### Deck preferences (prioritize, don't exclude)
Instead of hard filters, students choose what to **prioritize** in their deck:
- **Major / field** (e.g., "Business, Computer Science")
- **Year** (e.g., "Upperclassmen" for mentorship)
- **Goals** (e.g., "Entrepreneurship")

They can drag these three into the order that matters most to them. The deck shows the closest matches first, then gradually mixes in others. Nobody is hidden completely. This keeps discovery open, which fits the cross-major networking mission.

### Coffee chats
There is no scheduling tool. When a new chat opens between two connections, the app shows a **"Grab coffee?" nudge card** with:
- A short line on why coffee chats work ("Most coffee chats take 20–30 minutes.")
- A few **conversation starters based on the other person's profile** (e.g., "Ask Maya about the robotics project she's most proud of").
- A button that fills in a friendly invite message for the student to edit and send.

The students arrange the time and place themselves in the chat.

### Messaging
- Anyone can message anyone they find through the **Forum or Search**, and connections can message each other.
- Conversations with connections show a small **"Connected"** label and the person's photo. Other conversations show the monogram tile.
- Basic safety: every chat and profile has an overflow menu with **Report** and **Block**.

### Forum
A single, chronological-leaning feed. Every post has **one type** and **optional tags**.

**Post types**
| Type | What it's for | Special elements |
|---|---|---|
| **Post** | General updates, wins, advice, photos | Optional photo |
| **Question** | Asking the community | Replies can be marked **Helpful**; the author can pin the best answer |
| **Opportunity** | Internships, club openings, research positions, co-founder searches | Role, organization, optional deadline; **"Interested"** button |
| **Study group** | Finding classmates | Class code (e.g., MAT 265), how often they'll meet; **"Join"** button with member count |

**Tags** can be class codes (CSE 205), majors, industries or topics (#internships, #resume, #startups). Tapping a tag filters the feed.

**Campus events** from ASU career resources (career fairs, resume workshops, employer info sessions) appear in a slim horizontal strip at the top of the feed and as an **Events** filter. Event details show which of your connections are interested, turning events into another way to meet up.

### Search
Searches **People** and **Posts**. People results can be narrowed by major, year and goals. Tapping a person opens their profile with **Message**, **Connect** and a **Posts** section.

### The Experience Translator (the core idea)
Students describe an experience in plain, casual words. The app turns it into **polished, resume-ready bullet points** and pulls out the **skills** it shows.

1. Pick a type: Job, Class project, Club / organization, Volunteering, Personal project, Other.
2. Add the basics: role, where, when.
3. Describe it casually ("I worked at the campus coffee shop, trained the new people, and figured out a faster way to handle the morning rush").
4. Tap **Translate**. The app returns 3–4 bullet points and skill chips.
5. Adjust with one tap: **Shorter**, **More detail**, **Emphasize leadership**, **Emphasize technical skills**. Every bullet can also be edited by hand.
6. Save. Choose whether it shows on the public profile. Bullets can be **copied** for a resume.

In the prototype, the translation is **pre-written demo output**, not a live AI.

**Guided prompts** support the same goal: each prompt includes a short hint and example so students know what a strong answer looks like.

---

## 6. Screen-by-Screen Design

Each screen below lists **purpose**, **layout (top to bottom)**, **interactions** and **notes**.

---

### 6.1 Onboarding

Onboarding is one question per screen, like Hinge. Every screen has:
- A thin progress bar at the top (Raspberry on Hairline).
- A back arrow at top left.
- A large Bricolage Grotesque question as the headline.
- The primary button pinned to the bottom ("Continue"), disabled until the step is complete.

#### O1. Welcome
- **Purpose:** First impression; set the tone.
- **Layout:** Paper background. Centered small wordmark ("[App Name]") at top. Large Bricolage Grotesque headline in the middle: **"Meet the people who'll shape your career."** One line of muted body text below: "A professional network, built by and for ASU students." Primary button: **"Continue with ASU email."** Tertiary link: "How it works."
- **Notes:** No illustrations or stock photos. A simple typographic moment. Optionally, a slow fade cycling through three sample prompt snippets beneath the headline.

#### O2. ASU email → Verify
- **Layout:** Headline "What's your ASU email?" · single input with "@asu.edu" suffix shown in muted text · Continue. Next screen: "Enter the code we sent" with six boxed digits.
- **Notes:** Prototype accepts any code.

#### O3. The basics
- **Layout:** Headline "Let's start with the basics." · Fields: First name, Last name, Major (search-as-you-type list), Year (five pill chips: Freshman, Sophomore, Junior, Senior, Graduate).

#### O4. Titles
- **Layout:** Headline "What do you do, and where are you headed?" · Two fields: **Current title** (placeholder "e.g., Barista, Research Assistant, Student") and **Dream title** (placeholder "e.g., Product Designer at a startup").
- **Notes:** Helper text: "Current title can be anything, even 'Student.' Every job counts."

#### O5. Goals
- **Layout:** Headline "What brings you here?" · Subtext "Pick up to three." · Wrap of large chips: Networking · Career development · Entrepreneurship · Finding a mentor · Being a mentor · Study partners · Finding co-founders · Exploring majors.
- **Interactions:** Selected chips fill Raspberry Soft with a small check.

#### O6. Bio
- **Layout:** Headline "Introduce yourself in a few lines." · Multi-line text box with a 250-character counter · A collapsible "Need inspiration?" link revealing two short example bios.

#### O7. Prompts
- **Layout:** Headline "Show them what you've done." · Two empty prompt slots ("Choose a prompt"), plus an optional third.
- **Interactions:** Tapping a slot opens the **Prompt Picker** (sheet): a list of prompts grouped as **Experience** and **Personality**. Choosing one opens the answer screen: prompt in Bricolage Grotesque Semibold at top, answer box (or photo picker for photo prompts), a small hint line (e.g., "Strong answers mention what you did and what changed because of it.").
- **Prompt library (sample):**
  - Experience: "My favorite career experience so far…" · "The project I'm most proud of…" · "My favorite internship taught me…" · "A photo that sums up my work experience" (photo) · "A problem I solved that nobody asked me to…" · "The class that changed how I think…"
  - Personality: "The best advice I've gotten…" · "You'll get along with me if…" · "My ideal coffee chat covers…" · "I'm currently learning…" · "Ask me about…"

#### O8. Photo
- **Layout:** Headline "Add a photo." · Subtext: "Your photo stays hidden until you both connect. People meet your work first." · Large rounded-square photo slot with a small lock icon badge · Continue / "Skip for now."

#### O9. Try the Experience Translator (optional)
- **Layout:** Sand-colored panel. Headline "Turn what you've done into words that work." · A tiny before/after preview: a casual sentence in muted italics → two crisp bullets in Ink. · Primary: "Try it with one experience" (opens the Translator flow, §6.5.3) · Tertiary: "Maybe later."
- **Notes:** This is a key presentation moment. It introduces the core problem and solution in five seconds.

#### O10. Resume (optional)
- **Layout:** Headline "Want to share your resume?" · Upload card (PDF) · Toggle: "Show on my profile" · Subtext: "You can change this anytime."

#### O11. Deck preferences
- Same content as the Deck Preferences sheet (§6.2.3), shown as a full screen. Headline: "Who do you want to meet first?"

#### O12. You're in
- **Layout:** Headline "You're all set, [First name]." · A small preview of the user's own card as others see it · Primary: "Start meeting people."
- **Notes:** Brief and calm. No confetti.

---

### 6.2 Home (Match)

#### 6.2.1 Discover — the swipe deck
- **Purpose:** Meet new people one at a time.
- **Layout (top to bottom):**
  1. **Header:** Wordmark at left; at right a **preferences icon** (sliders).
  2. **Segmented control:** "Discover" | "Likes you" with a small Clay count badge (e.g., "Likes you · 4").
  3. **The card** (fills most of the screen, Surface, 20px radius, soft shadow, second card peeking slightly behind it):
     - **Top block:** monogram tile (large, tinted), then **Name** in Bricolage Grotesque, then a meta line: *Junior · Supply Chain Management*.
     - **Titles:** "Now: Operations Intern, Local Startup" / "Dream: Head of Operations" (overline labels NOW / DREAM in muted caps).
     - **Goals:** 1–3 chips.
     - **Bio:** First two lines, fading out.
     - **First prompt preview:** prompt question in italic serif, answer in body text.
     - A subtle "Scroll for more" affordance at the bottom edge.
  4. **Action row** (below the card): circular **Pass** button (X, outline, Ink Muted) and a larger circular **Connect** button (Raspberry fill, handshake or check icon). A small undo arrow sits at the far left, enabled only after a Pass.
- **Interactions:**
  - Swipe right → "Connect" label fades in on the card; release to connect.
  - Swipe left → "Pass" label; release to pass.
  - Scroll inside the card (or tap it) to open the **Full profile**.
- **End of deck:** Bricolage Grotesque line "You've seen everyone for now." Muted subtext: "New students join every day. Meanwhile, see what's happening in the Forum." Secondary button: "Go to Forum."

#### 6.2.2 Full profile (shared view)
Used from the deck, Likes you, Search, Forum and Messages. The same layout keeps the app predictable.
- **Layout:** Scrollable page, Paper background, sections separated by generous space and overline labels:
  1. Header: monogram (or photo if connected), Name, Year · Major, Now / Dream titles.
  2. **GOALS:** chips.
  3. **ABOUT:** full bio.
  4. **PROMPTS:** each on its own Surface card; question in italic serif, answer below. Photo prompts show the image full width with rounded corners and a caption.
  5. **EXPERIENCES:** entries from the Translator: role, organization, dates, 2–4 bullets, skill chips. Styled like Read.cv: clean and typographic.
  6. **RESUME:** a small document card ("Resume · PDF · Updated Sep 2026"); tap to preview full screen.
  7. **POSTS:** their three most recent forum posts, with "See all."
- **Action bar (sticky bottom):**
  - From the deck or Likes you: **Pass** and **Connect**.
  - From Search, Forum or Messages: **Message** (secondary) and **Connect** (primary). If already connected, shows "Connected ✓" and **Message**.
- **Overflow menu (top right):** Report · Block.
- **Hinge-style detail:** Tapping a prompt or experience lets the student Connect *with a note about that item* (e.g., "Your supply chain project sounds great, how'd you get into it?"). The note becomes the first message if they connect.

#### 6.2.3 Deck preferences (bottom sheet)
- **Layout:** Title "Who do you want to meet first?" · Subtext "We'll show these people first, and still mix in others." · Three reorderable rows with drag handles, each with its current selection summarized:
  1. **Goals:** Entrepreneurship, Finding a mentor
  2. **Major / field:** Business, Design
  3. **Year:** Juniors, Seniors, Graduate
- Tapping a row opens chip choices for that category. Primary button: "Save."
- **Notes:** The ranking is the point. It visualizes "prioritize, don't exclude" in a single glance.

#### 6.2.4 Connection moment (full-screen popup)
- **Purpose:** The one emotional peak in the app.
- **Layout:** Paper background. Two rounded photo tiles slide toward each other and slightly overlap; photos fade in from monograms (**the photo reveal**). Headline in Bricolage Grotesque: **"You and Maya connected."** Subtext pulled from their overlap: "You're both into entrepreneurship." Primary: **"Say hi."** Tertiary: "Keep swiping."
- **Notes:** A thin Clay underline under the headline is the only accent. No confetti.

#### 6.2.5 Likes you
- **Layout:** Same header and segmented control. A two-column grid of compact cards: monogram, name, year · major, dream title, and one goal chip. Top line: "4 people want to connect with you."
- **Interactions:** Tap a card → Full profile with Pass / Connect. Connecting triggers the Connection moment.
- **Empty state:** "No one yet. Great prompts get noticed. Want to polish yours?" → link to Profile.

---

### 6.3 Forum

#### 6.3.1 Feed
- **Purpose:** Community conversation and discovery beyond one-on-one matching.
- **Layout (top to bottom):**
  1. **Header:** "Forum" in Bricolage Grotesque Title.
  2. **Filter row** (horizontal scroll of chips): All · Questions · Opportunities · Study groups · Events · then the user's followed tags (e.g., #CSE205, #startups).
  3. **Campus events strip** (Sand background band): overline "HAPPENING AT ASU," then horizontally scrolling compact event cards: date block (e.g., "SEP 29"), event name, place, "3 connections interested."
  4. **Posts**, separated by Hairline dividers (Threads-style, not boxed cards):
     - Monogram (or photo if connected) · **Name** · Year · Major · time ("2h")
     - **Type label** as a small uppercase tag for non-standard posts (QUESTION, OPPORTUNITY, STUDY GROUP)
     - Body text; optional photo (rounded 14px)
     - Tags in Raspberry text
     - Action row: Reply (count) · Helpful / Appreciate (count) · Save. All icons thin and muted.
  5. **Floating "New post" button:** Raspberry pill with a pencil icon and the word "Post," bottom right above the tab bar.
- **Type-specific post designs:**
  - **Question:** When answered, shows a small "✓ Answered" label and a preview of the pinned answer.
  - **Opportunity:** Contained in a Surface card with a Hairline border: role, organization, deadline ("Apply by Oct 10"), and an **"Interested"** button. Interested students are visible to the poster, who can message them.
  - **Study group:** Class code as a bold chip (MAT 265), "Meets weekly · Tempe library," member monograms stacked, **"Join"** button. Joining adds you to a group chat in Messages.

#### 6.3.2 Post detail
- **Layout:** Full post at top, then replies in a simple thread (one level of nesting). For Questions, the pinned **Best answer** sits first with a soft Raspberry Soft background. Reply composer fixed at bottom.
- **Interactions:** Tap any name/avatar → Full profile. Question authors can pin a reply via its overflow menu.

#### 6.3.3 Event detail (bottom sheet)
- **Layout:** Date block + event title (Bricolage Grotesque), host ("ASU Career Services"), time, location, a 2–3 line description. Row: "Maya, Jordan and 12 others are interested" with monograms. Buttons: **"I'm interested"** (primary) and "Add to calendar" (secondary).
- **Notes:** This is where the "ASU has resources" message is strongest. Events feel social, not like a bulletin board.

#### 6.3.4 New post (full-screen sheet)
- **Layout:** Top bar: "Cancel" at left, **"Post"** button at right. Below:
  1. **Type selector:** four chips (Post · Question · Opportunity · Study group).
  2. Text area with placeholder that changes per type (e.g., Question: "What do you want to ask?").
  3. Type-specific fields appear smoothly below the text:
     - Opportunity: Role, Organization, Deadline (optional)
     - Study group: Class code, How often, Where
  4. **Add photo** and **Add tags** (tags suggest class codes and topics as you type).
- **Notes:** Keep it one screen. No nested menus.

---

### 6.4 Search

#### 6.4.1 Search home
- **Layout:** Large rounded search field at top ("Search people and posts"). Below, when empty:
  - **RECENT:** last few searches with clear (×) buttons.
  - **SUGGESTED TAGS:** chips like #internships, #CSE205, #startups.
  - **PEOPLE IN YOUR MAJOR:** short horizontal row of monogram cards.

#### 6.4.2 Results
- **Layout:** Segmented control **People | Posts** under the search field.
- **People:** Filter chips row (Major · Year · Goals, each opening a small sheet). Result rows: monogram, **Name**, "Now/Dream" title on one line, year · major in muted text, and a quiet "Connected" label where relevant. Tap → Full profile (with Message, Connect, Posts).
- **Posts:** Same post styling as the Forum feed, with search terms subtly highlighted in Raspberry Soft.
- **Empty state:** "No results for 'xyz'. Try a class code or a major."

---

### 6.5 Messages

#### 6.5.1 Inbox
- **Layout:**
  1. Header "Messages."
  2. **NEW CONNECTIONS:** horizontal row of circular photos (connections are unlocked, so photos show) with first names. These are people you've connected with but not yet messaged, like Hinge's "Your turn."
  3. **Conversations list:** photo/monogram, **Name**, last message preview (one line, muted), time. A small **"Connected"** tag for connections. Unread conversations show the name in Medium weight and a Clay dot.
  4. Study group chats appear here too, with stacked avatars and the class code as the title.
- **Empty state:** "No messages yet. Connect with someone or reply to a post to get talking."

#### 6.5.2 Chat
- **Layout:** Header with back arrow, photo/monogram, name, and "Junior · Supply Chain" in muted text. Tap the header → Full profile. Overflow → Report / Block.
- **Messages:** Outgoing bubbles in Raspberry with Surface text; incoming bubbles in Surface with a Hairline border. Rounded 14px, grouped by time.
- **Composer:** Rounded input with photo icon and send arrow.

#### 6.5.3 Coffee-chat nudge card (inside a new connection's chat)
- **When:** At the top of the chat, before either person has sent more than a couple of messages.
- **Layout:** Sand card, 14px radius:
  - Small coffee-cup icon + Bricolage Grotesque line **"Grab coffee?"**
  - Muted text: "Most coffee chats take 20–30 minutes. Pick a spot on campus that works for both of you."
  - **CONVERSATION STARTERS:** 2–3 tappable suggestions based on their profile, e.g., "Ask about the robotics project she's most proud of" · "You both want to start a company. Compare notes."
  - Button: **"Suggest a coffee chat,"** which fills the composer with an editable message: "Hey Maya! Would you want to grab coffee on campus sometime this week?"
- **Interactions:** Tapping a starter fills the composer. The card can be dismissed with an ×.

---

### 6.6 Profile

#### 6.6.1 My profile
- **Layout:**
  1. **Header:** photo (with a small lock and label: "Visible to connections only"), Name, Year · Major, Now / Dream titles.
  2. **Toggle:** **Edit | Preview.** Preview shows exactly what others see on the swipe card and Full profile, which reassures students about anonymity.
  3. **Profile strength line:** a slim bar and one suggestion, e.g., "Add one experience to help people understand what you've done." (Encouraging, not a score.)
  4. Sections, each with an "Edit" link: **GOALS · ABOUT · PROMPTS · EXPERIENCES · RESUME**.
  5. **EXPERIENCES** section has a prominent **"+ Add experience"** row with a small subtext: "We'll help you put it into words."
  6. **MY ACTIVITY:** "My posts" and "Saved" rows.
  7. Settings gear at top right.

#### 6.6.2 Edit screens
Each section edits on its own clean screen, reusing the onboarding designs (e.g., the Goals chip picker, the Prompt picker). Saving returns to My profile with a toast: "Saved."

#### 6.6.3 Experience Translator flow
A focused, full-screen flow with a Sand background to set it apart.

1. **Type:** Headline "What kind of experience is it?" · large tappable rows with icons: Job · Class project · Club or organization · Volunteering · Personal project · Other.
2. **Basics:** Role/title, Organization or class, Start and end (month + year, or "Current").
3. **Describe it:** Headline "Tell us what you did, in your own words." · large text box · rotating hint below: "What did you do day to day? What are you proud of? Did anything get better because of you?" · a small example link.
4. **Translating (brief loading state):** Bricolage Grotesque line "Finding the right words…" with a thin progress line. About 1.5 seconds.
5. **Results:**
   - Overline: **YOUR EXPERIENCE, TRANSLATED**
   - 3–4 bullet points on a Surface card, each editable by tapping. Example for a campus coffee-shop job:
     - "Trained and onboarded 6 new team members on drink preparation, customer service standards and store procedures."
     - "Redesigned the morning-rush workflow, reducing average wait times during peak hours."
     - "Served 200+ customers per shift in a fast-paced environment while keeping quality and accuracy high."
   - **SKILLS SHOWN:** chips (Training & onboarding · Process improvement · Customer service · Working under pressure).
   - **Refine row:** chips "Shorter" · "More detail" · "Emphasize leadership" · "Emphasize technical skills." Tapping one swaps the bullets with a gentle crossfade.
   - Small "Your words" collapsible section to compare with the original description.
6. **Save:** Toggle "Show on my profile" (on by default) · secondary "Copy bullets" (toast: "Copied, ready for your resume") · primary "Save experience."
- **Notes:** This flow is the heart of the pitch. It should feel like the before/after moment of a great editing tool. The difference between the casual input and the polished output should be obvious at a glance.

#### 6.6.4 Settings
Simple grouped list: Account (ASU email) · Notifications · Deck preferences · Resume visibility · Blocked users · Community guidelines · Log out.

---

## 7. Popups, Sheets and Toasts (Summary)

| Element | Type | Trigger |
|---|---|---|
| Connection moment | Full-screen popup | Mutual Connect |
| Deck preferences | Bottom sheet | Sliders icon on Home |
| Prompt picker | Bottom sheet | Choosing a prompt |
| Connect with a note | Small sheet | Tapping a prompt/experience on a profile |
| Event detail | Bottom sheet | Tapping an event |
| Filter pickers (Major/Year/Goals) | Bottom sheet | Search filter chips |
| Resume preview | Full-screen viewer | Tapping a resume card |
| Report / Block | Action sheet | Overflow menu on a profile or chat |
| "Saved," "Copied," "Undo pass" | Toast | After those actions |

---

## 8. Sample Demo Content

Use realistic, varied students so the demo feels alive. Suggested personas:

| Name | Year · Major | Now → Dream | Goals | Sample prompt |
|---|---|---|---|---|
| **Maya Chen** | Junior · Mechanical Engineering | Robotics Club Lead → Robotics Engineer | Networking, Finding co-founders | "The project I'm most proud of…" a line-following robot the club took to a regional competition |
| **Jordan Reyes** | Senior · Supply Chain Management | Operations Intern → Head of Operations | Being a mentor, Career development | "My favorite internship taught me…" to ask "why" before optimizing anything |
| **Aaliyah Brooks** | Sophomore · Graphic Design | Freelance Designer → Product Designer | Entrepreneurship, Networking | "A photo that sums up my work experience" (desk with sketches) |
| **Sam Patel** | Freshman · Computer Science | Student → Software Engineer | Finding a mentor, Study partners | "I'm currently learning…" how to build my first app |
| **Diego Morales** | Graduate · Public Policy | Research Assistant → Policy Analyst | Networking, Career development | "Ask me about…" how I turned a class paper into a research job |

Sample forum posts: a Question about resume tips for a first internship; an Opportunity for a startup looking for a design co-founder; a Study group for CSE 205; a Post celebrating a first internship offer; an event: "Career Fair Prep Workshop · Sep 29."

---

## 9. Suggested Demo Walkthrough (for the presentation)

A 3–4 minute path that tells the story:

1. **Onboarding highlights** (O1 → O5 → O7 → O9): show the calm welcome, pick goals, answer a prompt, try the Experience Translator with the coffee-shop example. *Message: "Every experience counts; we help you say it well."*
2. **Home:** swipe through two cards, open one Full profile to show prompts and experiences, then Connect with Maya → **Connection moment** with photo reveal. *Message: "Substance first."*
3. **Messages:** open the new chat, tap a conversation starter, then "Suggest a coffee chat." *Message: "Every match leads to a real conversation."*
4. **Forum:** scroll the feed, open the Career Fair Prep event showing connections interested, show a study group and an opportunity. *Message: "ASU's resources, where students already are."*
5. **Search:** search "CSE 205" to find classmates and posts.
6. **Profile:** toggle Preview to show what others see, and show the saved experience with polished bullets.

---

## 10. Prototype Scope Notes

- **Simulated:** ASU sign-in and code verification, matching logic, "Likes you" list, messages (pre-scripted replies), Experience Translator output (pre-written), event data, search results.
- **Clickable only:** the main walkthrough path above should be fully tappable; secondary screens can be static.
- **Out of scope:** real accounts, notifications, moderation tools, live AI, calendar integration.
- **Possible future ideas** (mention verbally, not in the prototype): "We met" follow-ups after coffee chats, integration with ASU Handshake or the career center, mentor programs pairing upperclassmen with freshmen, optional dark mode using the same palette inverted (Ink background, Paper text, lighter Raspberry accent (#EC5B86, as the landing page already defines)).
