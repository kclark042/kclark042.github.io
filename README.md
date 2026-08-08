# Kristin Clark — Personal Site

A single-page portfolio built with React + TypeScript (Vite).

## Design concept

The hero features a small canvas visualization of a clustered embedding space —
points drift, group, and connect to nearby neighbors, and respond to your cursor.
It's a direct nod to the Recursion project described in the resume (visualizing
the embedding space of biological foundation models), and sets up the site's
theme: turning complex, hard-to-see systems into something you can look at
and understand.

Palette and type stay quiet everywhere else — dark graphite background,
one bio-cyan accent, a violet secondary used only inside the canvas — so the
hero visualization stays the one memorable moment.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    EmbeddingCanvas.tsx   # signature hero visualization
    Nav.tsx
    Hero.tsx
    Summary.tsx
    Skills.tsx
    Experience.tsx
    Education.tsx
    Footer.tsx
  data/
    resumeData.ts         # all resume content lives here — edit this to update the site
  App.tsx
  App.css
  index.css
  main.tsx
```

To update content (new role, new skill, contact info), edit `src/data/resumeData.ts` —
nothing else needs to change.
