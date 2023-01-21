import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface File {
  name: string;
  size: number;
}

interface Folder {
  name: string;
  size: number;
  folders: Folder[];
  files: File[];
  parent: Folder | null;
}

class Solution {
  static process(str: string, part2: boolean = false) {
    const root: Folder = {
      name: '/',
      size: 0,
      folders: [],
      files: [],
      parent: null
    };
    let current = root;

    const descend = (name: string) => {
      for (let i = 0; i < current.folders.length; i++) {
        if (current.folders[i].name === name) {
          current = current.folders[i];
          return;
        }
      }
    };

    const ascend = () => {
      if (current.parent) current = current.parent;
    };

    const top = () => {
      current = root;
    };

    const addFile = (name: string, size: number) => {
      const file = {
        name,
        size
      };
      current.files.push(file);
    };

    const addFolder = (name: string) => {
      const folder = {
        name,
        size: 0,
        folders: [],
        files: [],
        parent: current
      };
      current.folders.push(folder);
    };

    const process = (cmd: string): string => {
      if (cmd.length < 1) return '';

      if (cmd.charAt(0) === '$') {
        const c = cmd.replace('$ ', '');
        if (c === 'ls') {
          return 'ls';
        } else {
          const d = c.split(' ');
          if (d[1] === '/') {
            top();
            return 'top';
          } else if (d[1] === '..') {
            ascend();
            return 'ascend';
          } else {
            descend(d[1]);
            return 'descend: ' + d[1];
          }
        }
      } else if (
        cmd.charCodeAt(0) >= '0'.charCodeAt(0) &&
        cmd.charCodeAt(0) <= '9'.charCodeAt(0)
      ) {
        const c = cmd.split(' ');
        addFile(c[1], parseInt(c[0]));
        return 'addFile: ' + c[1] + ' ' + parseInt(c[0]);
      } else if (cmd.substring(0, 4) === 'dir ') {
        const c = cmd.split(' ');
        addFolder(c[1]);
        return 'addFolder: ' + c[1];
      }

      return '';
    };

    let list: string[] = str.split('\n');
    // let res =
    list.forEach((l) => [l, process(l)]);

    const populateSizes = (node: Folder) => {
      let size = 0;
      node.folders.forEach((f) => {
        size += populateSizes(f);
      });
      node.files.forEach((f) => {
        size += f.size;
      });
      node.size = size;
      return size;
    };
    populateSizes(root);

    if (!part2) {
      const calculate = (node: Folder) => {
        let total = 0;
        if (node.size <= 100000) {
          total += node.size;
        }
        node.folders.forEach((f) => {
          total += calculate(f);
        });
        return total;
      };

      return calculate(root);
    } else {
      const total = 70000000;
      const used = root.size;
      const available = total - used;
      const required = 30000000 - available;

      const folders: Array<Array<number | string>> = [];
      const populate = (node: Folder) => {
        folders.push([node.name, node.size]);
        node.folders.forEach((f) => {
          populate(f);
        });
      };
      populate(root);
      folders.sort((a, b) => {
        return <number>a[1] - <number>b[1];
      });
      for (let i = 0; i < folders.length; i++) {
        if (<number>folders[i][1] >= required) {
          return folders[i];
        }
      }
      return [];
    }
  }
}

export default function solution() {
  const str = fs.readFileSync(path.resolve(__dirname, 'input2.txt')).toString();

  const res = Solution.process(str);
  console.log(
    '2022-day7, sum of all folders with contents not exceeding 100000:',
    res
  );

  const res_part2 = Solution.process(str, true);
  console.log('2022-day7, delete folder:', res_part2);
}
