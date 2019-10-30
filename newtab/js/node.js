/**
 * Represents a website link or folder of website links
 */
export default class Node {

    /**
     * Initializes a Node with a chrome website or bookmark object
     * @param {*} chromeSite 
     */
    constructor(chromeSite) {
        if (!chromeSite) {
            throw new Error('Required argument "chromeSite" is null or undefined');
        }

        this.title = chromeSite.title;
        this.url = chromeSite.url;
        this.children = chromeSite.children;
        this.isOpen = false;
    }

    /**
     * Determines if this Node is a folder based on whether or not it has a url
     */
    get isFolder() {
        return !!this.url;
    }

    /**
     * Gets the favicon url for this Node if it is not a folder, otherwise returns the folder icon url
     */
    get iconUrl() {
        return this.isFolder ? '../img/folder.png' : `chrome://favicon/${this.node.url}`;
    }

    /**
     * Toggles the value of isOpen
     */
    toggle() {
        this.isOpen = !this.isOpen;
    }
}
