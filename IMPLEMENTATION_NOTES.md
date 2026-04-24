# Implementation notes

## Preserve the copy

The website copy in this version follows the original uploaded source. Replace visuals, not the text, unless you explicitly want a copy pass later.

## Where to replace assets

### Hero
Replace the URLs in the three `.hero-still` blocks in `index.html`.

### Work archive and featured stage
Replace the `img` sources inside the archive cards and the image URLs in the `projects` object inside `script.js`.

### Reel corridor
Replace each corridor panel image in `index.html`.

## Where to add case-study links

The current archive cards are buttons for interaction. If you want each project to open a real case-study page or external link:

- convert each button to an anchor in `index.html`, or
- keep the button and bind a click handler in `script.js`

## Cursor system

The cursor is state-based:
- default viewer mode
- project mode
- field typing mode

Adjust labels with `data-cursor` in the HTML.

## If you want real 3D later

This version uses CSS perspective and layered depth to keep deployment simple.

The best next upgrade is to add real WebGL or Three.js only in these places:

1. hero glass / lens layer
2. featured project frame plane
3. corridor panel depth response

Do not add random 3D objects everywhere.

## Contact form

The current form opens a mailto flow. For production submissions, connect it to Formspree, Resend, or a Vercel function.
