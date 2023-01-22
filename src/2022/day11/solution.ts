import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Monkey {
  items: number[];
  operator: string;
  operand: number | string;
  test_operand: number;
  monkey_id_test_true: number;
  monkey_id_test_false: number;
  inspection_count: number;
}

class Solution {
  static monkeys: Map<number, Monkey> = new Map();

  static createMonkeys(list: string[]) {
    Solution.monkeys.clear();

    list.forEach((item) => {
      const info = item.split('\n').map((i) => i.trim());
      const monkey: Monkey = {
        items: [],
        operator: '',
        operand: 0,
        test_operand: 0,
        monkey_id_test_true: 0,
        monkey_id_test_false: 0,
        inspection_count: 0
      };
      const id = parseInt(info[0].replace('Monkey ', '').replace(':', ''));
      monkey.items = info[1]
        .replace('Starting items: ', '')
        .split(', ')
        .map(Number);
      const operation = info[2].replace('Operation: new = old ', '').split(' ');
      monkey.operator = operation[0];
      monkey.operand = operation[1] === 'old' ? 'old' : parseInt(operation[1]);
      monkey.test_operand = parseInt(
        info[3].replace('Test: divisible by ', '')
      );
      monkey.monkey_id_test_true = parseInt(
        info[4].replace('If true: throw to monkey ', '')
      );
      monkey.monkey_id_test_false = parseInt(
        info[5].replace('If false: throw to monkey ', '')
      );
      Solution.monkeys.set(id, monkey);
    });
    // console.log(Solution.monkeys);
    // process.exit();
  }

  static performRound(divisor: number, modulus: number) {
    const getOperand = (monkey: Monkey, item: number): number => {
      return monkey.operand === 'old' ? item : <number>monkey.operand;
    };
    Solution.monkeys.forEach((monkey) => {
      while (monkey.items.length > 0) {
        let item = monkey.items.splice(0, 1)[0];
        monkey.inspection_count++;

        const operand = getOperand(monkey, item);
        switch (monkey.operator) {
          case '*':
            item *= operand;
            break;
          case '+':
            item += operand;
            break;
          case '-':
            item -= operand;
            break;
        }
        item = Math.floor(item / divisor);
        item %= modulus;

        Solution.monkeys
          .get(
            item % monkey.test_operand === 0
              ? monkey.monkey_id_test_true
              : monkey.monkey_id_test_false
          )
          ?.items.push(item);
      }
    });
  }

  static _process(str: string, rounds: number, divisor: number) {
    Solution.createMonkeys(str.split('\n\n'));

    const modulus = Array.from(Solution.monkeys)
      .map((m) => m[1].test_operand)
      .reduce((a, t) => a * t);

    for (let i = 0; i < rounds; i++) Solution.performRound(divisor, modulus);

    const monkeyBusiness = Array.from(Solution.monkeys)
      .map((m) => m[1].inspection_count)
      .sort((a, b) => a - b)
      .slice(-2);

    return monkeyBusiness[0] * monkeyBusiness[1];
  }

  static process(file: string) {
    const str = fs.readFileSync(path.resolve(__dirname, file)).toString();

    const res = Solution._process(str, 20, 3);
    console.log(`2022-day11, ${file}, level of monkey business:`, res);

    const res_part2 = Solution._process(str, 10000, 1);
    console.log(`2022-day11, ${file}, level of monkey business:`, res_part2);
  }
}

export default function solution() {
  Solution.process('input1.txt');
  Solution.process('input2.txt');
}
