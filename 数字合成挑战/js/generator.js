const Generator = (() => {

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = rand(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function pickRandom(arr) {
    return arr[rand(0, arr.length - 1)];
  }

  function getDivisors(n) {
    const d = [];
    for (let i = 1; i <= Math.abs(n); i++) {
      if (n % i === 0) d.push(i);
    }
    return d;
  }

  function generate(target, numCount, maxNum) {
    let values = [target];
    const solutionSteps = [];

    for (let i = 0; i < numCount - 1; i++) {
      const idx = rand(0, values.length - 1);
      const a = values[idx];
      values.splice(idx, 1);

      const ops = ['+', '-', '*', '/'];
      let b, c, op, success = false;

      for (let attempt = 0; attempt < 50 && !success; attempt++) {
        op = pickRandom(ops);
        b = rand(1, maxNum);

        switch (op) {
          case '+':
            c = a - b;
            break;
          case '-':
            c = a + b;
            break;
          case '*': {
            const divisors = getDivisors(a).filter(d => d !== 1 && d <= maxNum);
            if (divisors.length === 0) { attempt--; continue; }
            b = pickRandom(divisors);
            c = a / b;
            break;
          }
          case '/':
            c = a * b;
            break;
        }

        if (Number.isInteger(c) && c >= 1 && c <= maxNum &&
            b >= 1 && b <= maxNum && b !== c) {
          success = true;
        }
      }

      if (!success) {
        let tries2 = 0;
        while (!success && tries2 < 50) {
          op = pickRandom(['+', '-']);
          b = rand(1, maxNum);
          c = op === '+' ? a - b : a + b;
          if (Number.isInteger(c) && c >= 1 && c <= maxNum && b !== c) {
            success = true;
          }
          tries2++;
        }
      }

      values.push(b, c);
      solutionSteps.push({ op, a, b, c, result: a });
    }

    return {
      numbers: shuffle(values),
      solution: solutionSteps,
    };
  }

  return { generate };
})();
