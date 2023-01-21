import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Solution {
  static getEndOfMarker(str: string, size: number) {
    for (let i = size - 1; i < str.length; i++) {
      const start = i - size + 1;
      const end = start + size;
      const sub = str.substring(start, end);
      if (new Set(sub).size === size) return end;
    }
    return -1;
  }

  static processPart1(str: string) {
    return str.split('\n').map((l) => Solution.getEndOfMarker(l, 4));
  }

  static processPart2(str: string) {
    return str.split('\n').map((l) => Solution.getEndOfMarker(l, 14));
  }
}

export default function solution() {
  const str = fs.readFileSync(path.resolve(__dirname, 'input2.txt')).toString();

  const res = Solution.processPart1(str);
  console.log('2022-day6, end of marker positions, marker size 4:', res);

  const res_part2 = Solution.processPart2(str);
  console.log('2022-day6, end of marker positions, marker size 14:', res_part2);
}
