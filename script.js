// ==UserScript==
// @name         Gradescope Asynchronous Bulk Downloader (Iframe Renderer)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Headless traversal utilizing iframe rendering for SPA compatibility.
// @author       System
// @match        https://www.gradescope.com/
// @match        https://www.gradescope.com/account
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    // Time to wait for React to render inside the iframe after it loads
    const RENDER_DELAY_MS = 2500;
    const REQUEST_DELAY_MS = 1000;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function fetchAndParse(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status} at ${url}`);
            const text = await response.text();
            return new DOMParser().parseFromString(text, 'text/html');
        } catch (error) {
            console.error(`Fetch failed for ${url}:`, error);
            return null;
        }
    }

    // Loads URL in a hidden iframe to execute SPA JavaScript, then extracts DOM
    async function extractDownloadFromIframe(url) {
        return new Promise((resolve) => {
            let iframe = document.getElementById('gs-scraper-frame');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'gs-scraper-frame';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }

            iframe.onload = async () => {
                await sleep(RENDER_DELAY_MS); // Wait for SPA DOM injection

                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    const buttons = doc.querySelectorAll('a.actionBar--action.tiiBtn');
                    let targetUrl = null;

                    for (const btn of buttons) {
                        const text = btn.innerText.toLowerCase();
                        if (text.includes("graded copy")) {
                            targetUrl = btn.href;
                            break;
                        } else if (text.includes("download submission") && !targetUrl) {
                            targetUrl = btn.href;
                        }
                    }
                    resolve(targetUrl);
                } catch (e) {
                    console.error(`Iframe extraction failed for ${url}:`, e);
                    resolve(null);
                }
            };

            // Trigger load
            iframe.src = url;
        });
    }

    async function executeDownloadSequence() {
        console.log("Starting background traversal...");
        const courseNodes = document.querySelectorAll('a.courseBox');

        if (courseNodes.length === 0) {
            alert("No courses found. Ensure you are on the dashboard.");
            return;
        }

        for (const courseNode of courseNodes) {
            const courseUrl = courseNode.href;
            const courseName = courseNode.querySelector('.courseBox--shortname')?.innerText.replace(/[^a-z0-9]/gi, '_') || 'Unknown_Course';
            console.log(`Processing Course: ${courseName}`);

            const courseDoc = await fetchAndParse(courseUrl);
            await sleep(REQUEST_DELAY_MS);
            if (!courseDoc) continue;

            const assignmentNodes = courseDoc.querySelectorAll('a[href*="/submissions/"]');

            for (const assignmentNode of assignmentNodes) {
                const assignmentUrl = assignmentNode.href;
                console.log(`Analyzing submission: ${assignmentUrl}`);

                const targetDownloadUrl = await extractDownloadFromIframe(assignmentUrl);

                if (targetDownloadUrl) {
                    console.log(`Queueing download: ${targetDownloadUrl}`);

                    const filename = targetDownloadUrl.split('/').pop() || 'download';

                    GM_download({
                        url: targetDownloadUrl,
                        name: `${courseName}_${filename}`,
                        saveAs: false
                    });

                    await sleep(REQUEST_DELAY_MS);
                } else {
                    console.warn(`No valid download found at ${assignmentUrl}. (Consider increasing RENDER_DELAY_MS)`);
                }
            }
        }

        console.log("Sequence complete.");
        alert("Gradescope script execution finished.");
    }

    function injectUI() {
        if (document.getElementById('gs-bulk-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'gs-bulk-btn';
        btn.innerText = "Fetch & Download All Assignments";
        btn.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            padding: 15px; background-color: #3d1b54; color: white;
            border: none; border-radius: 5px; cursor: pointer; font-weight: bold;
        `;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.innerText = "Processing (Check Console)...";
            btn.disabled = true;
            btn.style.backgroundColor = "#555";
            executeDownloadSequence();
        });

        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectUI);
    } else {
        injectUI();
    }
})();