# React Plasmid Visualization

This is a React conversion of the Angular Plasmid visualization component from the [vixis/angularplasmid](https://github.com/vixis/angularplasmid) repository.

## Overview

The original Angular directives have been converted to modern React functional components using hooks:

- `plasmid` → `Plasmid`
- `plasmidtrack` → `PlasmidTrack`
- `trackmarker` → `TrackMarker`
- `trackscale` → `TrackScale`
- `tracklabel` → `TrackLabel`
- `markerlabel` → `MarkerLabel`

## Features

- SVG-based circular plasmid visualization
- Interactive markers with click handlers
- Configurable scales and labels
- Arrow support for directional markers
- Path-based text labels that follow curves
- Full TypeScript support

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

This will start the development server and open the application in your browser.

## Usage

```jsx
import { Plasmid, PlasmidTrack, TrackMarker, TrackLabel, MarkerLabel } from './components';

function MyPlasmid() {
  return (
    <Plasmid sequencelength="1000" plasmidheight="400" plasmidwidth="400">
      <PlasmidTrack radius="150" width="20">
        <TrackLabel text="My Plasmid" />
        <TrackMarker start="100" end="200" markerstyle="fill:red">
          <MarkerLabel text="Gene A" />
        </TrackMarker>
      </PlasmidTrack>
    </Plasmid>
  );
}
```

## Components

### Plasmid
Main container component that creates the SVG canvas.

**Props:**
- `plasmidheight` - Height of the SVG canvas
- `plasmidwidth` - Width of the SVG canvas  
- `sequencelength` - Total length of the plasmid sequence
- `sequence` - Optional DNA sequence string
- `plasmidclass` - CSS class for styling
- `plasmidstyle` - Inline styles

### PlasmidTrack
Creates a circular track (ring) on the plasmid.

**Props:**
- `radius` - Distance from center to inner edge of track
- `width` - Width of the track ring
- `trackclass` - CSS class for styling
- `trackstyle` - Inline styles
- `trackclick` - Click event handler

### TrackMarker
Draws markers (features) on a track.

**Props:**
- `start` - Start position on sequence
- `end` - End position on sequence (optional, defaults to start)
- `vadjust` - Vertical adjustment from track
- `wadjust` - Width adjustment
- `arrowstartlength`, `arrowstartwidth`, `arrowstartangle` - Start arrow properties
- `arrowendlength`, `arrowendwidth`, `arrowendangle` - End arrow properties
- `markerclass` - CSS class for styling
- `markerstyle` - Inline styles
- `markerclick` - Click event handler

### TrackScale
Adds scale markings to a track.

**Props:**
- `interval` - Spacing between scale marks
- `ticksize` - Length of tick marks
- `direction` - 'in' or 'out' for tick direction
- `showlabels` - Whether to show numeric labels
- `labelvadjust` - Label position adjustment
- `tickclass`, `labelclass` - CSS classes
- `tickstyle`, `labelstyle` - Inline styles

### TrackLabel
Adds text labels to tracks.

**Props:**
- `text` - Label text
- `hadjust`, `vadjust` - Position adjustments
- `labelclass` - CSS class
- `labelstyle` - Inline styles
- `labelclick` - Click event handler

### MarkerLabel
Adds labels to markers with advanced positioning.

**Props:**
- `text` - Label text
- `type` - 'path' for curved text following marker arc
- `halign` - Horizontal alignment ('start', 'middle', 'end')
- `valign` - Vertical alignment ('inner', 'middle', 'outer')
- `hadjust`, `vadjust` - Position adjustments
- `showline` - Whether to show connecting line
- `linestyle`, `lineclass` - Line styling
- `labelstyle`, `labelclass` - Label styling
- `labelclick` - Click event handler

## Examples

The application includes two example plasmids:

1. **First Example (pHS1)** - Complex plasmid with multiple features, primers, and regions
2. **pUC19 Example** - Simple plasmid showing basic usage

## Compatibility

This React version maintains full visual and functional compatibility with the original Angular version, producing identical SVG output and supporting all the same features and styling options.
