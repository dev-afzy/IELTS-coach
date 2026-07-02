# IELTS Speaking Part 2 Simulator

A single-page practice tool for IELTS Speaking Part 2 (the cue card task).

- Draws a random cue card from a built-in bank
- 60-second preparation timer with a notes area
- 2-minute speaking timer with a hard cutoff at exactly 2:00
- Live speech-to-text transcription (in-browser, nothing uploaded)
- "Time's up" screen with a copy button that formats the transcript for grading

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
