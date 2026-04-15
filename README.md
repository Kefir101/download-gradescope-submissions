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
3.  **Copy and paste** the full `script.js` script.
4.  Press `Ctrl + S` (Windows) or `Cmd + S` (Mac) to **Save**.

---

## 3. Configure Browser Settings (Mandatory)
By default, browsers prompt the user for a save location for every file. This breaks bulk downloading.

### In Chrome:
1. Navigate to **Settings** (`chrome://settings/downloads`).
2. Locate the toggle: **"Ask where to save each file before downloading"**.
3. Toggle this **OFF**.

### Browser Extension Permissions:
1. Navigate to your extensions page (`chrome://extensions`).
2. Click **Details** on the Tampermonkey card.
3. Toggle **"Allow access to file URLs"** to **ON**.

---

## 4. Configure Tampermonkey Settings (For Folders)
To allow Tampermonkey to create subfolders (e.g., `Gradescope/CourseName/`), you must override its default sanitization behavior.

1. Open the Tampermonkey dashboard and click the **Settings** tab.
2. At the very top, locate **Config mode** and change it from `Novice` to **Advanced**.
3. Scroll down to the **Downloads** section.
4. Locate **Download Mode** and change it to **Browser API**.
    * *Note: When you select this, your browser may display a prompt asking to "Allow Tampermonkey to manage your downloads." You must accept this permission.*

---

## 5. Execution
1. Log in to [Gradescope](https://www.gradescope.com/account).
2. Remain on the root **Dashboard** (the page displaying your active courses).
3. Click the purple **"Fetch & Download All Assignments"** button in the bottom-right corner.
4. The button will disable. Keep the tab open and active. Files will automatically route to your OS default Downloads folder inside a new `Gradescope` directory.

---

## Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"No valid download found"** | React rendering latency. | Edit the script to increase `RENDER_DELAY_MS` from `2500` to `4000`. |
| **Save dialog keeps appearing** | Browser configuration override. | Verify Step 3. Ensure no secondary download manager extensions are active. |
| **Browser blocks after 3 files** | Anti-spam security protocol. | Click the "lock" or "file" icon in the URL bar and select **"Always allow multiple downloads"**. |
| **Files download without folders** | Tampermonkey fallback mode. | Verify Step 4. You must be in **Browser API** mode. |