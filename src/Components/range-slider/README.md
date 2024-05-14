## Range Slider

- Will select a value from a range
- Check `collage-config.jsx` of UI kit for implementation

### Features

- It has min, max and default value
- User can select value with in slider

### Installation

Add Range slider to your project by executing `npm install @attosol/react-ui-kit`

### Usage

Here's an example of basic usage:

```js
import React from "react";
import RangeSlider from "../../range-slider";

class CollagePage extends Component {
  componentDidMount() {
    // show collage config
    this.showCollageConfig();
  }

  render() {
    return (
      <RangeSlider
        label="Vertical Padding"
        min={15}
        max={100}
        value={25}
        updateRangeSliderValue={(e) => {}}
      />
    );
  }
}
```

## User guide

#### Props

| Name         | Description                                       | Default value       | Example values      |
| ------------ | ------------------------------------------------- | ------------------- | ------------------- |
| label        | Lable to show in range slider                     |                     | `Select Rows`       |
| min          | Minimum value for slider                          | `0`                 | `15`                |
| max          | Maximum value for slider                          | `10`                | `150`               |
| value        | Default value for slider                          | `5`                 | `100`              |
| updateRangeSliderValue | Function after value change             | `(res => {})`       |                     |

## label

- label to show in range slider

```js
label: "Select number of rows";
```

## min

- minimum value for range slider

```js
min: 40;
```

## max

- Maximum value for range slider

```js
max: 200;
```

## title

- set modal title

```js
title: title;
```

## value

- rRange slider default value

```js
value: 50;
```

## updateRangeSliderValue

- Executes on range slider value change

```js
updateRangeSliderValue: (event) => {};
```
