// console.log("current page url:", window.location.href);

let functionOn = true;
chrome.storage.sync.get(['visibility'], (result) => {
    if (result.visibility === 'off') {
        functionOn = false;
    }
});

var decodedURL = decodeURI(window.location.href);
// console.log("decodedURL:", decodedURL);

let hashPart = null;
const paths = decodedURL.split("h2=");
if (paths.length >= 2) {
    hashPart = paths[1].replace(/-/g, " ");
}
// console.log("hashPart:", hashPart);

let loadTime = 0;

chrome.runtime.onMessage.addListener((request) => {
    // console.log("chrome.runtime");
    if (!functionOn) {
        return;
    }
    if (request.message === 'tab_update_completed') {
        // const elements = document.getElementsByClassName('hp-toc-entry');
        const elements = document.querySelectorAll(".hp-toc-entry")
        if (elements.length > 0 && loadTime == 0) {
            if (!hashPart) {
                elements[0].click();
            } else {
                // jump to hash part 
                for (const element of elements) {
                    let heading = element.querySelector('span.notranslate');

                    // console.log("heading:", heading.textContent);
                    // console.log("heading2:", heading.firstChild.nodeValue);
                    // console.log("heading3:", heading.innerHTML); 
                    if (heading.textContent.replace(/-/g, " ") == hashPart) {
                        // console.log("bingo")
                        element.click();
                        break;
                    }
                }
            }
        }
        if (loadTime == 0) {
            loadTime = 1;
        }
    }
});