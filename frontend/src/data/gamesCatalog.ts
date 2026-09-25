export interface GameItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  thumbnail: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  playCount: number;
  rating: number;
  isFeatured: boolean;
  isMultiplayer: boolean;
  instructions: string;
  controls: string;
}

export const GAMES_CATALOG: GameItem[] = [
  {
    id: "ludo-1",
    slug: "ludo",
    name: "Ludo Classic & Multiplayer",
    description: "Classic Indian 15x15 Ludo board game. Play vs AI, Local 2-4 Players, or Online!",
    category: "Board & Strategy",
    categorySlug: "board",
    thumbnail: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80",
    difficulty: "EASY",
    playCount: 450000,
    rating: 4.9,
    isFeatured: true,
    isMultiplayer: true,
    instructions: "Roll 6 to enter a token into play. Navigate around the 15x15 board to reach Home path. Capture opponent tokens to send them back to yard.",
    controls: "Click dice to roll. Click glowing token to move."
  },
  {
    id: "snakes-ladders-1",
    slug: "snakes-and-ladders",
    name: "Snakes & Ladders",
    description: "Classic 100-square board game with colorful ladders to climb and snakes to dodge!",
    category: "Board & Strategy",
    categorySlug: "board",
    thumbnail: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=600&q=80",
    difficulty: "EASY",
    playCount: 380000,
    rating: 4.8,
    isFeatured: true,
    isMultiplayer: true,
    instructions: "Roll the dice to move forward. Climb up ladders and avoid sliding down snakes. First to tile 100 wins!",
    controls: "Click Roll Dice button or spacebar."
  },
  {
    id: "cricket-1",
    slug: "cricket",
    name: "Cricket Premier League",
    description: "Hit big 4s and 6s in a 2-over T20 style cricket match against target scores!",
    category: "Sports",
    categorySlug: "sports",
    thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80",
    difficulty: "MEDIUM",
    playCount: 620000,
    rating: 4.9,
    isFeatured: true,
    isMultiplayer: false,
    instructions: "Watch the bowler release the ball. Time your stroke to loft over the field or place driven shots into gaps.",
    controls: "Click shot selection buttons (Cover Drive, Lofted Six, Defensive Tap)."
  },
  {
    id: "chess-1",
    slug: "chess",
    name: "Chess Masters",
    description: "Classic Chess vs Smart AI or Local 2 Player. Complete legal moves & timer!",
    category: "Board & Strategy",
    categorySlug: "board",
    thumbnail: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80",
    difficulty: "HARD",
    playCount: 180000,
    rating: 4.8,
    isFeatured: true,
    isMultiplayer: false,
    instructions: "Outsmart your opponent's army to checkmate their King.",
    controls: "Click piece to highlight valid moves, click target square to make move."
  },
  {
    id: "snake-1",
    slug: "snake",
    name: "Snake Retro",
    description: "Classic arcade snake game. Eat food, grow longer, avoid hitting walls or your tail!",
    category: "Retro / Classic",
    categorySlug: "arcade",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    difficulty: "MEDIUM",
    playCount: 510000,
    rating: 4.9,
    isFeatured: true,
    isMultiplayer: false,
    instructions: "Guide the snake to collect golden food dots and increase your score.",
    controls: "Use Arrow Keys or W/A/S/D on desktop, or Touch D-Pad on mobile."
  },
  {
    id: "2048-1",
    slug: "2048",
    name: "2048 Puzzle",
    description: "Slide identical numbered tiles together to merge them and reach the 2048 tile!",
    category: "Puzzle Games",
    categorySlug: "puzzle",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    difficulty: "MEDIUM",
    playCount: 320000,
    rating: 4.9,
    isFeatured: true,
    isMultiplayer: false,
    instructions: "Swipe or press arrow keys to slide tiles in 4 directions.",
    controls: "Arrow keys or Swipe gestures."
  },
  {
    id: "flappy-bird-1",
    slug: "flappy-bird",
    name: "Flappy Sky Dash",
    description: "Tap to flap your wings and navigate through obstacle pipes without crashing!",
    category: "Arcade",
    categorySlug: "arcade",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
    difficulty: "HARD",
    playCount: 410000,
    rating: 4.8,
    isFeatured: true,
    isMultiplayer: false,
    instructions: "Press spacebar or tap screen to gain altitude.",
    controls: "Spacebar or Tap."
  },
  {
    id: "bubble-shooter-1",
    slug: "bubble-shooter",
    name: "Bubble Matcher",
    description: "Aim and shoot colorful bubbles to match 3 or more of the same color and clear the board!",
    category: "Arcade",
    categorySlug: "arcade",
    thumbnail: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80",
    difficulty: "EASY",
    playCount: 275000,
    rating: 4.8,
    isFeatured: false,
    isMultiplayer: false,
    instructions: "Aim your bubble cannon at matching clusters of bubbles.",
    controls: "Mouse pointer to aim, click to fire."
  },
  {
    id: "brick-breaker-1",
    slug: "brick-breaker",
    name: "Brick Breaker",
    description: "Bounce the ball off your paddle to smash all bricks on the screen!",
    category: "Arcade",
    categorySlug: "arcade",
    thumbnail: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=600&q=80",
    difficulty: "EASY",
    playCount: 230000,
    rating: 4.8,
    isFeatured: false,
    isMultiplayer: false,
    instructions: "Keep the ball in play by sliding your paddle left and right.",
    controls: "Mouse drag or Left/Right Arrow Keys."
  },
  {
    id: "tic-tac-toe-1",
    slug: "tic-tac-toe",
    name: "Tic Tac Toe",
    description: "Classic 3x3 grid strategy game vs AI or Local 2 Player.",
    category: "Retro / Classic",
    categorySlug: "board",
    thumbnail: "https://images.unsplash.com/photo-1668554245749-34b8686e09e3?auto=format&fit=crop&w=600&q=80",
    difficulty: "EASY",
    playCount: 220000,
    rating: 4.7,
    isFeatured: false,
    isMultiplayer: false,
    instructions: "Get 3 of your marks (X or O) in a row horizontally, vertically, or diagonally.",
    controls: "Click any empty square."
  },
  {
    id: "memory-match-1",
    slug: "memory-match",
    name: "Memory Match",
    description: "Flip hidden cards and test your visual memory to match pairs!",
    category: "Brain & Logic",
    categorySlug: "puzzle",
    thumbnail: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80",
    difficulty: "EASY",
    playCount: 210000,
    rating: 4.8,
    isFeatured: true,
    isMultiplayer: false,
    instructions: "Click cards to flip them over. Remember card positions to find pairs.",
    controls: "Click cards."
  },
  {
    id: "rock-paper-scissors-1",
    slug: "rock-paper-scissors",
    name: "Rock Paper Scissors",
    description: "Best-of-5 match against computer AI with animations!",
    category: "Casual",
    categorySlug: "arcade",
    thumbnail: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    difficulty: "EASY",
    playCount: 200000,
    rating: 4.8,
    isFeatured: false,
    isMultiplayer: false,
    instructions: "Rock beats Scissors, Scissors beats Paper, Paper beats Rock.",
    controls: "Click Rock, Paper, or Scissors button."
  },
  {
    id: "space-shooter-1",
    slug: "space-shooter",
    name: "Galactic Shooter",
    description: "Original space arcade shooter! Blast enemy spaceships and dodge alien lasers!",
    category: "Action",
    categorySlug: "arcade",
    thumbnail: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
    difficulty: "MEDIUM",
    playCount: 195000,
    rating: 4.7,
    isFeatured: false,
    isMultiplayer: false,
    instructions: "Pilot your starship, blast oncoming alien waves, collect power-ups.",
    controls: "Arrow keys / A-D to move, Spacebar to fire."
  },
  {
    id: "quiz-bollywood-1",
    slug: "quiz-bollywood",
    name: "Bollywood Trivia",
    description: "Test your Indian cinema, famous dialogues & music trivia knowledge!",
    category: "Trivia & Quiz",
    categorySlug: "quiz",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    difficulty: "EASY",
    playCount: 190000,
    rating: 4.9,
    isFeatured: true,
    isMultiplayer: false,
    instructions: "Answer multiple choice questions before timer expires.",
    controls: "Click option A, B, C, or D."
  },
  {
    id: "solitaire-1",
    slug: "solitaire",
    name: "Solitaire Klondike",
    description: "Classic single-player Klondike card game. Build suit piles from Ace to King!",
    category: "Card Games",
    categorySlug: "puzzle",
    thumbnail: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80",
    difficulty: "MEDIUM",
    playCount: 170000,
    rating: 4.8,
    isFeatured: false,
    isMultiplayer: false,
    instructions: "Drag cards in alternating colors in descending order. Stack Aces in foundation.",
    controls: "Drag and drop or click cards."
  },
  {
    id: "minesweeper-1",
    slug: "minesweeper",
    name: "Minesweeper",
    description: "Uncover safe cells without detonating hidden mines!",
    category: "Puzzle Games",
    categorySlug: "puzzle",
    thumbnail: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&w=600&q=80",
    difficulty: "MEDIUM",
    playCount: 165000,
    rating: 4.8,
    isFeatured: false,
    isMultiplayer: false,
    instructions: "Numbers indicate how many mines touch that cell. Flag suspected mines.",
    controls: "Left click to reveal, Right click to flag."
  },
  {
    id: "quiz-gk-1",
    slug: "quiz-gk",
    name: "General Knowledge Quiz",
    description: "Test your general knowledge, world history & geography against the clock!",
    category: "Trivia & Quiz",
    categorySlug: "quiz",
    thumbnail: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80",
    difficulty: "EASY",
    playCount: 160000,
    rating: 4.8,
    isFeatured: true,
    isMultiplayer: false,
    instructions: "Select correct answers within 15 seconds per question.",
    controls: "Click correct answer."
  },
  {
    id: "quiz-sports-1",
    slug: "quiz-sports",
    name: "Sports Trivia",
    description: "Cricket, Football, Olympics & Sports Quiz!",
    category: "Trivia & Quiz",
    categorySlug: "quiz",
    thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    difficulty: "EASY",
    playCount: 145000,
    rating: 4.7,
    isFeatured: false,
    isMultiplayer: false,
    instructions: "Answer sports questions correctly.",
    controls: "Click option."
  },
  {
    id: "sudoku-1",
    slug: "sudoku",
    name: "Sudoku",
    description: "Popular 9x9 logic grid puzzle. Fill numbers 1-9 without repeating in row, column, or 3x3 box.",
    category: "Puzzle Games",
    categorySlug: "puzzle",
    thumbnail: "https://images.unsplash.com/photo-1585079542156-2755d9c8a094?auto=format&fit=crop&w=600&q=80",
    difficulty: "HARD",
    playCount: 140000,
    rating: 4.7,
    isFeatured: false,
    isMultiplayer: false,
    instructions: "Place digits 1 through 9 into blank cells.",
    controls: "Click cell, then select number 1-9."
  },
  {
    id: "connect-four-1",
    slug: "connect-four",
    name: "Connect Four",
    description: "Drop colored discs into grid to form a line of 4 in a row!",
    category: "Board & Strategy",
    categorySlug: "board",
    thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=600&q=80",
    difficulty: "EASY",
    playCount: 110000,
    rating: 4.7,
    isFeatured: false,
    isMultiplayer: false,
    instructions: "First player to connect 4 discs horizontally, vertically, or diagonally wins.",
    controls: "Click column header to drop disc."
  },
  {
    id: "checkers-1",
    slug: "checkers",
    name: "Checkers",
    description: "Classic 8x8 draughts board game vs AI.",
    category: "Board & Strategy",
    categorySlug: "board",
    thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    difficulty: "MEDIUM",
    playCount: 95000,
    rating: 4.6,
    isFeatured: false,
    isMultiplayer: false,
    instructions: "Move diagonally forward, jump opponent pieces to capture them.",
    controls: "Click piece and click target diagonal tile."
  }
];

export function getStaticGames(search = "", categorySlug = "", difficulty = "", sortBy = "popular"): GameItem[] {
  let list = [...GAMES_CATALOG];

  if (search) {
    const q = search.toLowerCase();
    list = list.filter((g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
  }

  if (categorySlug) {
    list = list.filter((g) => g.categorySlug === categorySlug || g.category.toLowerCase().includes(categorySlug.toLowerCase()));
  }

  if (difficulty) {
    list = list.filter((g) => g.difficulty === difficulty);
  }

  if (sortBy === "popular") {
    list.sort((a, b) => b.playCount - a.playCount);
  } else if (sortBy === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

export function getStaticGameBySlug(slug: string): GameItem | undefined {
  return GAMES_CATALOG.find((g) => g.slug === slug);
}
