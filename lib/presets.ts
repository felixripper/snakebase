import type { FullGameConfig } from "./config-store";

export type GamePreset = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  config: FullGameConfig;
};

export const GAME_PRESETS: GamePreset[] = [
  {
    id: "classic",
    name: "Klasik",
    description: "Klasik yılan oyunu deneyimi",
    emoji: "🎮",
    config: {
      colors: {
        background: "#0052FF",
        grid: "#1c60f2",
        snakeHead: "#dfb4b4",
        snakeBody: "#ffffff",
        foodPrimary: "#e1ff00",
        foodSecondary: "#fff700",
        particle: "#ffffff",
        ui: "#ffffff",
        noPlay: "#06103a"
      },
      player: {
        baseSpeed: 6,
        speedIncreasePerFood: 0.6,
        minStepMs: 140,
        roundedHead: 0.39,
        roundedBody: 0.1
      },
      gameplay: {
        gridSize: 30,
        columns: 20,
        rows: 28,
        wrapWalls: true,
        startLength: 7,
        foodScore: 30,
        particles: true,
        foodShape: "heart",
        foodKind: "burger",
        topNoPlayRows: 3,
        noPlayActsAs: "wrap"
      },
      ui: {
        showGrid: false,
        showSwipeHint: false,
        interfaceTitle: "Eat & Grow",
        swipeHintText: "Swipe to move"
      },
      typography: {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        titleSize: 28,
        titleWeight: 900,
        subtitleSize: 14,
        buttonSize: 16,
        buttonWeight: 800,
        hudSize: 14
      },
      buttons: {
        primaryColor: "#3ee686",
        primaryGradientStart: "#94f7b7",
        primaryGradientEnd: "#3ee686",
        textColor: "#0b0f1a",
        borderRadius: 12,
        shadow: true
      },
      sounds: {
        enabled: true,
        eatSound: true,
        hitSound: true,
        volume: 0.5
      },
      difficulty: "normal"
    }
  },
  {
    id: "speed",
    name: "Hız Modu",
    description: "Deneyimli oyuncular için hızlı tempo",
    emoji: "⚡",
    config: {
      colors: {
        background: "#1a0033",
        grid: "#2d0066",
        snakeHead: "#ff00ff",
        snakeBody: "#cc00ff",
        foodPrimary: "#00ffff",
        foodSecondary: "#00ccff",
        particle: "#ffffff",
        ui: "#ffffff",
        noPlay: "#0d001a"
      },
      player: {
        baseSpeed: 12,
        speedIncreasePerFood: 1.2,
        minStepMs: 80,
        roundedHead: 0.2,
        roundedBody: 0.05
      },
      gameplay: {
        gridSize: 25,
        columns: 24,
        rows: 32,
        wrapWalls: true,
        startLength: 5,
        foodScore: 50,
        particles: true,
        foodShape: "circle",
        foodKind: "star",
        topNoPlayRows: 2,
        noPlayActsAs: "wrap"
      },
      ui: {
        showGrid: true,
        showSwipeHint: false,
        interfaceTitle: "⚡ SPEED MODE",
        swipeHintText: "Swipe to move"
      },
      typography: {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        titleSize: 32,
        titleWeight: 900,
        subtitleSize: 16,
        buttonSize: 18,
        buttonWeight: 800,
        hudSize: 16
      },
      buttons: {
        primaryColor: "#ff00ff",
        primaryGradientStart: "#ff00ff",
        primaryGradientEnd: "#cc00ff",
        textColor: "#ffffff",
        borderRadius: 8,
        shadow: true
      },
      sounds: {
        enabled: true,
        eatSound: true,
        hitSound: true,
        volume: 0.7
      },
      difficulty: "hard"
    }
  },
  {
    id: "rainbow",
    name: "Gökkuşağı",
    description: "Rengarenk ve canlı tema",
    emoji: "🌈",
    config: {
      colors: {
        background: "#000033",
        grid: "#1a1a4d",
        snakeHead: "#ff0080",
        snakeBody: "#ffcc00",
        foodPrimary: "#00ff88",
        foodSecondary: "#00ccff",
        particle: "#ff00ff",
        ui: "#ffffff",
        noPlay: "#000020"
      },
      player: {
        baseSpeed: 7,
        speedIncreasePerFood: 0.5,
        minStepMs: 130,
        roundedHead: 0.5,
        roundedBody: 0.3
      },
      gameplay: {
        gridSize: 28,
        columns: 22,
        rows: 30,
        wrapWalls: true,
        startLength: 8,
        foodScore: 25,
        particles: true,
        foodShape: "heart",
        foodKind: "heart",
        topNoPlayRows: 3,
        noPlayActsAs: "wrap"
      },
      ui: {
        showGrid: true,
        showSwipeHint: false,
        interfaceTitle: "🌈 Rainbow Snake",
        swipeHintText: "Swipe to move"
      },
      typography: {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        titleSize: 30,
        titleWeight: 900,
        subtitleSize: 14,
        buttonSize: 16,
        buttonWeight: 800,
        hudSize: 15
      },
      buttons: {
        primaryColor: "#ff0080",
        primaryGradientStart: "#ff00ff",
        primaryGradientEnd: "#ff0080",
        textColor: "#ffffff",
        borderRadius: 20,
        shadow: true
      },
      sounds: {
        enabled: true,
        eatSound: true,
        hitSound: true,
        volume: 0.6
      },
      difficulty: "normal"
    }
  },
  {
    id: "retro",
    name: "Retro",
    description: "Klasik yeşil ekran nostaljisi",
    emoji: "👾",
    config: {
      colors: {
        background: "#0f380f",
        grid: "#306230",
        snakeHead: "#9bbc0f",
        snakeBody: "#8bac0f",
        foodPrimary: "#0f380f",
        foodSecondary: "#306230",
        particle: "#9bbc0f",
        ui: "#9bbc0f",
        noPlay: "#0a2e0a"
      },
      player: {
        baseSpeed: 5,
        speedIncreasePerFood: 0.4,
        minStepMs: 160,
        roundedHead: 0,
        roundedBody: 0
      },
      gameplay: {
        gridSize: 32,
        columns: 18,
        rows: 26,
        wrapWalls: true,
        startLength: 6,
        foodScore: 10,
        particles: false,
        foodShape: "square",
        foodKind: "burger",
        topNoPlayRows: 2,
        noPlayActsAs: "wall"
      },
      ui: {
        showGrid: true,
        showSwipeHint: false,
        interfaceTitle: "SNAKE.EXE",
        swipeHintText: "Swipe to move"
      },
      typography: {
        fontFamily: "monospace",
        titleSize: 24,
        titleWeight: 700,
        subtitleSize: 12,
        buttonSize: 14,
        buttonWeight: 700,
        hudSize: 13
      },
      buttons: {
        primaryColor: "#9bbc0f",
        primaryGradientStart: "#9bbc0f",
        primaryGradientEnd: "#8bac0f",
        textColor: "#0f380f",
        borderRadius: 4,
        shadow: false
      },
      sounds: {
        enabled: true,
        eatSound: true,
        hitSound: true,
        volume: 0.4
      },
      difficulty: "normal"
    }
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Sade ve temiz tasarım",
    emoji: "⚪",
    config: {
      colors: {
        background: "#f5f5f5",
        grid: "#e0e0e0",
        snakeHead: "#333333",
        snakeBody: "#666666",
        foodPrimary: "#ff4444",
        foodSecondary: "#ff6666",
        particle: "#999999",
        ui: "#333333",
        noPlay: "#e8e8e8"
      },
      player: {
        baseSpeed: 6,
        speedIncreasePerFood: 0.5,
        minStepMs: 140,
        roundedHead: 0.5,
        roundedBody: 0.2
      },
      gameplay: {
        gridSize: 30,
        columns: 20,
        rows: 28,
        wrapWalls: true,
        startLength: 7,
        foodScore: 20,
        particles: false,
        foodShape: "circle",
        foodKind: "burger",
        topNoPlayRows: 3,
        noPlayActsAs: "wrap"
      },
      ui: {
        showGrid: false,
        showSwipeHint: false,
        interfaceTitle: "Snake",
        swipeHintText: "Swipe to move"
      },
      typography: {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        titleSize: 26,
        titleWeight: 700,
        subtitleSize: 14,
        buttonSize: 15,
        buttonWeight: 600,
        hudSize: 14
      },
      buttons: {
        primaryColor: "#333333",
        primaryGradientStart: "#444444",
        primaryGradientEnd: "#333333",
        textColor: "#ffffff",
        borderRadius: 8,
        shadow: false
      },
      sounds: {
        enabled: false,
        eatSound: false,
        hitSound: false,
        volume: 0.3
      },
      difficulty: "easy"
    }
  },
  {
    id: "neon",
    name: "Neon",
    description: "Parlayan efektlerle siberpunk havası",
    emoji: "🌃",
    config: {
      colors: {
        background: "#0a0a0a",
        grid: "#1a1a2e",
        snakeHead: "#00fff9",
        snakeBody: "#00ccff",
        foodPrimary: "#ff006e",
        foodSecondary: "#ff4d94",
        particle: "#00fff9",
        ui: "#00fff9",
        noPlay: "#050505"
      },
      player: {
        baseSpeed: 8,
        speedIncreasePerFood: 0.7,
        minStepMs: 120,
        roundedHead: 0.4,
        roundedBody: 0.2
      },
      gameplay: {
        gridSize: 28,
        columns: 22,
        rows: 30,
        wrapWalls: true,
        startLength: 6,
        foodScore: 35,
        particles: true,
        foodShape: "circle",
        foodKind: "star",
        topNoPlayRows: 3,
        noPlayActsAs: "wrap"
      },
      ui: {
        showGrid: true,
        showSwipeHint: false,
        interfaceTitle: "NEON SNAKE",
        swipeHintText: "Swipe to move"
      },
      typography: {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        titleSize: 30,
        titleWeight: 900,
        subtitleSize: 15,
        buttonSize: 17,
        buttonWeight: 800,
        hudSize: 15
      },
      buttons: {
        primaryColor: "#00fff9",
        primaryGradientStart: "#00fff9",
        primaryGradientEnd: "#00ccff",
        textColor: "#0a0a0a",
        borderRadius: 16,
        shadow: true
      },
      sounds: {
        enabled: true,
        eatSound: true,
        hitSound: true,
        volume: 0.6
      },
      difficulty: "normal"
    }
  }
];

export function getPresetById(id: string): GamePreset | undefined {
  return GAME_PRESETS.find(p => p.id === id);
}

export function getAllPresets(): GamePreset[] {
  return GAME_PRESETS;
}
