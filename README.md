# Gradescope Bulk Downloader: Setup & Usage

This tool automates the retrieval of graded copies and submissions from all courses on your Gradescope dashboard.

---

## 1. Install Tampermonkey
Tampermonkey is a browser extension required to run custom scripts.

* **Chrome / Edge:** [Download from Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
* **Firefox:** [Download from Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

---

## 2. Install the Script
1.  Click the **Tampermonkey icon** in your browser toolbar and select **Create a new script**.
2.  **Delete** all existing placeholder code in the editor.
3.  **Copy and paste** the full script provided in the previous message.
4.  Press `Ctrl + S` (Windows) or `Cmd + S` (Mac) to **Save**.

---

## 3. Configure Browser for "Zero-Click" Downloads
By default, browsers ask where to save every file. You must disable this for the script to work without manual intervention.

### In Chrome:
1.  Go to **Settings** (`chrome://settings/downloads`).
2.  Locate **"Ask where to save each file before downloading"**.
3.  Toggle this **OFF**.

### In Tampermonkey:
1.  Go to `chrome://extensions`.
2.  Click **Details** on the Tampermonkey card.
3.  Toggle **"Allow access to file URLs"** to **ON**.

---

## 4. How to Use
1.  Log in to [Gradescope.com](https://www.gradescope.com/account).
2.  Stay on the **Dashboard** (the page listing all your courses).
3.  Click the purple **"Fetch & Download All Assignments"** button in the bottom-right corner.
4.  **Do not close the tab.** Monitor progress in the browser console (`F12` -> `Console`) if the button text stops updating.

---

## Troubleshooting
| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"No valid download found"** | Slow network/loading. | Increase `RENDER_DELAY_MS` in the script code. |
| **Windows Explorer pops up** | Browser settings. | Ensure "Ask where to save" is toggled **OFF**. |
| **Downloads block after 3 files** | Browser security. | Click the "lock" icon in the URL bar and select **"Always allow multiple downloads"**. |