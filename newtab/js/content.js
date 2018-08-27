// returns text with ;<>/"'|* and space replaced with the corresponding html characters
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

// either expand or collapse the folder based on its current state
const toggle = (folder) => {
    folder.className = folder.className == "folder collapsed"
        ? "folder expanded"
        : "folder collapsed";
};

// add a site link to a ul with its favicon
const addSite = (site, list) => {
    const li = document.createElement("li");
    const url = encodeURI(site.url);

    li.className = "bookmark";

    // add a link to the bookmark's url and set the text to the bookmark's title
    li.innerHTML = `<a href='${url}'><img class="icon" src="${"chrome://favicon/" + url}">${escape(site.title)}</a>`;

    list.appendChild(li);
};

// add a folder ul to the provided ul return the folder ul
const addFolder = (folder, list) => {
    const li = document.createElement("li");

    li.className = "folder collapsed";
    li.innerHTML = `<span class="folder-header"><img class="icon" src="${"/img/folder.png"}">${escape(folder.title)}</span>`;

    // make a new ul that will be added to this li
    const folderUL = document.createElement("ul");
    folderUL.className = "folder-content";

    list.appendChild(li);
    li.appendChild(folderUL);
    
    return folderUL;
};

// walks the given bookmarks tree and adds all bookmarks to the given list (ul)
const generateBookmarkBar = (bookmarks, list, foldersFirst) => {
    const folders = [];
    const sites = [];
    
    // filter the bookmarks into sites and folders
    for (let bookmark of bookmarks) {
        if (bookmark.url) { // regular bookmark
            sites.push(bookmark);
        }
        else { // bookmark folder
            folders.push(bookmark);
        }
    }
    
    // function to add all folders and subfolders to the list
    const appendFolders = () => {
        for (let folder of folders) {
            // recursively call generateBookmarkBar, but with the children bookmarks of this folder
            // keeping the folders at the top of the list
            generateBookmarkBar(folder.children, addFolder(folder, list), true);
        }
    };
    
    // function to add all sites to the list
    const appendSites = () => {
        for (let site of sites) {
            addSite(site, list);
        }
    };
    
    if (foldersFirst) {
        appendFolders();
        appendSites();
    }
    else {
        appendSites();
        appendFolders();
    }
};

// updates the clock div with the passed datetime's time
const updateClock = (date) => {
    const clock = document.getElementById("clock");

    let hour = date.getHours();
    let minute = date.getMinutes();
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

    // update clock div, ex: 10:30 AM
    clock.innerText = `${hour}:${minute} ${amOrPm}`;
};

// updates the date div with the passed datetime's date
const updateDate = (date) => {
    const dateDiv = document.getElementById("date");

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"];

    // update date div, ex: Sunday, January 1
    dateDiv.innerText = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
};

// calls updateClock and updateDate with the current time and date
const updateDateAndTime = () => {
    const date = new Date();
    updateClock(date);
    updateDate(date);
};

// on load
document.addEventListener("DOMContentLoaded", () => {
    // populate our bookmark bar
    const bookmarksUL = document.getElementById("bookmarks");
    chrome.bookmarks.getTree((b) => {
        // we want to skip the parent element (it's just an item called "Bookmarks bar")
        generateBookmarkBar(b[0].children[0].children, bookmarksUL);
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
                const background = document.getElementById("background");

                const image = new Image();

                // callback to fade the image in when it loads
                image.onload = () => {
                    background.style.backgroundImage = `url("${image.src}")`;
                    background.style.opacity = 1.0;
                };

                // get a random image from the folder
                image.src = `/img/backgrounds/${images[Math.floor(Math.random() * images.length)].name}`;
            });
        });
    });

    // force the clock and date to update immediately
    updateDateAndTime();

    // start updating clock and date every second
    setInterval(updateDateAndTime, 1000);
});

// folder-header click event (to toggle the folder)
document.addEventListener("click", (e) => {
    if (e.target && e.target.className === "folder-header") {
        toggle(e.target.parentElement);
    }
});
