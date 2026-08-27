---
title: Brand
description: The Sign in with Ethereum wordmark and icon, the files, the palette, the states they run, and the rules for using them.
outline: [2, 2]
---

# Brand

The mark is a grid. A 29 × 9 field with ink on rows 0, 2, 4, 6 and 8; the odd
rows are gaps, and that is what makes it read as a scan rather than as
lettering. 75 ink cells. Everything else on this site is derived from that one
decision: the cell is the unit, and section dividers are two hairlines a cell
apart because that is an ink row and its gap, at page scale.

<BrandKit />

## Files

| File | What it is |
| --- | --- |
| [`wordmark.svg`](/brand/wordmark.svg) | The mark. 29 × 9, 75 ink cells. |
| [`wordmark-field.svg`](/brand/wordmark-field.svg) | The mark inset two cells in a 33 × 13 field of lines. 231 cells, 75 of them ink. |
| [`icon.svg`](/brand/icon.svg) | The icon. 7 × 9, the wordmark's first glyph. |
| [`icon-e.svg`](/brand/icon-e.svg) | The icon read as Ξ. |
| [`icon-diamond.svg`](/brand/icon-diamond.svg) | The icon read as a diamond. |

Every file is geometry, not paths: plain `<rect>` elements on integer
coordinates. Scale them freely; they will never blur and they will never need a
raster fallback. Set `shape-rendering="crispEdges"` if you are drawing them at a
size where a cell lands on a half pixel.

## Using it

**Colour it, do not recolour it.** The cells inherit their fill, so a mark takes
whatever palette it sits in. That is the intended way to place it. Do not
introduce a second ink colour, a gradient, or a shadow.

**Do not redraw it.** No outline weights, no rounded cells, no letter-spacing.
The grid is the identity; a version with the gaps closed is a different mark.

**Give it room.** One cell of clear space on every side, minimum. The field
canvas already carries two.

**Small sizes go to the icon.** Below about 90 pixels wide the wordmark stops
being readable and the icon is the right call. The icon holds down to 7 pixels
wide because it has to say everything with geometry.

**The field canvas carries its own ground.** It reads as a screen, so it stays
dark whether the page around it is light or not. The bare mark has no ground and
should not be given one.

## Typography

Inter at 900 for headings, Geist Sans for prose, Geist Mono for labels, values,
code and anything a machine wrote. The headings are the one loud voice on the
page: the weight does the work, so they do not also need to be large. Geist
Mono is drawn on a grid with flat terminals, which is the same construction as
the mark, which is why it is here rather than a monospace chosen for looking
technical. All three faces are variable and self-hosted; none is required to use
the mark.

## Motion

The mark has thirteen states and the icon has seven more. They are geometry: a
state describes only its difference from the resting mark, so it composes and
never desynchronises. Two rules:

**A state means something.** `pending` means something is in flight. `confirm`
means it succeeded. `tear` means it did not. Running `scan` because the page felt
static is the one thing you should not do with it.

**Once, or not at all.** One-shots on arrival and on outcome; loops only while
the thing they describe is actually happening. `prefers-reduced-motion` holds a
state's end frame instead of running it, which the engine handles for you.

::: info
The mark, the icon and the engine that runs them live in
[signinwithethereum/brand-experiments](https://github.com/signinwithethereum/brand-experiments).
This site vendors the engine unchanged so the two cannot drift.
:::
