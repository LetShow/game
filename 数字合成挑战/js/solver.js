const Solver = (() => {
  const ops = ['+', '-', '*', '/'];

  function calc(a, op, b) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 && a % b === 0 ? a / b : null;
    }
  }

  function solve(nums, target) {
    const solutions = [];

    function dfs(arr, path) {
      if (arr.length === 1) {
        if (Math.abs(arr[0] - target) < 0.0001) {
          solutions.push([...path]);
        }
        return;
      }

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (i === j) continue;

          for (const op of ops) {
            const result = calc(arr[i], op, arr[j]);
            if (result === null) continue;

            const next = [];
            for (let k = 0; k < arr.length; k++) {
              if (k !== i && k !== j) next.push(arr[k]);
            }
            next.push(result);

            path.push({ a: arr[i], op, b: arr[j], result });
            dfs(next, path);
            path.pop();
          }
        }
      }
    }

    dfs(nums, []);
    return solutions;
  }

  return { solve };
})();
