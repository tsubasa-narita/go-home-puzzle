# Admin Image Generation

This repository should not embed Google API keys in source code, browser code, or tracked config files.

## Security rules

- Use a local environment variable only.
- Do not commit `.env`, `.env.local`, or any file that contains a real API key.
- Do not call the Gemini image API from the shipped browser app, because that would expose the key to every user.
- Treat image generation as an admin-only local workflow.

## Local setup

PowerShell:

```powershell
$env:GEMINI_API_KEY="your-key"
```

You can also use `GOOGLE_API_KEY` instead.

## Generate a puzzle image

```powershell
.\.agent\skills\go-home-puzzle\scripts\generate-image-gemini.ps1 `
  -TrainName "E235系山手線" `
  -FileName "new-puzzle.png" `
  -Model "gemini-3.1-flash-image-preview"
```

The script always uses this fixed train prompt template from the project skill:

```text
水彩画風の＜ここに電車名をいれる＞の画像を作成して。
・電車の窓からはかわいい動物が手を振っています。
・電車自体のデザインは本物に似せてください。
・背景はこの電車が走っているエリアと合うようにして。そのエリア独自の食べ物やキャラクターや場所などがあれば登場させて
・画像の縦横比は１対１
```

## Optional model choices

- `gemini-3.1-flash-image-preview`: Nano Banana 2
- `gemini-2.5-flash-image`: Nano Banana
- `gemini-3-pro-image-preview`: Nano Banana Pro

## After generation

1. Save the image into `public/images/`.
2. Add the puzzle entry to `src/puzzleData.js`.
3. Review the diff before committing.
