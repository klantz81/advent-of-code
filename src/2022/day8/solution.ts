import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Solution {
  static createMap(str: string) {
    const map: number[][] = [];
    str.split('\n').forEach((row) => {
      map.push(row.split('').map(Number));
    });
    return map;
  }

  static isVisible(tree: number, i: number, j: number, map: number[][]) {
    //i is column position
    //j is row position
    let sidesVisible = 4;

    const row = map[i];
    const r0 = row.slice(0, j);
    const r1 = row.slice(j + 1, row.length);
    if (r0.some((t) => t >= tree)) sidesVisible--;
    if (r1.some((t) => t >= tree)) sidesVisible--;

    const col: number[] = [];
    map.forEach((r, _i) => {
      r.forEach((c, _j) => {
        if (_j === j) {
          col.push(c);
        }
      });
    });
    const c0 = col.slice(0, i);
    const c1 = col.slice(i + 1, col.length);
    if (c0.some((t) => t >= tree)) sidesVisible--;
    if (c1.some((t) => t >= tree)) sidesVisible--;

    // console.log(tree, r0, r1, c0, c1);

    return sidesVisible ? 1 : 0;
  }

  static scenicScore(tree: number, i: number, j: number, map: number[][]) {
    //i is column position
    //j is row position

    const calculate = (r: number[]) => {
      let t = 0;
      for (let i = 0; i < r.length; i++) {
        t++;
        if (r[i] >= tree) break;
      }
      return t;
    };

    const row = map[i];
    const r0 = row.slice(0, j).reverse();
    const r1 = row.slice(j + 1, row.length);

    const col: number[] = [];
    map.forEach((r, _i) => {
      r.forEach((c, _j) => {
        if (_j === j) {
          col.push(c);
        }
      });
    });
    const c0 = col.slice(0, i).reverse();
    const c1 = col.slice(i + 1, col.length);

    // console.log(tree, i, j, r0, r1, c0, c1);

    return calculate(r0) * calculate(r1) * calculate(c0) * calculate(c1);
  }

  static processPart1(str: string) {
    const map = Solution.createMap(str);
    let total = 0;
    map.forEach((row, i) => {
      row.forEach((tree, j) => {
        total += Solution.isVisible(tree, i, j, map);
      });
    });
    return total;
  }

  static processPart2(str: string) {
    const map = Solution.createMap(str);
    let score = 0;
    map.forEach((row, i) => {
      row.forEach((tree, j) => {
        score = Math.max(score, Solution.scenicScore(tree, i, j, map));
      });
    });
    return score;
  }
}

export default function solution() {
  const str = fs.readFileSync(path.resolve(__dirname, 'input2.txt')).toString();

  const res = Solution.processPart1(str);
  console.log('2022-day8, number of trees visible:', res);

  const res_part2 = Solution.processPart2(str);
  console.log('2022-day8, best scenic score:', res_part2);
}
