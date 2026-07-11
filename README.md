# IELTS Practice Simulator

Two static, self-contained practice tools that mirror real test conditions and hand off
to a strict AI examiner for grading. Navigate between them with the Speaking / Writing
strip at the top of each page.

- **[Speaking](index.html)** — Parts 2 & 3 (cue card + follow-up discussion)
- **[Writing](writing.html)** — Academic Task 1 & Task 2

## Speaking module (`index.html`)

IELTS Speaking Part 2 (the cue card task) and the Part 3 discussion that follows.

- Draws a random cue card from a built-in bank
- 60-second preparation timer with a notes area
- 2-minute speaking timer with a hard cutoff at exactly 2:00
- Live speech-to-text transcription (in-browser, nothing uploaded)
- "Time's up" screen with a copy button that formats the transcript for grading

## Writing module (`writing.html`)

IELTS **Academic** Writing under real conditions.

- Three modes: **Full Test** (60 min, both tasks on one shared clock), **Task 1 only** (20 min), **Task 2 only** (40 min)
- Task 1 shows a chart, table, process or map (rendered in-page); Task 2 is an essay prompt
- Live word count against the 150 / 250 minimums, spell-check off and pasting blocked (as in the real computer-based test)
- Absolute-deadline timer with a hard stop at 0:00; work autosaves to the browser and the clock freezes if you close the tab
- "Time's up" screen builds a `PAYLOAD v1` transcript (with word counts and under-length flags stamped in) to copy into your Claude coach

### Grading

Both modules copy a transcript you paste into Claude, where the version-controlled
`ielts-coach` skill (`.claude/skills/ielts-coach/SKILL.md`) grades it honestly against the
official band criteria and shows a Band 8.5 rewrite. The Writing grading prompt is
scenario-tested — see [tests/](tests/).

## Requirements

- Open in **Chrome** or **Edge** (the Web Speech API used for live transcription is not reliably supported in Safari/Firefox).
- Must be served over **HTTPS** for the microphone to work. GitHub Pages provides HTTPS automatically, so this is handled once deployed.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `ielts-simulator`). Public is simplest for Pages.
2. Upload `index.html` to the repository root (drag it into the repo's web page, or push it with git).
3. Go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Set branch to `main` and folder to `/ (root)`, then **Save**.
6. Wait ~1 minute. Your site will be live at:
   `https://<your-username>.github.io/<repo-name>/`

### Push with git (optional)

```bash
git init
git add index.html README.md
git commit -m "IELTS speaking simulator"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then enable Pages via Settings → Pages as above.

## Local testing

Opening `index.html` directly as a `file://` will block the microphone. To test locally, run a small server and open the HTTPS/localhost URL:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000  (mic works on localhost)
```

## Note on scope

The tool captures your words, not your voice. Pronunciation, intonation, and pace are part of the real IELTS speaking score and cannot be judged from a transcript. Use this for fluency, structure, vocabulary, and timing practice.
