# Purple Clover Creations

A whimsical static landing page for Purple Clover Creations — a playful crochet/toy-world concept with inline SVG illustrations, yarn interactions, and an inquiry-form demo state.

## Local preview

```bash
npm run verify
npm run start
```

Then open <http://127.0.0.1:8795>.

## Notes

- No backend is wired; the inquiry form uses a local success/demo state.
- Placeholder business details are marked in copy.
- No real child identity, age, location, prices, timelines, or policies are claimed.

## Custom Stuffy Workshop

The `#workshop` section is a kid-friendly crochet/plush builder that lives inside
the landing page. It is pure vanilla JS + inline SVG — no build step, no external
APIs, no data collection.

- Two-pane layout: live SVG preview on the left, stepper controls on the right
  (stacks on mobile).
- Steps: creature → body yarn → accent → face → accessory → name → finished card.
- The preview updates instantly for every choice; face options are also
  hover/focus-to-preview ("hover to try souls").
- Actions: Next stitch / Unstitch / Fresh yarn (reset) / Shake basket
  (randomize + wobble animation) / Download card (exports an `.svg`).
- Sticky-ish top bar holds the name tag, a cuddle meter, and the actions.
- The finished card summarises the creature, colours, accessory, name and a
  short "made for …" line.
- Tone is grown-up-helped craft fun; the workshop explicitly does **not** place
  an order or send any details.

