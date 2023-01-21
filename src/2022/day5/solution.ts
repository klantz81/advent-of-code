import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Instruction {
  quantity: number;
  source: number;
  destination: number;
}

class Solution {
  static getInstructions(str: string) {
    const [_configuration, instructions_list] = str.split('\n\n');
    const instructions: Instruction[] = instructions_list
      .split('\n')
      .map((i) =>
        i.replace('move ', '').replace('from', 'to').split(' to ').map(Number)
      )
      .map((i) => ({ quantity: i[0], source: i[1], destination: i[2] }));
    return instructions;
  }

  static getIndices(str: string) {
    const [configuration] = str.split('\n\n');
    const indices = configuration
      .split('\n')
      .splice(-1)[0]
      .replaceAll('   ', '-')
      .replaceAll(' ', '')
      .split('-')
      .map(Number);
    return indices;
  }

  static getStacks(str: string, indices: number[]) {
    const [configuration] = str.split('\n\n');

    const stacks = new Map();

    const offsets = indices.map((_i, j) => j * 4 + 1);
    indices.forEach((i) => {
      stacks.set(i, []);
    });

    configuration
      .split('\n')
      .reverse()
      .splice(1)
      .forEach((row) => {
        indices.forEach((index, i) => {
          const st = stacks.get(index);
          const offset = offsets[i];
          //get crate in "row" at "offset"
          const c = row.slice(offset, offset + 1).replace(' ', '');
          if (c.length > 0) {
            st.push(c);
            stacks.set(index, st);
          }
        });
      });

    return stacks;
  }

  static processInstructions(
    stacks: Map<number, string[]>,
    instructions: Instruction[]
  ) {
    instructions.forEach((i) => {
      let source = stacks.get(i.source);
      let destination = stacks.get(i.destination);

      if (!source || !destination) return;

      destination = destination.concat(source.splice(-i.quantity).reverse());

      stacks.set(i.source, source);
      stacks.set(i.destination, destination);
    });
  }

  static processInstructions9001(
    stacks: Map<number, string[]>,
    instructions: Instruction[]
  ) {
    instructions.forEach((i) => {
      let source = stacks.get(i.source);
      let destination = stacks.get(i.destination);

      if (!source || !destination) return;

      destination = destination.concat(source.splice(-i.quantity));

      stacks.set(i.source, source);
      stacks.set(i.destination, destination);
    });
  }

  static formatResult(
    stacks: Map<number, string[]>,
    indices: number[]
  ): string {
    const arr: string[] = [];
    indices.forEach((i) => {
      const stack = stacks.get(i);
      if (!stack) return;

      const c = stack.pop();
      if (c) arr.push(c);
    });
    return arr.join('');
  }

  static processPart1(str: string) {
    const instructions: Instruction[] = Solution.getInstructions(str);
    const indices = Solution.getIndices(str);
    const stacks = Solution.getStacks(str, indices);

    Solution.processInstructions(stacks, instructions);

    return Solution.formatResult(stacks, indices);
  }

  static processPart2(str: string) {
    const instructions: Instruction[] = Solution.getInstructions(str);
    const indices = Solution.getIndices(str);
    const stacks = Solution.getStacks(str, indices);

    Solution.processInstructions9001(stacks, instructions);

    return Solution.formatResult(stacks, indices);
  }
}

export default function solution() {
  const str = fs.readFileSync(path.resolve(__dirname, 'input2.txt')).toString();

  const res = Solution.processPart1(str);
  console.log('2022-day5, crates on top:', res);

  const res_part2 = Solution.processPart2(str);
  console.log('2022-day5, crates on top, CrateMover 9001:', res_part2);
}
