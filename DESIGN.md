---
name: IOT LAB
description: Portal karya siswa kelas IoT, set as an independent hard-lined magazine where every group is one issue.
colors:
  cobalt: "#1238e8"
  cobalt-deep: "#0a249f"
  signal-green: "#33d17a"
  acid-sun: "#eef11a"
  marker-red: "#ef3a2f"
  destructive-red: "#c8261c"
  ink: "#0d0d0d"
  cream-paper: "#f7f4ea"
  cream-deep: "#e7e1d1"
  muted-ink: "#4f4b43"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(2.8rem, 7vw, 4.6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0"
  headline:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "2.2rem"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0"
  title:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "0"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0.14em"
  button:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.12em"
  marker:
    fontFamily: "Permanent Marker, cursive"
    fontSize: "clamp(1.4rem, 2.6vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.05
rounded:
  none: "0px"
spacing:
  gutter-mobile: "12px"
  gutter: "20px"
  panel-pad: "24px"
  panel-pad-lg: "32px"
  section-gap: "48px"
  container: "1400px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "44px"
  button-cta:
    backgroundColor: "{colors.marker-red}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "56px"
  button-outline:
    backgroundColor: "{colors.cream-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.acid-sun}"
    textColor: "{colors.ink}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "44px"
  tag-sun:
    backgroundColor: "{colors.acid-sun}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4.8px 9.6px"
  tag-cobalt:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4.8px 9.6px"
  input:
    backgroundColor: "{colors.cream-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "4px 14px"
    height: "44px"
  input-focus:
    backgroundColor: "{colors.white}"
  nav-cell:
    backgroundColor: "{colors.cream-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0 24px"
  nav-cell-active:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
  panel:
    backgroundColor: "{colors.cream-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  panel-accent:
    backgroundColor: "{colors.signal-green}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "32px"
---

# Design System: IOT LAB

## Overview

**Creative North Star: "The Hard-Lined Issue"**

IOT LAB is an independent print magazine about student IoT work, and every student group gets its own issue. Surfaces are cells ruled in black ink on cream paper: header, cover, nav, and summaries are rows of cells divided by 3px ink lines, and corners are always square. Cobalt is the house colour and carries active cells, information panels, and the brand's dominance. Signal green marks the one stamped panel per view. Acid sun yellow appears only as small category tags and as the fill a cell takes on when you hover it. Marker red is the call to action and the handwritten scrawl.

The type sets the tone. Condensed Anton capitals are pressed into the page as mastheads that fill their cell. JetBrains Mono capitals with wide tracking serve as magazine credit lines and control labels. Archivo stays quiet underneath as reading text. Permanent Marker shows up only as an occasional red or yellow scrawl over a photo, like an editor's note.

Depth is printed, not lit. Hard offset ink shadows are native to this world. The stamped panel lands with one, and interactive cards lift into one on hover. Nothing is soft, blurred, rounded, or pastel. The interface frames the students' photos, members, and videos and does not compete with them.

**Key Characteristics:**
- Square corners everywhere (0px radius, enforced on every shadcn radius step).
- 3px solid ink rules separate cells, panels, inputs, and buttons.
- Cobalt dominant; one signal-green stamped panel per view; yellow kept small.
- Anton display in uppercase at weight 400, sized to fill its container.
- Mono uppercase labels with 0.12–0.14em tracking for all meta text and controls.
- Hard offset ink shadows (4/6/9/16px) on cover cells, side panels, and CTAs at rest, and on hover lifts. Never blurred.

## Colors

A primary-colour print palette on cream stock: cobalt dominates, green stamps, yellow tags, red acts, and black ink draws every line.

### Primary
- **Cobalt** (#1238e8): The house colour. It fills active nav and tab cells, the default button, information panels (remote access, "Cara kerja", the cover photo's backing), completion at 100%, the focus outline, and the theme colour. White text on cobalt.
- **Cobalt Deep** (#0a249f): Hover fill for cobalt bars and cells (for example the teacher card's open-portal strip).

### Secondary
- **Signal Green** (#33d17a): The stamped accent panel. Use it for the hero/cover panel on the homepage and portal, the quote panel, the student-dashboard teacher note, the dashboard average-completion cell, and the editor preview. Ink text only. Use it for one panel per view, never as a background field.

### Tertiary
- **Acid Sun** (#eef11a): Small and loud. Use it for category tag blocks, the hover fill on outline buttons, nav cells, and section links, text selection, the 50–99% progress state, and marker scrawls that sit on cobalt. Ink text on sun. Never use it for a large panel.
- **Marker Red** (#ef3a2f): The call to action ("Lihat karya", "Buka kontrol"), the hover on the login cell, unsaved-state tags, the caret colour, progress under 50%, and the marker scrawl over photos. CTA text is ink.
- **Destructive Red** (#c8261c): Destructive buttons and invalid-field borders only. White text.

### Neutral
- **Ink** (#0d0d0d): All text, every border and rule, every hard shadow, inverted ink buttons and the login cell.
- **Cream Paper** (#f7f4ea): The page ground and the surface of every panel, input, and nav cell. Ground and paper are the same colour. Panels separate from the page by their ink rule, not by tone.
- **Cream Deep** (#e7e1d1): Muted fills such as empty photo wells, skeletons, and the scrollbar track.
- **Muted Ink** (#4f4b43): Secondary text, placeholders, counts beside headings.

### Named Rules
**The One Stamp Rule.** Each view has at most one signal-green panel, and it is the panel that carries the view's main point. Green is never a wash, a section background, or a pastel tint.

**The Small Sun Rule.** Acid yellow lives in tags, hover fills, selection, and scrawls. It never fills a panel larger than a tag block.

**The Cobalt Dominance Rule.** Cobalt must stay the most visible chromatic colour on any screen. This is a brand commitment.

**The No Pastel Rule.** No tints, pale variants, or alpha-washed colour fields. The palette is flat, full-strength pigment on cream. The `ink/15` and `ink/40` hairlines (list dividers, dashed empty states) are the only alpha values.

## Typography

**Display Font:** Anton (with Impact, sans-serif)
**Body Font:** Archivo (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono at 500/700/800 (with ui-monospace)
**Accent Font:** Permanent Marker (with cursive)

**Character:** A tabloid condensed grotesque shouting in capitals, paired with typewriter-precise mono credits. Archivo keeps long reading text calm. The marker is the one hand-made voice.

### Hierarchy
- **Masthead** (Anton 400, fluid in container-query units up to 72cqi, line-height 0.8–0.84, uppercase): The issue name ("IOT / LAB", the group name) sized to fill the width of its cell, one word per line on desktop.
- **Display** (Anton 400, clamp(2.8rem, 7vw, 4.6rem), 0.95): Page section heads and dashboard class heads, e.g. "Karya tiap kelompok".
- **Headline** (Anton 400, 2.2–2.6rem, 0.92–0.95): Panel and editor-section titles. Stamped-panel titles scale to clamp(2.3rem, 5vw, 4rem).
- **Title** (Anton 400, 1.55rem, 0.98): Card titles, clamped to 3 lines.
- **Body** (Archivo 400–500, 1rem / 0.875rem on md+ forms, line-height 1.625): Descriptions with max width 62–65ch.
- **Label** (JetBrains Mono 700, 0.72rem, 0.14em, uppercase): Credits, meta lists, field labels, nav cells (800 on nav and login cells).
- **Button** (JetBrains Mono 800, 0.8rem, 0.12em, uppercase; 0.72rem sm, 0.9rem lg).
- **Marker** (Permanent Marker 400, clamp(1.4rem, 2.6vw, 2rem) up to 3rem on the hero, tilted -2° to -9°): Scrawl over a photo, red on photo or sun on cobalt.

### Named Rules
**The Capitals Rule.** Every h1–h4 is Anton, uppercase, weight 400, letter-spacing 0, text-wrap balance. Never bold Anton and never set it in sentence case.

**The Credit Line Rule.** Meta text and controls (labels, nav, buttons, tags, counts) are mono uppercase with wide tracking. Body copy is never mono.

**The One Scrawl Rule.** Use at most one marker note per view. It is decorative, sits over imagery, and never carries information that isn't available elsewhere.

## Layout

Content sits in a centred 1400px container with 12px gutters on mobile and 20px from sm up, mirrored as outer padding on header, page, and footer. Panels are spaced by 12px gaps on mobile and 20px gaps on desktop. Sections are separated by 32–56px.

The cover (`components/site/cover.tsx`, used on the homepage and the group portal) follows the HARD LINES reference. The header bar and the cover are one ink frame: the frame has no top border, so the header's bottom rule is the line between the header row and the cover row, and the frame is exactly as wide as the header bar (container minus the 12rem info box and its 0.75rem gap). Inside the frame, the masthead sits on bare paper (≈0.6fr) and the photo (≈1fr) has its own 3px frame, inset 10px from the header rule and the frame bottom. The stamped panel (`--s`: 18.5rem on lg, 22rem on xl) overlaps the frame's right edge and runs out under the header info box, aligned to the photo's top and bottom and flush with the info box's right edge. It is flat: no shadow and no entrance motion. Below lg the frame stacks the masthead over the inset photo, and the stamp drops beneath the frame.

Rows of cells are the nav idiom. The header is one ruled bar (logo | tagline | nav cells | login cell), and the portal's sticky section nav is a strip of cells separated by 3px ink gaps. Section anchors use a scroll margin of about 5rem, and smooth scrolling is on only when `prefers-reduced-motion: no-preference`.

## Elevation & Depth

Depth is printed, following the "HARD LINES" reference. Hard offset ink blocks with no blur sit under the cover cells, side panels, and CTAs at rest, and grow when you hover or press. Content cards in grids stay flat until hover. Lifts move the element up-left, and pressing presses it back toward the paper.

### Shadow Vocabulary
- **Brutal Small** (`box-shadow: 4px 4px 0 0 #0d0d0d`): Focused inputs and textareas; a pressed CTA.
- **Brutal** (`box-shadow: 6px 6px 0 0 #0d0d0d`): Resting shadow on cover cells (masthead, cover photo); hover lift on ordinary buttons (translate -3px, -3px).
- **Brutal Large** (`box-shadow: 9px 9px 0 0 #0d0d0d`): Resting shadow on CTAs (`white`, `red`, `cta` button variants, which deepen to 12px on hover) and on side panels via `.pop` (quote, remote access, components); card hover lift (translate -4px, -4px).
- **Brutal XL** (`box-shadow: 16px 16px 0 0 #0d0d0d`): Reserved for the QR dialog card. The cover's stamped panel is flat because it sits over the cover frame, which already carries the shadow.

### Named Rules
**The Printed Shadow Rule.** Shadows are solid ink offsets down-right with zero blur. No ambient, soft, coloured, or upward shadows.

**The Cover-And-Aside Rule.** The joined header-and-cover frame, side panels, and CTAs carry a resting shadow; the stamped panel on the cover does not. Grid cards (group cards, member cards), the header bar, and the footer stay flat and use 2px (cards) or 3px (bars) ink rules.

## Shapes

All corners are square: radius is 0 at every scale, including inherited shadcn components. Edges are 3px solid ink on panels, cards, inputs, buttons, tabs, the progress track, and cell dividers. 2px is used only on outline badges, and dashed ink at 40% only marks empty states. Short thick ink bars (3–4px tall, 32–48px wide) appear as typographic rules next to credit lines and under stamped-panel titles. Photos are clipped flush inside their ink frame. Tags sit flush against the top-left corner of a card's image, like a cover category block.

## Components

### Buttons
Mono capitals on solid pigment with a square ink frame. They feel like hand-pressed stamps.
- **Shape:** Square (0px), 3px ink border, heights 28/36/44/56px (xs/sm/default/lg).
- **Primary:** Cobalt with white text, 0 20px padding, mono 800 at 0.8rem with 0.12em tracking.
- **CTA:** Marker red with ink text and a resting 3px ink shadow. It is the one action that leads the view (lg size, full width, arrow pushed to the right edge).
- **Outline:** Cream paper with ink text that fills sun on hover. **Ink:** black with white text. **Sun:** yellow with ink text. **Ghost:** borderless until hover. **Link:** cobalt underline.
- **Hover / Focus:** Lifts -3px, -3px with a 5px ink shadow over 150ms cubic-bezier(.22,1,.36,1). Active presses flat. Focus is a 3px cobalt outline offset 2px. Disabled is 45% opacity.

### Tags (Chips)
- **Style:** Flush colour blocks with no border and no radius. Mono 700 at 0.68–0.72rem, 0.12em tracking, uppercase, about 4.8px 9.6px padding. Group-card tags rotate cobalt → sun → red → cobalt. The "Data contoh" demo marker is sun text on ink.
- **State:** Static labels, not interactive. The outline badge variant uses a 2px ink border on paper.

### Cards / Containers
- **Corner Style:** Square (0px).
- **Background:** Cream paper. Cobalt for information panels (white text). Signal green for the single stamped panel.
- **Shadow Strategy:** Flat at rest. Interactive group cards lift -4px with the 8px shadow on hover while their photo scales 1.04 and drops its 15% grayscale. The stamped panel on the cover is flat.
- **Border:** 3px solid ink.
- **Internal Padding:** Cards 10px around a 4:3 image well, then 14px text. Panels 20–24px (mobile) to 24–32px (sm+).

### Inputs / Fields
- **Style:** 44px tall, 3px ink border, cream paper fill, 14px horizontal padding, Archivo 500. Placeholder in muted ink at weight 400. Caret is marker red.
- **Focus:** Fill turns white and gains the 3px ink shadow. No glow and no colour ring.
- **Error / Disabled:** Border switches to destructive red. Disabled is 50% opacity.

### Navigation
- **Style:** A ruled bar of cells, each separated by a 3px ink left rule. Labels are mono 800 uppercase.
- **States:** Default is cream paper, hover fills sun, and the active cell is cobalt with white text. The login cell is ink with white text and hovers to red with ink text.
- **Tabs:** The same idiom. 44px trigger cells in a 3px ink frame, active cobalt, hover sun.
- **Mobile:** Cells hide progressively ("Beranda" from sm). The portal section nav becomes a wrapping grid of equal-grow cells, sticky at the top.

### Masthead (Signature)
Anton capitals sized by container query to fill the cell, revealed line by line as if pressed into the paper. Each line rises from 105% over 0.75s, staggered 0.12s, with ease (0.22, 1, 0.36, 1). With reduced motion the duration is zero.

### Stamped Panel (Signature)
A pigment panel (cobalt on the homepage, signal green on the portal) with an ink border that contains a headline, a short ink bar, a mono fact list, and a full-width CTA pinned to the bottom. It overlaps the cover frame's right edge and stays flat, with no shadow.

### Progress Bar
A 14px (dashboard 20px) ink-framed track on paper. The fill is red under 50%, sun from 50%, and cobalt at 100%, with a 3px ink edge on partial fills. It grows from 0 over 0.7s.

## Do's and Don'ts

### Do:
- **Do** frame every surface with a 3px solid ink border and keep every corner at 0px.
- **Do** keep cobalt (#1238e8) the dominant colour: active cells, information panels, the default button.
- **Do** give each cover one stamped panel overlapping the frame's right edge, flat, with one CTA inside it.
- **Do** set every heading in Anton uppercase at weight 400. Set every label, nav cell, tag, and button in JetBrains Mono uppercase with 0.12–0.14em tracking. Buttons use weight 800.
- **Do** use hover as a pigment change or a hard lift: sun fill for cells and outline buttons, -3px or -4px translate with a 5px or 8px ink shadow for buttons and cards.
- **Do** gate motion and smooth scrolling behind reduced-motion preferences.

### Don't:
- **Don't** round any corner or use soft, blurred, or coloured shadows.
- **Don't** use pastel or tinted colour fields. Ground and panels are the same cream (#f7f4ea), and pale variants of the accents do not exist.
- **Don't** fill a panel with acid sun. Yellow is for tags, hover, and selection.
- **Don't** use more than one green stamped panel or more than one marker scrawl per view.
- **Don't** set body copy in mono or headings in Archivo.
- **Don't** put information in a marker scrawl. It is decoration over imagery.
