import Node from './Node';

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

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

// add a site link to a UL with its favicon
const addSite = (site, list) => {
    const li = document.createElement("li");
    const url = encodeURI(site.url);

    li.className = "bookmark";

    // add a link to the bookmark's url and set the text to the bookmark's title
    li.innerHTML = `<a href='${url}'><img class="icon" src="${"chrome://favicon/" + url}">${escape(site.title)}</a>`;

    list.appendChild(li);
};

// walks the given bookmarks tree and adds all bookmarks to the given list (ul)
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

Vue.component('icon-text', {
    template: '#icon-text-template',
    props: {
        iconUrl: String,
        text: String
    }
});

Vue.component('tree-node', {
    template: '#tree-node-template',
    props: {
        node: Node
    }
});

const vm = new Vue({
    el: '#main',
    data: {
        rootNode: null,
        topSites: null,
        timeString: '',
        dateString: ''
    },
    methods: {
        /**
         * Calls updateDate and updateTime with the current date
         */
        updateDateAndTime() {
            const date = new Date();
            updateClock(date);
            updateDate(date);
        },
        
        /**
         * Updates dateString to the passed date in long format
         * @param {Date} date 
         */
        updateDate(date) {
            this.dateString = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
        },
        
        /**
         * Updates timeString to the passed date's time portion
         * @param {Date} date 
         */
        updateTime(date) {
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
            
            this.timeString = `${hour}:${minute} ${amOrPm}`;
        }
    },
    mounted() {
        // grab all chrome bookmarks
        chrome.bookmarks.getTree(bookmark => {
            // we want to skip the parent element (it's just an item called "Bookmarks bar")
            this.rootNode = new Node(bookmark[0].children[0]);
        });
        
        // grab all chrome top sites
        chrome.topSites.get(sites => {
            // wrap each site in a Node
            this.topSites = sites.map(site => new Node(site));
        });
        
        // force the clock and date to update immediately
        updateDateAndTime();

        // start updating clock and date every second
        setInterval(updateDateAndTime, 1000);
    }
});

// on load
document.addEventListener("DOMContentLoaded", () => {
    // populate our bookmark bar
    // const bookmarksUL = document.getElementById("bookmarks");
    // chrome.bookmarks.getTree((b) => {
    //     // we want to skip the parent element (it's just an item called "Bookmarks bar")
    //     generateBookmarkBar(b[0].children[0].children, bookmarksUL);

    //     // remove the last child as it's a link to the bookmark manager that chrome will block
    //     bookmarksUL.removeChild(bookmarksUL.lastChild);
    // });

    // populate our top sites bar
    // const topSitesUL = document.getElementById("top-sites");
    // chrome.topSites.get((sites) => {
    //     // grab all top sites, throw them in the top-sites UL
    //     for (let site of sites) {
    //         addSite(site, topSitesUL);
    //     }
    // });

    // grab all images from /img/backgrounds, choose a random one for the page background
    chrome.runtime.getPackageDirectoryEntry((root) => {
        root.getDirectory("img/backgrounds", {create: false}, (backgrounds) => {
            const reader = backgrounds.createReader();

            reader.readEntries((images) => {
                const background = document.getElementById("background")

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
});