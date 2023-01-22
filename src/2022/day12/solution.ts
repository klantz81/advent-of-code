import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Location {
  x: number;
  y: number;
  height?: number;
  g?: number;
  h?: number;
  f?: number;
  parent?: Location | null;
}

class Solution {
  static map: Map<string, Location> = new Map();
  static width = 0;
  static height = 0;
  static start: Location;
  static end: Location;

  static set(x: number, y: number, height: number) {
    Solution.map.set(`${x},${y}`, {
      x,
      y,
      height: height,
      g: 0,
      h: 0,
      f: 0,
      parent: null
    });
  }

  static get(x: number, y: number) {
    return (
      Solution.map.get(`${x},${y}`) ?? {
        x: 0,
        y: 0,
        height: 0,
        g: 0,
        h: 0,
        f: 0,
        parent: null
      }
    );
  }

  static reset() {
    Solution.map.forEach((n) => {
      n.g = n.h = n.f = 0;
      n.parent = null;
    });
  }

  static setup(str: string) {
    Solution.map.clear();
    str.split('\n').forEach((value, y) => {
      Solution.height = y + 1;
      value.split('').forEach((value, x) => {
        Solution.width = x + 1;

        const v = value === 'S' ? 'a' : value === 'E' ? 'z' : value;
        const height = v.charCodeAt(0) - 'a'.charCodeAt(0);

        Solution.set(x, y, height);

        if (value === 'S') {
          Solution.start = Solution.get(x, y);
        } else if (value === 'E') {
          Solution.end = Solution.get(x, y);
        }
      });
    });
  }

  static neighbors(node: Location) {
    const up: Location | null =
      node.y + 1 < Solution.height ? Solution.get(node.x, node.y + 1) : null;
    const down: Location | null =
      node.y - 1 >= 0 ? Solution.get(node.x, node.y - 1) : null;
    const left: Location | null =
      node.x - 1 >= 0 ? Solution.get(node.x - 1, node.y) : null;
    const right: Location | null =
      node.x + 1 < Solution.width ? Solution.get(node.x + 1, node.y) : null;

    const isValid = (l: Location) => {
      return <number>l.height - <number>node.height <= 1;
    };

    const neighbors: Location[] = [];
    if (up && isValid(up)) neighbors.push(up);
    if (down && isValid(down)) neighbors.push(down);
    if (left && isValid(left)) neighbors.push(left);
    if (right && isValid(right)) neighbors.push(right);
    return neighbors;
  }

  static search(start: Location) {
    Solution.reset();

    const openList: Location[] = [];
    const closedList: Location[] = [];
    openList.push(start);

    const listContains = (list: Location[], node: Location) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].x === node.x && list[i].y === node.y) return true;
      }
      return false;
    };

    while (openList.length > 0) {
      const current = openList
        .sort((a, b) => <number>a.f - <number>b.f)
        .splice(0, 1)[0];

      closedList.push(current);

      if (current === Solution.end) {
        let curr = current;
        let ret = [];
        while (curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        return ret.reverse();
      }

      const neighbors = Solution.neighbors(current);
      neighbors.forEach((n) => {
        if (listContains(closedList, n)) return;

        const g = <number>current.g + 1;
        let gBest = false;

        if (!listContains(openList, n)) {
          gBest = true;
          n.h = Math.abs(Solution.end.x - n.x) + Math.abs(Solution.end.y - n.y); //heuristic
          openList.push(n);
        } else if (g < <number>n.g) {
          gBest = true;
        }

        if (gBest) {
          n.parent = current;
          n.g = g;
          n.f = n.g + <number>n.h;
        }
      });
    }
    return [];
  }

  static findLowPoints() {
    return Array.from(Solution.map)
      .filter((n) => n[1].height === 0)
      .map((n) => n[1]);
  }

  static _process(str: string, part2: boolean = false) {
    Solution.setup(str);

    if (part2) {
      return Solution.findLowPoints()
        .map((n) => Solution.search(n).length)
        .filter((l) => l > 0)
        .sort((a, b) => b - a)
        .slice(-1)[0];
    } else {
      const r = Solution.search(Solution.start);
      return r.length;
    }
  }

  static process(file: string) {
    const str = fs.readFileSync(path.resolve(__dirname, file)).toString();

    const res = Solution._process(str);
    console.log(`2022-day11, ${file}, shortest number of steps:`, res);

    const res_part2 = Solution._process(str, true);
    console.log(
      `2022-day11, ${file}, shortest number of steps from any location at the lowest elevation:`,
      res_part2
    );
  }
}

export default function solution() {
  Solution.process('input1.txt');
  Solution.process('input2.txt');
}
