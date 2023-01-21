import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function preprocess(str: string) {
  const elves = str.split('\n\n');
  const elves_list = elves.map((t) => t.split('\n'));
  const elves_list_numeric = elves_list.map((t) => t.map(Number));
  const elves_total = elves_list_numeric.map((t) => t.reduce((a, t) => a + t));
  return elves_total;
}

function process_part1(str: string) {
  const list = preprocess(str);
  return Math.max(...list);
}

function process_part2(str: string) {
  const list = preprocess(str).sort().slice(-3);
  return list.reduce((a, t) => a + t);
}

export default function solution() {
  const str = fs.readFileSync(path.resolve(__dirname, 'input2.txt')).toString();

  const res = process_part1(str);
  console.log('2022-day1, most calories carried by a single elf:', res);

  const res_part2 = process_part2(str);
  console.log(
    '2022-day1, total calories carried by the three elves carrying the most calories:',
    res_part2
  );
}
