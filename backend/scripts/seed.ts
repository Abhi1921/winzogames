import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding WinzoGames MySQL/SQLite database...");

  // 1. All 15 Game Categories
  const categories = [
    { slug: "puzzle", name: "Puzzle Games", description: "2048, Sudoku, Minesweeper & brain benders", icon: "puzzle", displayOrder: 1 },
    { slug: "board", name: "Board & Strategy", description: "Ludo, Chess, Checkers & Connect Four", icon: "layout-grid", displayOrder: 2 },
    { slug: "racing", name: "Racing", description: "Car racing, bike racing & endless speed runners", icon: "zap", displayOrder: 3 },
    { slug: "action", name: "Action", description: "Space shooters, survival & arcade battles", icon: "shield", displayOrder: 4 },
    { slug: "arcade", name: "Arcade", description: "Brick breaker, bubble shooter & reaction games", icon: "gamepad-2", displayOrder: 5 },
    { slug: "brain", name: "Brain & Logic", description: "Memory match, logic grids & pattern recognition", icon: "sparkles", displayOrder: 6 },
    { slug: "sports", name: "Sports", description: "Cricket Premier League, Football & Tennis", icon: "trophy", displayOrder: 7 },
    { slug: "card", name: "Card Games", description: "Solitaire Klondike & card strategy games", icon: "layers", displayOrder: 8 },
    { slug: "quiz", name: "Trivia & Quiz", description: "GK, Sports, Bollywood & India quizzes", icon: "help-circle", displayOrder: 9 },
    { slug: "multiplayer", name: "Multiplayer", description: "Play live online with friends and players", icon: "users", displayOrder: 10 },
    { slug: "retro", name: "Retro / Classic", description: "Snake, Pong, Tic-Tac-Toe & timeless games", icon: "crown", displayOrder: 11 },
    { slug: "casual", name: "Casual", description: "Relaxing quick-play casual mini-games", icon: "smile", displayOrder: 12 },
    { slug: "simulation", name: "Simulation", description: "City builder, farm & manager games", icon: "cpu", displayOrder: 13 },
    { slug: "adventure", name: "Adventure", description: "Treasure hunts, mazes & quests", icon: "compass", displayOrder: 14 },
    { slug: "party", name: "Party Games", description: "Group mini-games and quick reactions", icon: "party-popper", displayOrder: 15 },
  ];

  for (const cat of categories) {
    await prisma.gameCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const catMap: Record<string, string> = {};
  const allCats = await prisma.gameCategory.findMany();
  allCats.forEach((c) => {
    catMap[c.slug] = c.id;
  });

  // 2. Playable Games Catalog (Including Cricket!)
  const games = [
    // Sports Games
    { slug: "cricket", name: "Cricket Premier League", description: "Play 2 Overs Cricket match! Time your shots to score 4s and 6s!", categoryId: catMap["sports"], thumbnail: "/images/games/cricket.png", difficulty: "MEDIUM", isFeatured: true, isMultiplayer: false, playCount: 620000, rating: 4.9, instructions: "Time your swing meter to drive or loft 4s and 6s before running out of overs.", controls: "Select DRIVE (4), LOFT (6), or DEFEND." },

    // Board Games
    { slug: "ludo", name: "Ludo Classic & Multiplayer", description: "Complete browser Ludo with Local 2P/4P & Server-Authoritative Online Multiplayer!", categoryId: catMap["board"], thumbnail: "/images/games/ludo.png", difficulty: "EASY", isFeatured: true, isMultiplayer: true, playCount: 450000, rating: 4.9, instructions: "Roll the dice, race your 4 tokens around the board, enter safe zones, and reach home!", controls: "Click dice to roll, click token to move." },
    { slug: "chess", name: "Chess Masters", description: "Play classic Chess vs Computer AI or Local 2 Player.", categoryId: catMap["board"], thumbnail: "/images/games/chess.png", difficulty: "HARD", isFeatured: true, isMultiplayer: false, playCount: 180000, rating: 4.8, instructions: "Checkmate the enemy king using legal chess moves.", controls: "Click piece then target cell." },
    { slug: "checkers", name: "Checkers", description: "Classic 8x8 draughts board game.", categoryId: catMap["board"], thumbnail: "/images/games/checkers.png", difficulty: "MEDIUM", isFeatured: false, isMultiplayer: false, playCount: 95000, rating: 4.6, instructions: "Diagonal moves and captures. King your tokens by reaching the back row.", controls: "Click token then destination cell." },
    { slug: "connect-four", name: "Connect Four", description: "Drop colored discs to form a line of 4!", categoryId: catMap["board"], thumbnail: "/images/games/connect-four.png", difficulty: "EASY", isFeatured: false, isMultiplayer: false, playCount: 110000, rating: 4.7, instructions: "Connect 4 of your colored discs vertically, horizontally, or diagonally.", controls: "Click column to drop disc." },

    // Puzzle Games
    { slug: "2048", name: "2048", description: "Slide identical numbers to reach the 2048 tile!", categoryId: catMap["puzzle"], thumbnail: "/images/games/2048.png", difficulty: "MEDIUM", isFeatured: true, isMultiplayer: false, playCount: 320000, rating: 4.9, instructions: "When two tiles with the same number touch, they merge!", controls: "Arrow keys or Swipe on mobile." },
    { slug: "sudoku", name: "Sudoku", description: "Popular 9x9 logic puzzle solver.", categoryId: catMap["puzzle"], thumbnail: "/images/games/sudoku.png", difficulty: "HARD", isFeatured: false, isMultiplayer: false, playCount: 140000, rating: 4.7, instructions: "Fill every row, column and 3x3 block with digits 1-9.", controls: "Select cell then tap 1-9 keypad." },
    { slug: "minesweeper", name: "Minesweeper", description: "Uncover safe cells without detonating hidden mines.", categoryId: catMap["puzzle"], thumbnail: "/images/games/minesweeper.png", difficulty: "MEDIUM", isFeatured: false, isMultiplayer: false, playCount: 165000, rating: 4.8, instructions: "Number clues tell how many mines touch that cell. Flag mines!", controls: "Left click to reveal, Right click / Flag mode to flag." },
    { slug: "memory-match", name: "Memory Match", description: "Flip cards and test your visual memory.", categoryId: catMap["brain"], thumbnail: "/images/games/memory-match.png", difficulty: "EASY", isFeatured: true, isMultiplayer: false, playCount: 210000, rating: 4.8, instructions: "Flip two cards to find matching pairs in minimum moves.", controls: "Click card to flip." },

    // Arcade & Action Games
    { slug: "snake", name: "Snake Retro", description: "Classic arcade snake game. Eat food, grow longer, avoid walls.", categoryId: catMap["retro"], thumbnail: "/images/games/snake.png", difficulty: "MEDIUM", isFeatured: true, isMultiplayer: false, playCount: 510000, rating: 4.9, instructions: "Eat apples to grow longer without colliding with walls or yourself.", controls: "Arrow keys or D-Pad on mobile." },
    { slug: "flappy-bird", name: "Flappy Sky Dash", description: "Original tap-to-fly arcade challenge!", categoryId: catMap["arcade"], thumbnail: "/images/games/flappy.png", difficulty: "HARD", isFeatured: true, isMultiplayer: false, playCount: 410000, rating: 4.8, instructions: "Tap or click to flap wings and navigate through obstacle gaps.", controls: "Spacebar / Click / Tap to flap." },
    { slug: "space-shooter", name: "Galactic Shooter", description: "Original space arcade shooter vs alien invaders!", categoryId: catMap["action"], thumbnail: "/images/games/space-shooter.png", difficulty: "MEDIUM", isFeatured: false, isMultiplayer: false, playCount: 195000, rating: 4.7, instructions: "Shoot down incoming alien ships while dodging plasma lasers.", controls: "Arrow keys to move, Spacebar / Auto-fire to shoot." },
    { slug: "brick-breaker", name: "Brick Breaker", description: "Bounce the ball off your paddle to smash all bricks!", categoryId: catMap["arcade"], thumbnail: "/images/games/brick-breaker.png", difficulty: "EASY", isFeatured: false, isMultiplayer: false, playCount: 230000, rating: 4.8, instructions: "Destroy all bricks without letting the ball fall past your paddle.", controls: "Mouse / Touch to move paddle." },
    { slug: "bubble-shooter", name: "Bubble Matcher", description: "Match 3 or more identical bubbles to pop them!", categoryId: catMap["arcade"], thumbnail: "/images/games/bubble-shooter.png", difficulty: "EASY", isFeatured: false, isMultiplayer: false, playCount: 275000, rating: 4.8, instructions: "Aim and shoot bubbles to match 3 or more of the same color.", controls: "Aim with mouse/touch and click to shoot." },

    // Quiz & Trivia Games
    { slug: "quiz-gk", name: "General Knowledge Quiz", description: "Test your general knowledge against the timer!", categoryId: catMap["quiz"], thumbnail: "/images/games/quiz-gk.png", difficulty: "EASY", isFeatured: true, playCount: 160000, rating: 4.8, instructions: "Answer trivia questions within 15 seconds.", controls: "Click correct option." },
    { slug: "quiz-sports", name: "Sports Trivia", description: "Cricket, Football, Olympics & Sports Quiz!", categoryId: catMap["quiz"], thumbnail: "/images/games/quiz-sports.png", difficulty: "EASY", isFeatured: false, playCount: 145000, rating: 4.7, instructions: "Test your knowledge of sports records and legends.", controls: "Click option." },
    { slug: "quiz-bollywood", name: "Bollywood Trivia", description: "Test your Indian cinema & music trivia!", categoryId: catMap["quiz"], thumbnail: "/images/games/quiz-bollywood.png", difficulty: "EASY", isFeatured: true, playCount: 190000, rating: 4.9, instructions: "Answer Indian movie trivia questions.", controls: "Click option." },

    // Card & Classic Games
    { slug: "solitaire", name: "Solitaire Klondike", description: "Classic single-player card solitaire game.", categoryId: catMap["card"], thumbnail: "/images/games/solitaire.png", difficulty: "MEDIUM", isFeatured: false, playCount: 170000, rating: 4.8, instructions: "Build foundations from Ace to King in alternating suit colors.", controls: "Drag or click cards to move." },
    { slug: "tic-tac-toe", name: "Tic Tac Toe", description: "Classic 3x3 strategy vs AI or 2 Player.", categoryId: catMap["retro"], thumbnail: "/images/games/tic-tac-toe.png", difficulty: "EASY", isFeatured: false, playCount: 220000, rating: 4.7, instructions: "Place 3 of your marks in a row to win.", controls: "Click cell." },
    { slug: "rock-paper-scissors", name: "Rock Paper Scissors", description: "Best-of-5 match against AI.", categoryId: catMap["casual"], thumbnail: "/images/games/rps.png", difficulty: "EASY", isFeatured: false, playCount: 200000, rating: 4.8, instructions: "Rock beats Scissors, Scissors beats Paper, Paper beats Rock!", controls: "Click choice." },
  ];

  for (const g of games) {
    await prisma.game.upsert({
      where: { slug: g.slug },
      update: g,
      create: g,
    });
  }

  console.log("✅ WinzoGames MySQL/SQLite database successfully seeded with all 15 categories and games catalog!");
}

main()
  .catch((e) => {
    console.error("Error seeding DB:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
