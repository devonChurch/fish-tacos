// Formula (A):
//     ｡ -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ｡
//     ¦                                                                      ¦
//     ¦     Current Breakpoint (px)                                          ¦
//     ¦     -----------------------  =  Pixels Per Viewport (vw : px)        ¦
//     ¦              100                                                     ¦
//     ¦                                                                      ¦
//     ° -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- °
//
// Formula (B):
//     ｡ -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ｡
//     ¦                                                                      ¦
//     ¦        Element Value (px)                                            ¦
//     ¦     ------------------------  =  Viewport Units (vw)                 ¦
//     ¦     Pixels Per Viewport Unit                                         ¦
//     ¦                                                                      ¦
//     ° -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- °
//
//
// @exmaple
//
// We have a minimum 'font-size' value of 10px and a maximum of 30px.
//
// We need to find...
//
// + The number of pixels a single viewpoint unit represents at the 'small'
//   breakpoint.
//
// + The total viewport units (vw) to assign at the 'small' breakpoint which will
//   represent the minimum 'px' value at that breakpoint and begin the scale to
//   the maximum value as the browser width increases.
//
// + The breakpoint in which the maximum value will be reached (so that we can
//   STOP scaling the value against the browser width).
//
// Formula (A):
// 600 / 100 = 6 // 6px for every 1vw unit at a breakpoint of 600px.
//
// Formula (B):
// 10 / 6 = 1.6 // 1.6vw represents 10px (minimum font-size) at a breakpoint of
//              // 600px.
//
// Formula (B) - rearranged:
// 30 / 1.6 = 18 // 18px represents the number of pixels per 1 viewpoint unit (vw)
//               // when the maximum font-size value is reached.
//
// Formula (A) - rearranged:
// 100 * 18 = 1800 // 1800px represents the breakpoint width that would reach the
//                 // maximum font-size so that we can reassign it to a static
//                 // value to stop scaling against the browser width.
//
// Result (to be injected into a styled-component):
//     ｡ -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ｡
//     ¦                                                                      ¦
//     ¦     font-size: 0.625rem; // 10px                                     ¦
//     ¦                                                                      ¦
//     ¦     @media all and (min-width: 37.5rem) { // 600px                  ¦
//     ¦       font-size: 1.6vw;                                              ¦
//     ¦     }                                                                ¦
//     ¦                                                                      ¦
//     ¦     @media all and (min-width: 106.25rem) { // 1700px               ¦
//     ¦       font-size: 1.875rem; // 30px                                   ¦
//     ¦     }                                                                ¦
//     ¦                                                                      ¦
//     ° -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- °

interface MultiMinMax {
  [key: string]: [number, number];
}

const BASE_FONT = 16;

const logPrefix = '[fish-tacos]';

const testBaseFontSize = (): number | boolean => {
  const bodyNode = document.querySelector('body');
  const { fontSize } = window.getComputedStyle(bodyNode);
  const rawPixels = parseInt(fontSize, 10);
  const isNotValue = !fontSize && isNaN(rawPixels);
  const isNot16px = rawPixels !== BASE_FONT;

  if (isNotValue) throw `${logPrefix} font-size on <body /> not found`;
  else if (isNot16px)
    throw `${logPrefix} <body /> font-size is not 16px (all calculations are based on this assumption)`;

  return !(isNotValue && isNot16px);
};

const createRem = (pixels: number): string => `${pixels / BASE_FONT}rem`;

const createDynamicValues = (unit: string, [min, max]: [number, number]): string => {
  const breakpointMin = 480;
  const breakpointRatio = 100;
  const viewportRatioMin = breakpointMin / breakpointRatio;
  const viewportWidth = min / viewportRatioMin;
  const viewportRatioMax = max / viewportWidth;
  const breakpointMax = breakpointRatio * viewportRatioMax;

  // NOTE: Make sure the template literal is pushed up flush to the margin so that
  // there is no ambiguity regarding spacing when evaluating against our Jest tests.
  return `
${unit}: ${createRem(min)};

@media (min-width: ${createRem(breakpointMin)}) {
  ${unit}: ${viewportWidth}vw;
}

@media (min-width: ${createRem(breakpointMax)}) {
  ${unit}: ${createRem(max)};
}
`;
};

const testIsArray = value => Array.isArray(value);

const testIsString = value => typeof value === 'string';

const testIsNumber = value => typeof value === 'number';

const testIsUnitRelevant = (unit: string): boolean => {
  const isNotUnit = !unit;
  const isNotString = unit && !testIsString(unit);

  if (isNotUnit) throw `${logPrefix} "unit" parameter is not defined`;
  else if (isNotString) throw `${logPrefix} "unit" parameter is not of type "string"`;

  return !(isNotUnit && isNotString);
};

const testIsSizeRelevant = (size: number, reference: string): boolean => {
  const isNotValue = !size;
  const isNotNumber = size && !testIsNumber(size);
  const isNotFinite = !isNotNumber && !isFinite(size);

  if (isNotValue) throw `${logPrefix} "${reference}" parameter is not defined`;
  else if (isNotNumber) throw `${logPrefix} "${reference}" parameter is not of type "number"`;
  else if (isNotFinite) throw `${logPrefix} "${reference}" parameter is an "infinite" value`;

  return !(isNotValue && isNotNumber && isNotFinite);
};

const testMinMaxSizes = ([min, max]: [number, number]): boolean =>
  testIsSizeRelevant(min, 'min') && testIsSizeRelevant(max, 'max');

const testIsSingleDeclaration = (sizes: [number, number] | string | number) =>
  testIsArray(sizes) || testIsString(sizes) || testIsNumber(sizes);

const createSingleDeclaration = (unit: string, sizes: any): string => {
  // prettier-ignore
  switch (true) {
    case testIsString(sizes): return `\n${unit}: ${sizes};\n`;
    case testIsNumber(sizes): return `\n${unit}: ${createRem(sizes)};\n`;
    case testIsArray(sizes) && testMinMaxSizes(sizes): return createDynamicValues(unit, sizes);
    default: return '';
  }
};

// Flatten from { 'top.bottom': [5, 10] } into { top: [5, 10], bottom: [5, 10] }.
const createFlattenedSizes = (keys: string, sizes: MultiMinMax) =>
  keys.split(',').reduce((acc, key) => ({ ...acc, [key]: sizes[keys] }), {});

const createMultipleDeclaretions = (unit: string, sizes: MultiMinMax): string => {
  const flattenedSizes = Object.keys(sizes).reduce(
    (acc, keys) => ({ ...acc, ...createFlattenedSizes(keys, sizes) }),
    {}
  );

  return Object.keys(flattenedSizes).reduce(
    (acc, key) => `${acc}${createSingleDeclaration(`${unit}-${key}`, flattenedSizes[key])}`,
    ''
  );
};

const init = (unit: string, sizes: any): string => {
  const isBaseFontSize = testBaseFontSize();
  const isUnitRelevant = testIsUnitRelevant(unit);

  // prettier-ignore
  switch (true) {
    case !isBaseFontSize || !isUnitRelevant: return '';
    case testIsSingleDeclaration(sizes): return createSingleDeclaration(unit, sizes);
    default: return createMultipleDeclaretions(unit, sizes);
  }
};

export default init;
