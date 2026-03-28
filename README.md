# Monkey Type Clone

Mini-proyect created with agentic workflows.
A clone of the popular typing game [Monkey Type](https://monkeytype.com/).

## Features

- **Combo system**: Counter that tracks your streak of consecutive correct characters
- **Dynamic particles**: Golden particle effects that appear at the cursor when typing correctly
- **Shake animation**: Visual feedback when you miss a key
- **Real-time stats**: WPM, accuracy and time visible during gameplay
- **Results screen**: Final summary when completing all words

## Tech Stack

- **React 18** - Main UI library
- **TypeScript** - Static typing for more robust code
- **Vite** - Ultra-fast bundler and dev server
- **CSS3** - Styles with CSS variables, native animations and visual effects

## Project Structure

```
monkey-type-clone/
├── src/
│   ├── components/
│   │   ├── App.tsx              # Main component
│   │   ├── GameScreen/          # (Reserved for expansion)
│   │   ├── TypingArea/          # Text area with characters
│   │   ├── ComboCounter/        # Combo counter with animations
│   │   ├── Particles/           # Particle system
│   │   ├── Stats/               # Stats bar
│   │   └── FinishScreen/        # Results screen
│   ├── hooks/
│   │   ├── useTypingGame.ts     # Core game logic
│   │   ├── useTimer.ts          # Timer control
│   │   └── useTheme.ts          # Theme switching
│   ├── utils/
│   │   ├── wordsProvider.ts     # Random word generator
│   │   └── words.json           # Spanish word bank
│   └── styles/
│       └── global.css           # Global styles and variables
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Game Mechanics

1. Press **Start** or any printable key to begin
2. Type the words that appear on screen
3. Each correct character spawns golden particles at the cursor
4. Mistakes reset your combo and trigger the shake animation
5. After completing all words, you see your results screen
6. Press **Tab + Enter** to restart
