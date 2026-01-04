# Rumia - Chrome extension that uses ai to explain new words with context.
## Setup in Dev environment

- Install the repo and run
```
    bun install
```

- Run in dev
```
    bun run dev
```

## Create the extension files
```
    bun run build # for chromium in .output/chrome-mv3
    bun run build:firefox # for firefox in .output/firefox-mv2
```

### Run the built extension (Chrome)
- Step 1 - Go to chrome://extensions/
- Step 2 - Turn on developer mode (on top right)
- Step 3 - Select "Load unpacked" and select the manifest.json in the built directory.
- Step 4 - Enter the groq api key in the popup (get one from groq.com)

### Run the built extension (Firefox)
- Step 1 - Go to about:debugging#/runtime/this-firefox
- Step 2 - Click on "Load Temporary Add-on" and select the manifest.json in the built directory.
- Step 4 - Enter the groq api key in the popup (get one from [groq](https://groq.com))

