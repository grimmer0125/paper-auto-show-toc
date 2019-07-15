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

const index = decodedURL.indexOf("h2=");
// const paths = decodedURL.split("h2=");
if (index > -1) {
    hashPart = decodedURL.substr(index + 3, decodedURL.length - index - 3);
    // console.log("hashPart:", hashPart);

    // hashPart = paths[1]; //.replace(/-/g, " ");
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
                    const newHeading = heading.textContent.replace(/ /g, "-");
                    if (newHeading.indexOf(hashPart) > -1) {
                        // console.log("bingo:", newHeading);
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