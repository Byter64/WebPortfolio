export type Lang = 'en' | 'de';
export type Copy = Record<Lang, string>;
export const text = (en: string, de: string): Copy => ({ en, de });
export const languages: Lang[] = ['en', 'de'];

export interface Project {
  slug: string; title: string; number: string; image: string; year: string;
  team: Copy; duration: Copy; tags: string[]; summary: Copy; contribution: Copy;
  problem: Copy; implementation: Copy; outcome: Copy; reflection: Copy;
  images: string[]; links: { label: Copy; url: string }[]; video?: string;
}

export const projects: Project[] = [
  {
    slug: 'wuehans', title: 'WUEHANS', number: '01', image: 'console', year: '2024–25',
    team: text('3 people', '3 Personen'), duration: text('Sep 2024 — Jul 2025', 'Sep. 2024 — Juli 2025'),
    tags: ['FPGA', 'Project leadership', 'Hardware × Games'],
    summary: text('A console built from the inside out. Custom graphics, custom audio, real games.', 'Eine Konsole von innen heraus entwickelt. Eigene Grafik, eigenes Audio, echte Spiele.'),
    contribution: text('Project lead · GPU · most of the APU · core architecture decisions', 'Projektleitung · GPU · große Teile der APU · zentrale Architekturentscheidungen'),
    problem: text('Build an FPGA-based video game console that a small team can finish, and that other people can actually make games for.', 'Eine FPGA-basierte Spielkonsole entwickeln, die ein kleines Team fertigstellen kann und für die andere tatsächlich Spiele entwickeln können.'),
    implementation: text('I led the project, coordinated the required features and timeline, developed the GPU and most of the APU, and helped make key architecture decisions. The console uses a VexRiscV-based CPU. Its GPU supports sprite scaling, flipping and colour tables; its APU has eight independent audio channels.', 'Ich leitete das Projekt, koordinierte benötigte Funktionen und Zeitplan, entwickelte die GPU und große Teile der APU und übernahm zentrale Architekturentscheidungen. Die Konsole nutzt eine VexRiscV-basierte CPU. Die GPU unterstützt Sprite-Skalierung, Spiegelung und Farbtabellen; die APU besitzt acht unabhängige Audiokanäle.'),
    outcome: text('Four games were made for the console, mostly during a small game jam we hosted: Hans Tennis, Hans Tower Defence, Hans The Gatherer and Cow Shooter. A software template with a small engine and a PC backend helped participants start making games.', 'Für die Konsole entstanden vier Spiele, überwiegend bei einem von uns veranstalteten kleinen Game Jam: Hans Tennis, Hans Tower Defence, Hans The Gatherer und Cow Shooter. Ein Software-Template mit kleiner Engine und PC-Backend erleichterte den Einstieg.'),
    reflection: text('Design lens: the development tools are part of the platform experience. The PC backend and template connect the hardware architecture to a practical game-making workflow.', 'Designperspektive: Die Entwicklungswerkzeuge gehören zur Plattform-Erfahrung. PC-Backend und Template verbinden die Hardwarearchitektur mit einem praktisch nutzbaren Entwicklungsablauf.'),
    images: ['architecture', 'gpu', 'apu', 'tennis', 'tower', 'gatherer', 'cow'],
    links: [{ label: text('Source code', 'Quellcode'), url: 'https://github.com/Byter64/wueHans' }, { label: text('Project wiki', 'Projekt-Wiki'), url: 'https://github.com/Byter64/wueHans/wiki' }], video: 'huyaFkeakHw',
  },
  {
    slug: 'tony-blob', title: 'Tony Blob’s Pro Bouncer', number: '02', image: 'tony', year: '2023',
    team: text('2 people', '2 Personen'), duration: text('2 weeks', '2 Wochen'), tags: ['Unity / C#', 'Game feel', 'Game jam'],
    summary: text('A bouncing sandbox about speed, precision and choosing what to do next.', 'Eine Bounce-Sandbox über Tempo, Präzision und die Entscheidung, was als Nächstes kommt.'),
    contribution: text('Player movement · bounce mode · game design', 'Player Movement · Bounce-Modus · Game Design'),
    problem: text('Give players more challenges than they can complete before the tasks change after a minute. Movement needs to support both fast traversal and precise interaction.', 'Mehr Herausforderungen anbieten, als vor dem Aufgabenwechsel nach einer Minute lösbar sind. Die Bewegung muss schnelle Fortbewegung und präzise Interaktion ermöglichen.'),
    implementation: text('I designed a bounce mode in which the player behaves like a rubber ball. Timing the mode allows players to build vertical speed. Cannons and rubber slopes offer additional ways to cross the sandbox quickly.', 'Ich entwickelte einen Bounce-Modus, in dem sich die Figur wie ein Gummiball verhält. Durch passendes Timing lässt sich vertikale Geschwindigkeit aufbauen. Kanonen und Gummischrägen bieten weitere Wege, die Sandbox schnell zu durchqueren.'),
    outcome: text('A two-person game jam project made in two weeks for the theme “Change”, with a downloadable Windows build and gameplay footage.', 'Ein in zwei Wochen entstandenes Game-Jam-Projekt von zwei Personen zum Thema „Change“, mit herunterladbarem Windows-Build und Gameplay-Video.'),
    reflection: text('Design lens: one movement system can create contrasting rhythms. Here, precise navigation and momentum-driven travel support the same sandbox of changing tasks.', 'Designperspektive: Ein Bewegungssystem kann gegensätzliche Rhythmen erzeugen. Hier unterstützen präzises Navigieren und schwungvolle Fortbewegung dieselbe Sandbox mit wechselnden Aufgaben.'),
    images: ['tony-title', 'tony-movement'], links: [{ label: text('Download on itch.io', 'Download auf itch.io'), url: 'https://miggli.itch.io/tony-blobs-pro-bouncer' }], video: 'PJgUzdxnO3s',
  },
  {
    slug: 'batective-mitzi', title: 'Batective Mitzi', number: '03', image: 'mitzi', year: '2025–26',
    team: text('3 people', '3 Personen'), duration: text('3 weeks', '3 Wochen'), tags: ['Unity / C#', 'Character controller', 'Teamwork'],
    summary: text('A small bat, a missing scarf, and a barn full of ways to move.', 'Eine kleine Fledermaus, ein verschwundener Schal und eine Scheune voller Bewegungsmöglichkeiten.'),
    contribution: text('Character controller · dialogue supervision · talking sounds', 'Character Controller · Betreuung des Dialogsystems · Gesprächssounds'),
    problem: text('Create a character that feels good to control and interacts naturally with a barn environment while investigating a missing scarf.', 'Eine Figur entwickeln, die sich gut steuert und beim Ermitteln nach einem verschwundenen Schal mit ihrer Scheunen-Umgebung interagiert.'),
    implementation: text('I focused on a controller that can walk, climb, glide and take control of other animals. I also supervised a teammate’s custom dialogue parser through code reviews and architecture discussions, and implemented sample-based talking sounds inspired by Animal Crossing.', 'Mein Schwerpunkt war ein Controller zum Laufen, Klettern, Gleiten und Übernehmen anderer Tiere. Außerdem betreute ich den eigenen Dialogparser eines Teammitglieds mit Code-Reviews und Architekturgesprächen und implementierte von Animal Crossing inspirierte, samplebasierte Gesprächssounds.'),
    outcome: text('A three-week university semester project by three people, available to play in the browser.', 'Ein dreiwöchiges Semesterprojekt von drei Personen, das im Browser spielbar ist.'),
    reflection: text('Design lens: character movement, environmental affordances and dialogue feedback work together to give a small protagonist a distinct presence.', 'Designperspektive: Bewegung, Interaktionsmöglichkeiten der Umgebung und Dialog-Feedback geben einer kleinen Hauptfigur gemeinsam einen eigenen Charakter.'),
    images: ['mitzi-world'], links: [{ label: text('Play in browser', 'Im Browser spielen'), url: 'https://byter64.itch.io/mitzi-the-bat' }], video: '-RWA4pu_Jvg',
  },
  {
    slug: 'crocodile-invasion', title: 'Crocodile Invasion', number: '04', image: 'crocodile', year: '2023–24',
    team: text('Solo project', 'Soloprojekt'), duration: text('Sep 2023 — Jul 2024', 'Sep. 2023 — Juli 2024'), tags: ['C++ / OpenGL', 'Systems design', 'Custom engine'],
    summary: text('Cooperate. Compete. A dungeon shooter built on my own game engine.', 'Zusammenarbeiten. Konkurrieren. Ein Dungeon-Shooter mit eigener Game Engine.'),
    contribution: text('Solo development · game design · custom C++ engine', 'Solo-Entwicklung · Game Design · eigene C++-Engine'),
    problem: text('Make both cooperation and competition enjoyable in the same five-level dungeon shooter. Enemies should reward teamwork without making solo mastery impossible.', 'Kooperation und Wettbewerb in demselben Dungeon-Shooter mit fünf Levels interessant machen. Gegner sollen Teamwork belohnen, ohne das Meistern allein auszuschließen.'),
    implementation: text('I built a custom C++/OpenGL engine with an ECS, input handling, scenes, glTF support, animation, UI, text, collision and audio. Shared and individual scoring create incentives for different play styles; most game data can be replaced for modding.', 'Ich entwickelte eine C++-/OpenGL-Engine mit ECS, Eingabeverarbeitung, Szenen, glTF-Unterstützung, Animation, UI, Text, Kollision und Audio. Gemeinsame und individuelle Wertungen schaffen Anreize für unterschiedliche Spielweisen; die meisten Spieldaten sind für Mods austauschbar.'),
    outcome: text('A solo university project with five dungeon levels, co-op and versus play styles, and publicly linked source code.', 'Ein Solo-Universitätsprojekt mit fünf Dungeon-Levels, kooperativen und kompetitiven Spielweisen sowie verlinktem Quellcode.'),
    reflection: text('Design lens: technical architecture and player incentives are connected. The engine supports the game’s systems; the scoring and enemy design shape how players use them together.', 'Designperspektive: Technische Architektur und Spielanreize hängen zusammen. Die Engine trägt die Systeme; Wertung und Gegnerdesign prägen, wie Spieler sie gemeinsam nutzen.'),
    images: [], links: [{ label: text('Play on itch.io', 'Auf itch.io spielen'), url: 'https://byter64.itch.io/crocodile-invasion' }, { label: text('Source code', 'Quellcode'), url: 'https://github.com/Byter64/GameLab3' }], video: 'X1_4EwguKQA',
  },
  {
    slug: 'hungry-hungry-ant', title: 'Hungry Hungry Ant', number: '05', image: 'ant', year: '2024',
    team: text('2 people', '2 Personen'), duration: text('48 hours', '48 Stunden'), tags: ['Unity / C#', 'Paper prototyping', 'Puzzle design'],
    summary: text('Guide an ant indirectly. Plan the route, collect the leaves, return home.', 'Eine Ameise indirekt steuern. Route planen, Blätter sammeln, heimkehren.'),
    contribution: text('Paper prototyping for level creation · game design', 'Papierprototyping zur Level-Erstellung · Game Design'),
    problem: text('Design deterministic route puzzles with the right number of arrows and stones, within a 48-hour game jam.', 'Deterministische Routenrätsel mit der passenden Anzahl an Pfeilen und Steinen innerhalb eines 48-Stunden-Game-Jams gestalten.'),
    implementation: text('Players place arrows and stones to guide the ant, collect every leaf and return to the colony. I created a paper prototype to try out level ideas quickly, photograph them and transfer them into the game.', 'Spieler platzieren Pfeile und Steine, um die Ameise zu allen Blättern und zurück zur Kolonie zu führen. Ich erstellte einen Papierprototyp, um Levelideen schnell auszuprobieren, zu fotografieren und ins Spiel zu übertragen.'),
    outcome: text('A two-person browser game made for the theme “End Where You Started”.', 'Ein Browser-Spiel von zwei Personen zum Thema „End Where You Started“.'),
    reflection: text('Design lens: a lightweight physical prototype can shorten the path from a puzzle idea to a testable level.', 'Designperspektive: Ein einfacher physischer Prototyp verkürzt den Weg von einer Rätselidee zum testbaren Level.'),
    images: [], links: [{ label: text('Play in browser', 'Im Browser spielen'), url: 'https://miggli.itch.io/hungry-hungry-ant' }], video: 'VfeMmp9UzM8',
  },
  {
    slug: 'phoebus-cartell', title: 'The Phoebus Cartell', number: '06', image: 'phoebus', year: '2026',
    team: text('3 people', '3 Personen'), duration: text('2 days', '2 Tage'), tags: ['Unity / C#', 'Gameplay loop', 'Rapid prototyping'],
    summary: text('Break light bulbs. Keep the cartel in business.', 'Glühbirnen zerstören. Das Kartell im Geschäft halten.'),
    contribution: text('Core gameplay idea · gameplay loop · controls · selected visuals', 'Grundidee · Gameplay-Loop · Steuerung · ausgewählte Grafiken'),
    problem: text('Turn an unusual premise about planned obsolescence into a focused, playable prototype in two days.', 'Eine ungewöhnliche Prämisse über geplante Obsoleszenz in zwei Tagen in einen fokussierten, spielbaren Prototyp übersetzen.'),
    implementation: text('I contributed the core gameplay idea, implemented the main loop and controls, and created selected visuals, including the window and car. The player works for a cartel that wants more light bulbs destroyed.', 'Ich steuerte die Grundidee bei, implementierte den zentralen Loop und die Steuerung und erstellte ausgewählte Grafiken, darunter Fenster und Auto. Die Spielfigur arbeitet für ein Kartell, das mehr Glühbirnen zerstört sehen möchte.'),
    outcome: text('A three-person university prototyping project, playable in the browser.', 'Ein universitäres Prototyping-Projekt von drei Personen, spielbar im Browser.'),
    reflection: text('Design lens: a clear premise can anchor the controls, objective and visual language of a short prototype.', 'Designperspektive: Eine klare Prämisse kann Steuerung, Ziel und visuelle Sprache eines kurzen Prototyps verbinden.'),
    images: [], links: [{ label: text('Play in browser', 'Im Browser spielen'), url: 'https://byter64.itch.io/the-phoebus-cartell' }],
  },
  {
    slug: 'cityplan-masters', title: 'Cityplan Masters', number: '07', image: 'cityplan', year: '2026',
    team: text('2 people', '2 Personen'), duration: text('2 days', '2 Tage'), tags: ['Unity / C#', 'Puzzle design', 'Rapid prototyping'],
    summary: text('Small traffic puzzles. Better routes from home to work.', 'Kleine Verkehrsrätsel. Bessere Wege von zu Hause zur Arbeit.'),
    contribution: text('Gameplay-loop co-design · all Unity implementation and programming', 'Mitgestaltung des Gameplay-Loops · gesamte Unity-Umsetzung und Programmierung'),
    problem: text('Create simple traffic puzzles about getting people from their homes to their workplaces as quickly as possible.', 'Einfache Verkehrsrätsel entwickeln, bei denen Menschen möglichst schnell von zu Hause zu ihren Arbeitsplätzen gelangen.'),
    implementation: text('I co-designed the gameplay loop and handled all Unity work and programming during a two-day prototyping project.', 'In einem zweitägigen Prototyping-Projekt gestaltete ich den Gameplay-Loop mit und übernahm sämtliche Unity-Arbeiten und die Programmierung.'),
    outcome: text('A two-person university prototype, available in the browser under the itch.io title Traffic Manager.', 'Ein Universitätsprototyp von zwei Personen, im Browser unter dem itch.io-Titel Traffic Manager verfügbar.'),
    reflection: text('Design lens: a familiar everyday system can become a compact puzzle when the goal and feedback are clear.', 'Designperspektive: Ein vertrautes Alltagssystem wird zu einem kompakten Rätsel, wenn Ziel und Feedback klar sind.'),
    images: [], links: [{ label: text('Play in browser', 'Im Browser spielen'), url: 'https://byter64.itch.io/traffic-manager' }],
  },
];

