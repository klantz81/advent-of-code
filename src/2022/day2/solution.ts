import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Input = 'A' | 'B' | 'C';
type Result = 'X' | 'Y' | 'Z';
interface StringMap {
  [key: string]: string;
}
interface NumberMap {
  [key: string]: number;
}

class Solution {
  static LOSE: StringMap = { A: 'B', B: 'C', C: 'A' };
  static WIN: StringMap = { A: 'C', B: 'A', C: 'B' };
  static NORMALIZE: StringMap = { X: 'A', Y: 'B', Z: 'C' };
  static RESULTS: StringMap = { LOSE: 'X', DRAW: 'Y', WIN: 'Z' };
  static SCORE: NumberMap = { A: 1, B: 2, C: 3, DRAW: 3, WIN: 6, LOSE: 0 };

  /**
   * Normalizes player inputs so all responses are either A, B, or C
   * @param p player input
   * @returns
   */
  static normalizeInput(p: Result) {
    return Solution.NORMALIZE[p];
  }

  /**
   * Calculates the score based on player inputs
   * @param p1 opponent input
   * @param p2 player input
   * @returns outcome score
   */
  static roundOutcome(p1: Input, p2: Input) {
    if (p1 === p2) return Solution.SCORE.DRAW;
    if (Solution.WIN[p2] == p1) return Solution.SCORE.WIN;
    return Solution.SCORE.LOSE;
  }

  /**
   * Calculates the total score based on the round outcome and player input selection
   * @param p1 opponent inpt
   * @param p2 player input
   * @returns total score for the round
   */
  static roundScore(p1: Input, p2: Input) {
    const s0 = Solution.SCORE[p2];
    const s1 = Solution.roundOutcome(p1, p2);
    return s0 + s1;
  }

  /**
   * Determines what input the player should choose based on the opponent's input and the result of the round
   * @param p0 opponent input
   * @param result what the result of the round should be
   * @returns what input the player should choose
   */
  static chooseInput(p0: Input, result: Result): string {
    if (result === Solution.RESULTS.LOSE) {
      return Solution.WIN[p0]; //opponent wins
    } else if (result === Solution.RESULTS.DRAW) {
      return p0;
    } else {
      //result === Solution.RESULTS.WIN
      return Solution.LOSE[p0]; //opponent loses
    }
  }

  /**
   * Process the strategy guide, incorrectly
   * @param str string containing the strategy guide
   * @returns total score
   */
  static processPart1(str: string) {
    const list = str.split('\n');
    const rounds = list.map((t) => t.split(' '));
    const totals = rounds.map((t) =>
      Solution.roundScore(
        t[0] as Input,
        Solution.normalizeInput(t[1] as Result) as Input
      )
    );
    return totals.reduce((a, t) => a + t);
  }

  /**
   * Process the strategy guide, correctly
   * @param str string containing the strategy guide
   * @returns total score
   */
  static processPart2(str: string) {
    const list = str.split('\n');
    const rounds = list.map((t) => t.split(' '));
    const totals = rounds.map((t) =>
      Solution.roundScore(
        t[0] as Input,
        Solution.chooseInput(t[0] as Input, t[1] as Result) as Input
      )
    );
    return totals.reduce((a, t) => a + t);
  }
}

export default function solution() {
  const str = fs.readFileSync(path.resolve(__dirname, 'input2.txt')).toString();

  const res = Solution.processPart1(str);
  console.log('2022-day2, final score:', res);

  const res_part2 = Solution.processPart2(str);
  console.log('2022-day2, final score proper:', res_part2);
}
