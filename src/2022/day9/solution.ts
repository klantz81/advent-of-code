import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Point {
  x: number;
  y: number;
}
interface Head {
  location: Point;
}
interface Tail {
  location: Point;
  visitedLocations: Set<string>; // `${x},${y}`
}
interface Instruction {
  direction: Point;
  count: number;
}

class Solution {
  static getInstructions(str: string) {
    const instructions: Instruction[] = [];

    const list = str.split('\n');
    list.forEach((l) => {
      const ll = l.split(' ');
      const p: Point =
        ll[0] === 'R'
          ? { x: 1, y: 0 }
          : ll[0] === 'L'
          ? { x: -1, y: 0 }
          : ll[0] === 'D'
          ? { x: 0, y: -1 }
          : ll[0] === 'U'
          ? { x: 0, y: 1 }
          : { x: 0, y: 0 };
      instructions.push({ direction: p, count: parseInt(ll[1]) });
    });

    return instructions;
  }
  static updateTail(head: Head | Tail, tail: Tail) {
    if (
      head.location.x === tail.location.x &&
      head.location.y === tail.location.y
    )
      return;

    let direction: Point = { x: 0, y: 0 };

    if (head.location.x === tail.location.x) {
      //same column
      if (Math.abs(head.location.y - tail.location.y) <= 1) return;
      direction = {
        x: 0,
        y: head.location.y > tail.location.y ? 1 : -1
      };
    } else if (head.location.y === tail.location.y) {
      //same row
      if (Math.abs(head.location.x - tail.location.x) <= 1) return;
      direction = {
        x: head.location.x > tail.location.x ? 1 : -1,
        y: 0
      };
    } else {
      //diagonal
      if (
        Math.abs(head.location.x - tail.location.x) <= 1 &&
        Math.abs(head.location.y - tail.location.y) <= 1
      )
        return;
      direction = {
        x: head.location.x > tail.location.x ? 1 : -1,
        y: head.location.y > tail.location.y ? 1 : -1
      };
    }

    tail.location.x += direction.x;
    tail.location.y += direction.y;
    tail.visitedLocations.add(`${tail.location.x},${tail.location.y}`);
  }
  static processInstruction(
    instruction: Instruction,
    head: Head,
    tail: Tail[]
  ) {
    for (let i = 0; i < instruction.count; i++) {
      head.location.x += instruction.direction.x;
      head.location.y += instruction.direction.y;
      Solution.updateTail(head, tail[0]);
      for (let j = 0; j < tail.length - 1; j++)
        Solution.updateTail(tail[j], tail[j + 1]);
    }
  }
  static process(str: string, count: number) {
    const instructions = Solution.getInstructions(str);

    const head: Head = { location: { x: 0, y: 0 } };
    const tail: Tail[] = [];
    for (let i = 0; i < count; i++) {
      const t: Tail = {
        location: { x: 0, y: 0 },
        visitedLocations: new Set()
      };
      t.visitedLocations.add('0,0');
      tail.push(t);
    }

    instructions.forEach((i) => {
      Solution.processInstruction(i, head, tail);
    });

    return tail[count - 1].visitedLocations.size;
  }
}

export default function solution() {
  const str = fs.readFileSync(path.resolve(__dirname, 'input2.txt')).toString();

  const res = Solution.process(str, 1);
  console.log('2022-day9, number of locations visited by tail:', res);

  const res_part2 = Solution.process(str, 9);
  console.log('2022-day9, number of locations visited by tail 9:', res_part2);
}
