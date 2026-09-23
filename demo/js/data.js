/* Demo content. Personas follow app-design-document.md §8. Everything is simulated. */
window.DATA = {
  me: {
    id: "me", first: "Alex", last: "Rivera", year: "Sophomore", major: "Business (Entrepreneurship)",
    now: "Barista, Campus Coffee Co.", dream: "Startup founder",
    goals: ["Entrepreneurship", "Finding a mentor", "Networking"],
    bio: "Business sophomore who runs on espresso and side projects. I want to start something that makes campus life easier, and I'm looking for people who build.",
    prompts: [
      { q: "I'm currently learning…", a: "How to talk to customers before building anything. Turns out the coffee line is great research." }
    ],
    experiences: [],
    resume: true,
    photo: "img/me.jpg", tint: 2,
  },

  people: {
    maya: {
      first: "Maya", last: "Chen", year: "Junior", major: "Mechanical Engineering",
      now: "Robotics Club Lead", dream: "Robotics Engineer",
      goals: ["Entrepreneurship", "Finding co-founders", "Networking"],
      bio: "I like building things that move. Currently leading a 14-person robotics team and looking for people who want to start something.",
      prompts: [
        { q: "The project I'm most proud of…", a: "A line-following robot our club took to a regional competition. We rebuilt the sensor array the night before." },
        { q: "My ideal coffee chat covers…", a: "What you'd build if you had one free semester. Bonus points for sketches on napkins." },
      ],
      experiences: [
        { role: "Robotics Club Lead", org: "Sun Devil Robotics", dates: "2025 – Now", bullets: ["Lead a 14-person team through design, build and competition cycles.", "Redesigned the sensor array, improving line-tracking accuracy by 30%."], skills: ["Leadership", "CAD", "Embedded systems"] },
      ],
      starters: [
        { label: "Ask about the robot that made it to regionals", text: "Your line-following robot sounds awesome. How did you rebuild the sensor array the night before?" },
        { label: "You both want to start a company. Compare notes.", text: "Looks like we're both into entrepreneurship. What would you build if you had one free semester?" },
      ],
      classes: ["MAE 214"], resume: true, photo: "img/maya.jpg", tint: 1,
      mutual: true, // already chose Connect on you — connecting creates a connection
    },
    jordan: {
      first: "Jordan", last: "Reyes", year: "Senior", major: "Supply Chain Management",
      now: "Operations Intern, Local Startup", dream: "Head of Operations",
      goals: ["Being a mentor", "Career development"],
      bio: "Ops nerd. I like making messy systems calm. Happy to talk internships, recruiting, or how to survive a 7am supply-chain lab.",
      prompts: [{ q: "My favorite internship taught me…", a: "To ask “why” before optimizing anything. Half the time the fix is removing a step." }],
      experiences: [{ role: "Operations Intern", org: "Local Startup", dates: "Summer 2026", bullets: ["Mapped order fulfillment end to end and cut two redundant handoffs.", "Built a weekly inventory dashboard used by the founding team."], skills: ["Process mapping", "Excel", "Stakeholder communication"] }],
      classes: ["CSE 205", "SCM 300"], resume: true, tint: 3, likesYou: true,
    },
    aaliyah: {
      first: "Aaliyah", last: "Brooks", year: "Sophomore", major: "Graphic Design",
      now: "Freelance Designer", dream: "Product Designer",
      goals: ["Entrepreneurship", "Networking"],
      bio: "I design brands for small businesses around Tempe and want to move into product. Always down to trade design feedback for code help.",
      prompts: [{ q: "A photo that sums up my work experience", a: "My desk during finals: three sketchbooks, one laptop, zero clean mugs.", photo: true }],
      experiences: [{ role: "Freelance Designer", org: "Self-employed", dates: "2024 – Now", bullets: ["Delivered brand identities for 9 local businesses.", "Managed client timelines, feedback rounds and invoicing."], skills: ["Branding", "Figma", "Client management"] }],
      classes: ["GRA 213"], resume: false, tint: 2, likesYou: true,
    },
    sam: {
      first: "Sam", last: "Patel", year: "Freshman", major: "Computer Science",
      now: "Student", dream: "Software Engineer",
      goals: ["Finding a mentor", "Study partners"],
      bio: "First-year CS. I learn best by building. Looking for someone a few years ahead who can tell me what actually matters.",
      prompts: [{ q: "I'm currently learning…", a: "How to build my first app: a dining hall menu tracker for my floor." }],
      experiences: [],
      classes: ["CSE 205", "MAT 265"], resume: false, tint: 5, likesYou: true,
    },
    diego: {
      first: "Diego", last: "Morales", year: "Graduate", major: "Public Policy",
      now: "Research Assistant", dream: "Policy Analyst",
      goals: ["Networking", "Career development"],
      bio: "MPP student researching housing affordability in Phoenix. I love helping undergrads find research roles.",
      prompts: [{ q: "Ask me about…", a: "How I turned a class paper into a research job. It started with one question after lecture." }],
      experiences: [{ role: "Research Assistant", org: "Morrison Institute", dates: "2025 – Now", bullets: ["Analyze county housing data to support policy briefs.", "Co-authored a brief cited in a city council session."], skills: ["Policy analysis", "R", "Writing"] }],
      classes: ["PAF 501"], resume: true, tint: 4, likesYou: true,
    },
    leah: {
      first: "Leah", last: "Nguyen", year: "Sophomore", major: "Software Engineering",
      now: "Web Dev Intern, ASU EdPlus", dream: "Frontend Engineer",
      goals: ["Study partners", "Networking"],
      bio: "Frontend person. I care about making software that feels calm. Currently obsessed with accessibility.",
      prompts: [{ q: "You'll get along with me if…", a: "You have opinions about fonts. Strong ones." }],
      experiences: [], classes: ["CSE 205"], resume: true, tint: 1,
    },
    priya: {
      first: "Priya", last: "Raman", year: "Sophomore", major: "Computer Science",
      now: "Teaching Assistant, CSE 110", dream: "Machine Learning Engineer",
      goals: ["Study partners", "Networking"],
      bio: "TA by day, Kaggle by night. I explain things to freshmen for a living, so ask me anything about intro CS.",
      prompts: [{ q: "A problem I solved that nobody asked me to…", a: "Wrote a script that auto-groups CSE 110 lab partners by schedule. The professor now uses it every semester." }],
      experiences: [{ role: "Teaching Assistant", org: "ASU School of Computing", dates: "2025 – Now", bullets: ["Run weekly labs for 40 intro CS students.", "Built a partner-matching script adopted by the course staff."], skills: ["Python", "Teaching", "Automation"] }],
      classes: ["CSE 205", "CSE 110"], resume: true, tint: 3,
    },
    marcus: {
      first: "Marcus", last: "King", year: "Freshman", major: "Data Science",
      now: "Student", dream: "Sports Analyst",
      goals: ["Finding a mentor", "Exploring majors"],
      bio: "I got into data through fantasy football and never looked back. Figuring out if data science or stats is the right fit.",
      prompts: [{ q: "The class that changed how I think…", a: "AP Stats. Realizing every sports argument is really a sample-size argument." }],
      experiences: [], classes: ["CSE 205"], resume: false, tint: 4,
    },
    nora: {
      first: "Nora", last: "Whitfield", year: "Junior", major: "Marketing",
      now: "Social Media Intern, Sun Devil Athletics", dream: "Brand Strategist",
      goals: ["Networking", "Entrepreneurship"],
      bio: "I run the Instagram you probably scrolled past this morning. Interested in how small brands grow on campus.",
      prompts: [{ q: "My favorite career experience so far…", a: "Planning a game-day campaign that doubled student section attendance for a Tuesday volleyball match." }],
      experiences: [{ role: "Social Media Intern", org: "Sun Devil Athletics", dates: "2025 – Now", bullets: ["Plan and publish content for 120K+ followers.", "Grew student engagement 40% in one semester."], skills: ["Content strategy", "Analytics", "Copywriting"] }],
      classes: ["MKT 300"], resume: true, tint: 2,
    },
    ethan: {
      first: "Ethan", last: "Okafor", year: "Senior", major: "Finance",
      now: "President, Sun Devil Investment Club", dream: "Venture Capital Associate",
      goals: ["Being a mentor", "Finding co-founders"],
      bio: "I've pitched 30+ student startups to judges and lost a few too. Happy to review decks and talk recruiting for finance.",
      prompts: [{ q: "The best advice I've gotten…", a: "“Your network is the people you've helped, not the people you've met.”" }],
      experiences: [], classes: ["FIN 302"], resume: true, tint: 5,
    },
  },

  deck: ["nora", "priya", "maya", "ethan", "marcus"],
  likesYou: ["aaliyah", "sam", "diego", "jordan"],
  connected: ["leah"],

  goalsAll: ["Networking", "Career development", "Entrepreneurship", "Finding a mentor", "Being a mentor", "Study partners", "Finding co-founders", "Exploring majors"],
  goalPhrase: {
    "Entrepreneurship": "You're both into entrepreneurship.",
    "Networking": "You both want to grow your network.",
    "Finding co-founders": "You're both looking for co-founders.",
    "Study partners": "You're both looking for study partners.",
    "Career development": "You're both focused on career development.",
    "Finding a mentor": "You're both looking for mentors.",
    "Being a mentor": "You both like to mentor.",
    "Exploring majors": "You're both exploring majors.",
  },
  majors: ["Business", "Computer Science", "Design", "Engineering", "Data Science", "Marketing", "Finance", "Public Policy", "Supply Chain"],
  years: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"],

  promptLibrary: {
    Experience: ["My favorite career experience so far…", "The project I'm most proud of…", "My favorite internship taught me…", "A problem I solved that nobody asked me to…", "The class that changed how I think…"],
    Personality: ["The best advice I've gotten…", "You'll get along with me if…", "My ideal coffee chat covers…", "I'm currently learning…", "Ask me about…"],
  },

  events: [
    { id: "e1", mon: "SEP", day: "29", title: "Career Fair Prep Workshop", host: "ASU Career Services", time: "Tue, Sep 29 · 2:00–3:30 PM", place: "Memorial Union, Room 202", desc: "Practice your 30-second pitch, get your resume reviewed, and learn how to follow up with recruiters after the fair.", interested: ["maya", "leah", "priya"], others: 12 },
    { id: "e2", mon: "OCT", day: "2", title: "Employer Info Session: Intel", host: "Fulton Career Center", time: "Fri, Oct 2 · 5:00–6:00 PM", place: "Student Pavilion", desc: "Meet engineers and recruiters from Intel's Chandler site. Internship and co-op roles for all majors.", interested: ["priya"], others: 30 },
    { id: "e3", mon: "OCT", day: "6", title: "Resume Review Drop-ins", host: "ASU Career Services", time: "Tue, Oct 6 · 10 AM–2 PM", place: "Hayden Library, 1st floor", desc: "Bring a printed or digital resume. Fifteen-minute reviews with career coaches, no appointment needed.", interested: [], others: 8 },
  ],

  posts: [
    { id: "p1", type: "question", author: "sam", time: "2h", body: "Any resume tips for a first internship when you don't have work experience yet?", tags: ["#resume", "#internships"], replies: 12, helpful: 8,
      thread: [
        { author: "jordan", body: "Put projects and campus roles front and center. Class projects count if you describe what you did and what changed because of it.", helpful: 14, pinned: true },
        { author: "priya", body: "Seconding Jordan. Also: one page, and put your GitHub link at the top.", helpful: 6 },
        { author: "leah", body: "Career Services does drop-in reviews on Oct 6. They caught three typos on mine.", helpful: 4 },
      ] },
    { id: "p2", type: "opportunity", author: "aaliyah", time: "5h", body: "We're two designers building a study-planning tool for ASU students. Looking for a technical co-founder who wants to ship something real this semester.", role: "Technical co-founder", org: "Early-stage edtech startup", deadline: "Apply by Oct 10", tags: ["#startups", "#cofounder"], replies: 3, helpful: 14, interestedCount: 5 },
    { id: "p3", type: "study", author: "jordan", time: "1d", body: "Object-Oriented Programming & Data Structures midterm sprint. We'll work through old exams together.", classCode: "CSE 205", cadence: "Meets weekly · Tempe library", members: ["jordan", "priya", "sam", "marcus"], tags: ["#CSE205"], replies: 2, helpful: 5 },
    { id: "p4", type: "post", author: "priya", time: "1d", body: "Just accepted my first internship offer: data engineering at a Phoenix fintech this summer! Huge thanks to everyone who did mock interviews with me.", tags: ["#internships"], replies: 21, helpful: 64 },
    { id: "p5", type: "post", author: "diego", time: "2d", body: "Tip: professors' office hours are the most underrated networking on campus. My research job started with one question after class.", tags: ["#research", "#advice"], replies: 7, helpful: 31 },
    { id: "p6", type: "opportunity", author: "ethan", time: "3d", body: "Sun Devil Investment Club is recruiting first- and second-year analysts. No finance background needed; we'll teach you.", role: "Junior Analyst", org: "Sun Devil Investment Club", deadline: "Apply by Oct 3", tags: ["#finance", "#clubs"], replies: 4, helpful: 9, interestedCount: 11 },
  ],

  threads: {
    leah: { with: "leah", messages: [
      { from: "leah", text: "Are you going to the career fair prep workshop on the 29th?", at: "Yesterday" },
      { from: "me", text: "Thinking about it. Are you?" },
      { from: "leah", text: "Yeah! Let's go together. I need a second pair of eyes on my resume." },
    ] },
    diego: { with: "diego", messages: [
      { from: "diego", text: "Hey Alex, saw your comment on the research post. Happy to share how I found my RA position if it's useful.", at: "Mon" },
    ] },
  },

  replies: {
    maya: ["Yes! I'd love that. Thursday after 2 work for you?", "Perfect. The coffee spot in the Engineering Center? See you then."],
    leah: ["Deal. Meet outside the MU at 1:45?"],
    diego: ["Great. Want to grab coffee next week? I'm free Tuesday morning."],
    group_p3: ["Priya: I'll bring the practice exams from last spring.", "Jordan: Welcome! We're in Hayden, 3rd floor, Wednesdays at 6."],
    default: ["Sounds good!"],
  },

  translator: {
    types: [
      { id: "job", label: "Job", icon: "briefcase" },
      { id: "class", label: "Class project", icon: "book-open" },
      { id: "club", label: "Club or organization", icon: "users" },
      { id: "volunteer", label: "Volunteering", icon: "hand-heart" },
      { id: "personal", label: "Personal project", icon: "lightbulb" },
      { id: "other", label: "Other", icon: "sparkle" },
    ],
    example: "I worked at the campus coffee shop, trained the new people, and figured out a faster way to handle the morning rush.",
    hints: ["What did you do day to day?", "What are you proud of?", "Did anything get better because of you?"],
    skills: ["Training & onboarding", "Process improvement", "Customer service", "Working under pressure"],
    variants: {
      base: [
        "Trained and onboarded 6 new team members on drink preparation, customer service standards and store procedures.",
        "Redesigned the morning-rush workflow, reducing average wait times during peak hours.",
        "Served 200+ customers per shift in a fast-paced environment while keeping quality and accuracy high.",
      ],
      shorter: [
        "Trained 6 new team members.",
        "Redesigned peak-hour workflow to cut wait times.",
        "Served 200+ customers per shift.",
      ],
      detail: [
        "Trained and onboarded 6 new team members on drink preparation, point-of-sale systems, customer service standards and opening/closing procedures.",
        "Identified bottlenecks in the morning rush and redesigned station assignments and order flow, reducing average wait times during peak hours.",
        "Served 200+ customers per shift in a fast-paced environment while maintaining quality, accuracy and a friendly experience.",
        "Handled cash and card transactions and reconciled the register at close with zero discrepancies.",
      ],
      leadership: [
        "Led onboarding for 6 new hires, creating a training checklist the team still uses.",
        "Took initiative to redesign the morning-rush workflow and coached teammates through the change, reducing wait times.",
        "Stepped in as shift lead during peak hours, coordinating a team of 4 while serving 200+ customers.",
      ],
      technical: [
        "Trained 6 new team members on the point-of-sale system, order-routing and inventory procedures.",
        "Analyzed peak-hour order data and restructured station workflow, reducing average wait times.",
        "Tracked daily inventory and supply usage to reduce waste and prevent stock-outs.",
      ],
    },
  },
};
