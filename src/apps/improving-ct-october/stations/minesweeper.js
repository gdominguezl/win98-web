import {
  setMinesweeperChallenge,
  TAUNTS,
} from "../../minesweeper/challenge.js";

const CONFIGS = {
  argentina: {
    width: 8,
    height: 8,
    mines: 10,
    winTitle: "Minesweeper",
    winText: "Codigo: 1",
  },
  chile: {
    width: 6,
    height: 6,
    mines: 4,
    winTitle: "Minesweeper",
    winText: "SECTOR DESBLOQUEADO: BODEGA",
  },
};

export const id = "minesweeper";

export async function apply(ctx) {
  const config = CONFIGS[ctx.office];
  if (!config) return {};
  setMinesweeperChallenge({
    ...config,
    tauntAfterLosses: 3,
    taunts: TAUNTS,
  });
  return { office: ctx.office };
}

export async function remove() {
  setMinesweeperChallenge(null);
}
