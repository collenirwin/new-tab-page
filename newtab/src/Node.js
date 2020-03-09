/**
 * Represents a website link or folder of website links
 */
export default class Node {

    /**
     * Initializes a Node with a chrome website or bookmark object
     * @param {*} chromeSite 
     */
    constructor(chromeSite) {
        if (chromeSite) {
            this.title = chromeSite.title;
            this.url = chromeSite.url;
            this.name = chromeSite.id;
            this.isOpen = false;

            if (chromeSite.children) {
                this.children = chromeSite.children.map(child => new Node(child));
            }
        }
    }

    /**
     * Determines if this Node is a folder based on whether or not it has a url
     */
    get isFolder() {
        return !this.url;
    }

    /**
     * Gets the favicon url for this Node if it is not a folder, otherwise returns the folder icon url
     */
    get iconUrl() {
        return this.isFolder ? './img/folder.png' : `chrome://favicon/${this.url}`;
    }

    /**
     * Toggles the value of isOpen
     */
    toggle() {
        this.isOpen = !this.isOpen;
    }
    
    /**
     * Sorts this.children, separating the folders from the bookmarks
     * (preserves order beyond that)
     * (returns this.children)
     * @param {Boolean} foldersFirst
     */
    sortChildren(foldersFirst) {
        if (this.children) {
            this.children.sort((a, b) => {
                if (a.isFolder && !b.isFolder) {
                    return foldersFirst ? -1 : 1;
                }

                if (!a.isFolder && b.isFolder) {
                    return foldersFirst ? 1 : -1;
                }

                return 0;
            });
        }
        
        return this.children;
    }
}
