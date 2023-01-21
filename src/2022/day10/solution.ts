import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Solution {
  static pending: number = 0;

  static processInstruction(
    instruction: string,
    value: number,
    cycles: number[]
  ) {
    const X = (cycles.length > 0 ? cycles.slice(-1)[0] : 1) + Solution.pending;
    Solution.pending = value;
    if (instruction === 'noop') {
      cycles.push(X);
    } else if (instruction === 'addx') {
      cycles.push(X);
      cycles.push(X);
    }
  }

  static chunk(str: string, size: number) {
    const res = [];
    for (let i = 0; i < str.length; i += size) res.push(str.slice(i, i + size));
    return res;
  }

  static processPart1(str: string) {
    const instructions = str.split('\n');
    const cycles: number[] = [];
    instructions.forEach((i) => {
      const ii = i.split(' ');
      Solution.processInstruction(ii[0], ii[1] ? parseInt(ii[1]) : 0, cycles);
    });

    let total = 0;
    for (let i = 20; i <= 220; i += 40) {
      const strength = cycles[i - 1] ? cycles[i - 1] : 0;
      total += i * strength;
    }

    return total;
  }

  static processPart2(str: string) {
    const instructions = str.split('\n');
    const cycles: number[] = [];
    instructions.forEach((i) => {
      const ii = i.split(' ');
      Solution.processInstruction(ii[0], ii[1] ? parseInt(ii[1]) : 0, cycles);
    });

    let res = '';
    cycles.forEach((c, i) => {
      const p = i % 40;
      const cp = c % 40;
      res += p >= cp - 1 && p <= cp + 1 ? '#' : '.';
    });
    return Solution.chunk(res, 40).join('\n');
  }
}

export default function solution() {
  const str = fs.readFileSync(path.resolve(__dirname, 'input2.txt')).toString();

  const res = Solution.processPart1(str);
  console.log('2022-day10, sum of signal strengths:', res);

  const res_part2 = Solution.processPart2(str);
  console.log('2022-day10, image produced:');
  console.log(res_part2);
}
