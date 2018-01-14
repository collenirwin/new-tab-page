const escape = (text) => {
    const escapeList = [
        [";", "&semi;"],
        ["<", "&lt;"],
        [">", "&gt;"],
        ["/", "&#47;"],
        ['"', "&quot;"],
        ["'", "&#39;"],
        ["|", "&#124;"],
        ["*", "&ast;"],
        [" ", "&nbsp;"]
    ];

    for (let x = 0; x < escapeList.length; x++) {
        // replace all occurrences of 'escapable' chars with their escaped equivalent
        text = text.split(escapeList[x][0]).join(escapeList[x][1]);
    }

    return text;
};

const toggle = (folder) => {
    // either expand or collapse the folder based on its current state
    folder.className = folder.className == "folder collapsed"
        ? "folder expanded"
        : "folder collapsed";
};

// add a site link to a UL with its favicon
const addSite = (site, list) => {
    const li = document.createElement("li");
    const url = encodeURI(site.url);

    li.className = "bookmark";

    // add a link to the bookmark's url and set the text to the bookmark's title
    li.innerHTML = `<a href='${url}'><img class="icon" src="${"chrome://favicon/" + url}">${escape(site.title)}</a>`;

    list.appendChild(li);
};

const generateBookmarkBar = (bookmarks, list) => {
    for (let bookmark of bookmarks) {
        if (bookmark.url) { // regular bookmark
            addSite(bookmark, list);
        }
        else { // bookmark folder
            const li = document.createElement("li");

            li.className = "folder collapsed";
            li.innerHTML = `<span class="folder-header"><img class="icon" src="${"/img/folder.png"}">${escape(bookmark.title)}</span>`;

            // make a new ul that will be added to this li
            const folderUL = document.createElement("ul");
            folderUL.className = "folder-content";

            list.appendChild(li);
            li.appendChild(folderUL);

            // recursively call generateBookmarkBar, but with the children bookmarks of this folder
            generateBookmarkBar(bookmark.children, folderUL);
        }
    }
};

// updates the clock div with the current time
const updateClock = () => {
    const clock = document.getElementById("clock");

    // get the current time
    const now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let amOrPm = "AM";

    // we want 12 hour time
    if (hour >= 12) {
        hour -= 12;
        amOrPm = "PM";
    }

    // again, 12 hour time
    if (hour === 0) {
        hour = 12;
    }

    // make sure we always show two digits for minute
    if (minute < 10) {
        minute = "0" + minute.toString();
    }

    // update clock
    clock.innerText = `${hour}:${minute} ${amOrPm}`;
}

document.addEventListener("DOMContentLoaded", () => {
    // populate our bookmark bar
    const bookmarksUL = document.getElementById("bookmarks");
    chrome.bookmarks.getTree((b) => {
        // we want to skip the parent element (it's just an item called "Bookmarks bar")
        generateBookmarkBar(b[0].children[0].children, bookmarksUL);

        // remove the last child as it's a link to the bookmark manager that chrome will block
        bookmarksUL.removeChild(bookmarksUL.lastChild);
    });

    // populate our top sites bar
    const topSitesUL = document.getElementById("top-sites");
    chrome.topSites.get((sites) => {
        // grab all top sites, throw them in the top-sites UL
        for (let site of sites) {
            addSite(site, topSitesUL);
        }
    });

    // grab all images from /img/backgrounds, choose a random one for the page background
    chrome.runtime.getPackageDirectoryEntry((root) => {
        root.getDirectory("img/backgrounds", {create: false}, (backgrounds) => {
            const reader = backgrounds.createReader();

            reader.readEntries((images) => {
                // set background to a random image
                document.getElementsByTagName("body")[0].background =
                    "/img/backgrounds/" + images[Math.floor(Math.random() * images.length)].name;
            });
        });
    });

    // force the clock to update immediately
    updateClock();

    // start the clock timer
    setInterval(updateClock, 1000);
});

document.addEventListener("click", (e) => {
    if (e.target && e.target.className == "folder-header") {
        toggle(e.target.parentElement);
    }
});
