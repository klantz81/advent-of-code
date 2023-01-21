import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Solution {
  static findCommonItem(
    c0: string,
    c1: string,
    c2: string | null = null
  ): string {
    const a0 = c0.split('');
    const a1 = c1.split('');
    const a2 = c2 ? c2.split('') : [];

    const r = a0.filter((t) => a1.includes(t) && (c2 ? a2.includes(t) : true));
    return r[0];
  }
  static calculatePriority(i: string): number {
    //  a == 1
    //  A == 27
    return i.toLowerCase() === i
      ? i.charCodeAt(0) - 'a'.charCodeAt(0) + 1
      : i.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
  }
  static chunk(arr: string[], size: number) {
    const res = [];
    for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
    return res;
  }
  static processPart1(str: string) {
    const rucksacks = str.split('\n');
    const compartments = rucksacks.map((t) => {
      const h = t.length / 2;
      return [t.substring(0, h), t.substring(h, t.length)];
    });
    const items = compartments.map((c) => Solution.findCommonItem(c[0], c[1]));
    const priorities = items.map((i) => Solution.calculatePriority(i));
    return priorities.reduce((a, t) => a + t);
  }
  static processPart2(str: string) {
    const rucksacks = str.split('\n');
    const groups = Solution.chunk(rucksacks, 3);
    const items = groups.map((g) => Solution.findCommonItem(g[0], g[1], g[2]));
    const priorities = items.map((i) => Solution.calculatePriority(i));
    return priorities.reduce((a, t) => a + t);
  }
}

export default function solution() {
  const str = fs.readFileSync(path.resolve(__dirname, 'input2.txt')).toString();

  const res = Solution.processPart1(str);
  console.log('2022-day3, total priority:', res);

  const res_part2 = Solution.processPart2(str);
  console.log('2022-day3, total priority:', res_part2);
}