export const levels = [
  text('Foundations', 'Grundlagen'), text('Applied in projects', 'In Projekten angewendet'),
  text('Independent implementation', 'Selbstständig umgesetzt'), text('In-depth, across systems', 'Vertieft und systemübergreifend'),
];
export const skills = [
  { name: 'Unity / C#', level: 4, projects: ['batective-mitzi', 'tony-blob'], area: 'Development' },
  { name: 'C++', level: 3, projects: ['crocodile-invasion'], area: 'Development' },
  { name: 'Systems & gameplay programming', de: 'System- & Gameplay-Programmierung', level: 4, projects: ['crocodile-invasion', 'wuehans'], area: 'Development' },
  { name: 'Game design & game feel', de: 'Game Design & Game Feel', level: 3, projects: ['tony-blob', 'crocodile-invasion'], area: 'Design' },
  { name: 'OpenGL', level: 2, projects: ['crocodile-invasion'], area: 'Development' },
  { name: 'Reaper / game music', de: 'Reaper / Spielmusik', level: 3, projects: [], area: 'Audio' },
  { name: 'Blender', level: 1, projects: [], area: 'Art' },
];

export const hotspots = [
  { id: 'gpu', number: '01', label: text('Graphics', 'Grafik'), title: text('A graphics pipeline of our own.', 'Eine eigene Grafikpipeline.'),
    body: text('I developed the GPU: a pipelined DMA with sprite scaling, flipping and optional colour tables.', 'Ich entwickelte die GPU: eine pipelined DMA mit Sprite-Skalierung, Spiegelung und optionalen Farbtabellen.'), image: 'gpu' },
  { id: 'apu', number: '02', label: text('Audio', 'Audio'), title: text('Eight channels. One sound system.', 'Acht Kanäle. Ein Soundsystem.'),
    body: text('I developed most of the APU. Eight independent channels stream audio from memory and can be paired for stereo.', 'Ich entwickelte große Teile der APU. Acht unabhängige Kanäle streamen Audio aus dem Speicher und lassen sich für Stereo paaren.'), image: 'apu' },
  { id: 'games', number: '03', label: text('Make games', 'Spiele entwickeln'), title: text('From hardware to playable ideas.', 'Von Hardware zu spielbaren Ideen.'),
    body: text('Our team supplied a small engine and PC backend for a game jam. Four games were created for the console.', 'Unser Team stellte eine kleine Engine und ein PC-Backend für einen Game Jam bereit. Für die Konsole entstanden vier Spiele.'), image: 'cow' },
];

