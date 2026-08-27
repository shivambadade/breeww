const RESULT_META = {
  0: { color: 'Violet', size: 'Small' },
  1: { color: 'Green', size: 'Small' },
  2: { color: 'Red', size: 'Small' },
  3: { color: 'Green', size: 'Small' },
  4: { color: 'Red', size: 'Small' },
  5: { color: 'Violet', size: 'Big' },
  6: { color: 'Red', size: 'Big' },
  7: { color: 'Green', size: 'Big' },
  8: { color: 'Red', size: 'Big' },
  9: { color: 'Green', size: 'Big' },
};

const toToken = (value) => String(value ?? '').trim().toLowerCase();

const toAmount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const describeColourResult = (result, extras = {}) => {
  const number = Number.parseInt(String(result ?? ''), 10);
  if (!Number.isInteger(number) || number < 0 || number > 9) {
    return null;
  }

  const meta = RESULT_META[number];
  return {
    ...extras,
    resultToken: String(number),
    number,
    color: meta.color,
    size: meta.size,
  };
};

export const normalizeColourBetOptionId = (bet) => {
  const optionId = toToken(bet.optionId);
  if (/^number:[0-9]$/.test(optionId)) return optionId;
  if (/^color:(green|red|violet)$/.test(optionId)) return optionId;
  if (/^size:(big|small)$/.test(optionId)) return optionId;

  const type = toToken(bet.type);
  const value = toToken(bet.value ?? bet.optionId);

  if ((type === 'color' || type === 'colour') && ['green', 'red', 'violet'].includes(value)) {
    return `color:${value}`;
  }

  if (type === 'size' && ['big', 'small'].includes(value)) {
    return `size:${value}`;
  }

  if (type === 'number' && /^[0-9]$/.test(value)) {
    return `number:${value}`;
  }

  if (/^[0-9]$/.test(value)) return `number:${value}`;
  if (['green', 'red', 'violet'].includes(value)) return `color:${value}`;
  if (['big', 'small'].includes(value)) return `size:${value}`;

  return null;
};

export const evaluateColourBets = (bets, result) => {
  const outcome = describeColourResult(result);
  if (!outcome) {
    return { outcome: null, resolvedBets: [], totalWon: 0 };
  }

  const winningOptions = new Map([
    [`number:${outcome.number}`, 9],
    [`color:${outcome.color.toLowerCase()}`, outcome.color === 'Violet' ? 4.5 : 2],
    [`size:${outcome.size.toLowerCase()}`, 2],
  ]);

  const resolvedBets = bets.map((bet) => {
    const optionId = normalizeColourBetOptionId(bet);
    const multiplier = winningOptions.get(optionId) || 0;
    const wonAmount = multiplier > 0 ? toAmount(bet.amount) * multiplier : 0;

    return {
      ...bet,
      optionId,
      isWin: multiplier > 0,
      wonAmount,
    };
  });

  const totalWon = resolvedBets.reduce((sum, bet) => sum + toAmount(bet.wonAmount), 0);
  return {
    outcome,
    resolvedBets,
    totalWon: Math.round(totalWon * 100) / 100,
  };
};
