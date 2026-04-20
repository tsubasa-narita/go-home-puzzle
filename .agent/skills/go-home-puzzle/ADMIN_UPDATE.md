# Admin Workflow Update (2026-04)

The old Antigravity / `generate_image` flow is now legacy for this repository.

Use this local script instead:

```powershell
.\.agent\skills\go-home-puzzle\scripts\generate-image-gemini.ps1 `
  -TrainName "E235系山手線" `
  -FileName "new-puzzle.png" `
  -Model "gemini-3.1-flash-image-preview"
```

Security rules:

- Keep the key only in `GEMINI_API_KEY` or `GOOGLE_API_KEY`.
- Do not commit real keys.
- Do not move this flow into browser-side runtime code.
- Treat image generation as an admin-only local task.
- The train prompt is fixed to the template defined in `SKILL.md`.