export const imageAlts: Record<string, Copy> = {
  console: text('The custom WUEHANS console with an integrated screen running Cow Shooter', 'Die selbst entwickelte WUEHANS-Konsole mit integriertem Bildschirm und laufendem Cow Shooter'),
  tony: text('Tony Blob gameplay in a colourful sandbox environment', 'Tony-Blob-Gameplay in einer bunten Sandbox-Umgebung'),
  'tony-title': text('Tony Blob’s Pro Bouncer title artwork', 'Titelgrafik von Tony Blob’s Pro Bouncer'),
  'tony-movement': text('Diagram illustrating jumping and the bounce movement mode', 'Skizze zu Sprüngen und dem Bounce-Bewegungsmodus'),
  mitzi: text('Mitzi the bat in conversation inside the barn', 'Fledermaus Mitzi im Gespräch in der Scheune'),
  'mitzi-world': text('A wooden barn environment in Batective Mitzi', 'Hölzerne Scheunen-Umgebung in Batective Mitzi'),
  crocodile: text('Top-down dungeon gameplay with two players and scores', 'Dungeon-Spiel aus der Vogelperspektive mit zwei Spielern und Punkteständen'),
  ant: text('Hungry Hungry Ant puzzle board with an ant and direction arrows', 'Rätselbrett aus Hungry Hungry Ant mit Ameise und Richtungspfeilen'),
  phoebus: text('The Phoebus Cartell game with windows and a car', 'The Phoebus Cartell mit Fenstern und einem Auto'),
  cityplan: text('Cityplan Masters traffic puzzle with roads and buildings', 'Verkehrsrätsel aus Cityplan Masters mit Straßen und Gebäuden'),
  architecture: text('WUEHANS system architecture diagram', 'Diagramm der WUEHANS-Systemarchitektur'),
  gpu: text('The stages of the WUEHANS GPU pipeline', 'Die Stufen der WUEHANS-GPU-Pipeline'),
  apu: text('Architecture diagram of the eight-channel WUEHANS APU', 'Architekturdiagramm der WUEHANS-APU mit acht Kanälen'),
  tennis: text('Hans Tennis running on WUEHANS', 'Hans Tennis auf WUEHANS'),
  tower: text('Hans Tower Defence gameplay', 'Gameplay aus Hans Tower Defence'),
  gatherer: text('Hans The Gatherer forest gameplay', 'Wald-Gameplay aus Hans The Gatherer'),
  cow: text('Cow Shooter pixel-art gameplay', 'Pixel-Art-Gameplay aus Cow Shooter'),
};
