# Fish Tacos

## What

This module complements the **react** and **styled-components** libraries to create an API that removes the cognitive load and arduous boilerplate associated with responsive scenarios.

[![depends on styled-components](https://user-images.githubusercontent.com/15273233/40872099-ab686562-669c-11e8-8b7f-0d70f87280cb.png)](https://www.styled-components.com/)

[![depends on react](https://user-images.githubusercontent.com/15273233/40872100-ae1d736a-669c-11e8-965a-3ce06fbd872d.png)](https://reactjs.org/)

[![typescript](https://user-images.githubusercontent.com/15273233/40872275-a61d4660-669f-11e8-8edf-860f1947759f.png)](https://www.typescriptlang.org/)

[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![code style prettier](https://img.shields.io/badge/code_style-prettier-FF69A4.svg)](https://prettier.io/)

## Why

Setting a `min-width` and `max-width` on your elements is a great way to create **fluid** layouts that adhere to **responsive** methodologies.

Unfortunately `min-*` and `max-*` declarations are not supported natively in **CSS** for things like `font-size`, `padding`, `margin`, etc. These properties would benefit greatly from this functionality to help make content more accessible to a wider range of device sizes.

**This module addresses the scenarios where:**

* Users can experience jarring layout reflows as various breakpoints are triggered forcing abrupt changes to **CSS** values.

* Percentage based values _(referencing things like **viewport** or an **element container**)_ can encounter cases where values scale to exaggerated limits _(both **big** and **small**)_ due to the absence of _Minimum_ and _Maximum_ thresholds.

## Demo

[This demo](https://codepen.io/DevonChurch/project/live/DeJWLQ/) retro fits several **Bootstrap** components with the fluid resizing system this module offers. Resize the window to see the responsive measurement declarations scale _up_ / _down_ while staying within the limits of their thresholds.

![fish-tacos](https://user-images.githubusercontent.com/15273233/40871976-3008e8d0-669a-11e8-99b1-66955a994286.gif)

## Installation

Install the module from **NPM** .

```
npm install --save fish-tacos
```

Import the module into your project.

```javascript
import ft from "fish-tacos";
```

## Usage

The API is very simple. Specify the **CSS property** that you want to change and supply a _Minimum_ and _Maximum_ threshold to restrict scaling.

Because designers like to supply their measurements in **pixel** based units our API uses pixels as the base target and converts them into **REM**'s in the final output. This gives styles an enhanced level of accessibility _(with dynamic font scaling)_ while making **design** and **development** collaboration easier.

The result is pure, static **CSS**. This means the fluid scaling is based on native browser functionality and therefore performant.

### Basic

```javascript
ft("font-size", [20, 32]);
```

_The above declaration will create the following vanilla **CSS**:_

```css
font-size: 1.25rem;

@media (min-width: 480px) {
  font-size: 4.166666666666667vw;
}

@media (min-width: 768px) {
  font-size: 2rem;
}
```

### Verbose

If you want to target a property that uses `top`, `right`, `bottom` and `left` references for more granularity you can use the more verbose permutation below.

```javascript
ft("margin", { top: [30, 60], bottom: [10, 30] });
```

_The above declaration will create the following vanilla **CSS**:_

```css
margin-top: 1.875rem;

@media (min-width: 480px) {
  margin-top: 6.25vw;
}

@media (min-width: 960px) {
  margin-top: 3.75rem;
}

margin-bottom: 0.625rem;

@media (min-width: 480px) {
  margin-bottom: 2.0833333333333335vw;
}

@media (min-width: 1439.9999999999998px) {
  margin-bottom: 1.875rem;
}
```

### Example

Integrating this module into your existing workflow is as easy as swapping out a standard **CSS** _property_ / _value_ declaration for the new API.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import ft from "fish-tacos";

const Heading1 = styled.h1`
  ${ft("font-size", [30, 50])} ${ft("margin", {
    top: [30, 60],
    bottom: [10, 30]
  })};
`;

ReactDOM.render(
  <Heading1>Hello World</Heading1>,
  document.getElementById("app")
);
```

## License

MIT
