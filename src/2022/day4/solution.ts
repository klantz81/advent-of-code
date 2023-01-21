import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Solution {
  static fullyContained(p0: string, p1: string): number {
    const a0 = p0.split('-').map(Number);
    const a1 = p1.split('-').map(Number);
    if (a0[0] <= a1[0] && a0[1] >= a1[1]) return 1;
    if (a1[0] <= a0[0] && a1[1] >= a0[1]) return 1;
    return 0;
  }
  static partiallyContained(p0: string, p1: string): number {
    const a0 = p0.split('-').map(Number);
    const a1 = p1.split('-').map(Number);
    if (a0[0] > a1[1]) return 0;
    if (a0[1] < a1[0]) return 0;
    return 1;
  }
  static processPart1(str: string) {
    const assignments = str.split('\n');
    const pairs = assignments.map((p) => p.split(','));
    const contained = pairs.map((p) => Solution.fullyContained(p[0], p[1]));
    const total = contained.reduce((a, t) => a + t);
    return total;
  }
  static processPart2(str: string) {
    const assignments = str.split('\n');
    const pairs = assignments.map((p) => p.split(','));
    const contained = pairs.map((p) => Solution.partiallyContained(p[0], p[1]));
    const total = contained.reduce((a, t) => a + t);
    return total;
  }
}

export default function solution() {
  const str = fs.readFileSync(path.resolve(__dirname, 'input2.txt')).toString();

  const res = Solution.processPart1(str);
  console.log(
    '2022-day4, number of pairs with one range fully contained within the other:',
    res
  );

  const res_part2 = Solution.processPart2(str);
  console.log(
    '2022-day4, number of pairs with one range partially contained within the other:',
    res_part2
  );
}
