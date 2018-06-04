import ft from '../src/';

const setBodyFontSize = value => (document.body.style.fontSize = value);
const removeBodyStyles = () => (document.body.style = {});

beforeEach(() => {
  setBodyFontSize('16px');
});

test('requires "base font" on <body />', () => {
  removeBodyStyles();

  expect(() => {
    ft('padding', [10, 20]);
  }).toThrowError('not found');
});

test('requires "base font" of 16px', () => {
  setBodyFontSize('10px');

  expect(() => {
    ft('padding', [10, 20]);
  }).toThrowError('font-size is not 16px');
});

test('requires "unit" to be defined', () => {
  expect(() => {
    ft(undefined, [10, 20]);
  }).toThrowError('is not defined');
});

test('requires "unit" to be a "string"', () => {
  expect(() => {
    ft(100, [10, 20]);
  }).toThrowError('is not of type "string"');
});

[
  { reference: 'min', sizes: [undefined, 20] },
  { reference: 'max', sizes: [10, undefined] },
].forEach(({ reference, sizes }) => {
  test(`requires "${reference}" to be defined`, () => {
    expect(() => {
      ft('padding', sizes);
    }).toThrowError('is not defined');
  });
});

[{ reference: 'min', sizes: ['10', 20] }, { reference: 'max', sizes: [10, '20'] }].forEach(
  ({ reference, sizes }) => {
    test(`requires "${reference}" to be a "number"`, () => {
      expect(() => {
        ft('padding', sizes);
      }).toThrowError('not of type "number"');
    });
  }
);

[{ reference: 'min', sizes: [10 / 0, 20] }, { reference: 'max', sizes: [10, 20 / 0] }].forEach(
  ({ reference, sizes }) => {
    test(`requires "${reference}" to be "finite"`, () => {
      expect(() => {
        ft('padding', sizes);
      }).toThrowError('is an "infinite" value');
    });
  }
);

test('should replicate "string" measurements verbatim', () => {
  const result = ft('padding', 'auto');
  expect(result).toMatch(`
padding: auto;
`);
});

test('should convert "number" measurements into "rems"', () => {
  const result = ft('padding', 16);
  expect(result).toMatch(`
padding: 1rem;
`);
});

test('should create a single declaration in the correct format', () => {
  const result = ft('padding', [10, 20]);
  expect(result).toMatch(`
padding: 0.625rem;

@media (min-width: 30rem) {
  padding: 2.0833333333333335vw;
}

@media (min-width: 60rem) {
  padding: 1.25rem;
}
`);
});

test('should create a multi declaration in the correct format', () => {
  const result = ft('padding', { top: [10, 20], right: 5, bottom: [15, 25], left: 'auto' });
  expect(result).toMatch(`
padding-top: 0.625rem;

@media (min-width: 30rem) {
  padding-top: 2.0833333333333335vw;
}

@media (min-width: 60rem) {
  padding-top: 1.25rem;
}

padding-right: 0.3125rem;

padding-bottom: 0.9375rem;

@media (min-width: 30rem) {
  padding-bottom: 3.125vw;
}

@media (min-width: 50rem) {
  padding-bottom: 1.5625rem;
}

padding-left: auto;
`);
});
