export const TAUNTS = [
  "sos re troll, intenta de nuevo",
  "LOL te esta yendo re-mal",
  "dale que se puede, no te rindas",
  "ni mi abuela pierde asi",
  "casi, casi... bueno no, pero segui",
];

let challenge = null;
let revealed = false;

export function setMinesweeperChallenge(config) {
  challenge = config;
  revealed = false;
}

export function getMinesweeperChallenge() {
  return challenge;
}

export function wasChallengeRevealed() {
  return revealed;
}

export function markChallengeRevealed() {
  revealed = true;
}
