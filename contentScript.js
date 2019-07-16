const firstURL = window.location.href;
// console.log("first url:", firstURL);

let needLoadHeadingURL = false;
if (hasHeading(firstURL)) {
    // console.log("needLoadHeadingURL")
    needLoadHeadingURL = true;
}

// case 1: from paper home 
// case 2: from paper others
// case 3: input doc url 
// case 4: input doc url with heading part 

let functionOn = true;
chrome.storage.sync.get(['visibility'], (result) => {
    if (result.visibility === 'off') {
        functionOn = false;
    }
});

// let lastURL = "";
// let loadTime = 0;

function hasHeading(url) {
    if (url.indexOf("h2=") > -1) {
        return true;
    }

    return false;
}

chrome.runtime.onMessage.addListener((request) => {
    console.log("current page url:", window.location.href);

    if (request.message !== 'tab_update_completed') {
        return;
    }

    if (!functionOn) {
        // console.log("off");
        return;
    }

    let index = -1;
    // index = hasHeading(window.location.href);

    // const elements = document.getElementsByClassName('hp-toc-entry');

    // TODO:: prevent querySelectorAll in paper home/others
    const elements = document.querySelectorAll(".hp-toc-entry")
    console.log("elements:", elements.length, index);

    if (elements.length > 0) { // && loadTime == 0
        if (needLoadHeadingURL) {
            // jump to hash part 
            for (const element of elements) {

                let heading = element.querySelector('a').href;
                if (heading === firstURL) {
                    console.log("bingo");
                    element.click();
                    break;
                }
            }
            needLoadHeadingURL = false;
        } else if (hasHeading(window.location.href) == false) {
            // TODO: is it possible to do this twice? 
            elements[0].click();
        }
    }

    // lastURL = window.location.href;
});