<template>
    <div id="bookmarks-bar" class="box">
        <input type="text" v-model="searchQuery" placeholder="Filter" id="search-input" />
        <ul id="bookmarks" v-if="!searchQuery">
            <template v-if="bookmarks">
                <BookmarkNode
                    v-for="(bookmark, index) in bookmarks"
                    :key="index"
                    :node="bookmark" />
            </template>
        </ul>
        <ul v-else>
            <template v-if="bookmarks">
                <BookmarkNode
                    v-for="(bookmark, index) in filteredBookmarks"
                    :key="index"
                    :node="bookmark" />
            </template>
        </ul>
    </div>
</template>

<script>
import BookmarkNode from './BookmarkNode.vue'
import Node from '../Node';

export default {
    name: 'BookmarkBar',
    data() {
        return {
            bookmarks: null,
            searchQuery: ''
        };
    },
    components: {
        BookmarkNode
    },
    computed: {
        flatBookmarks() {
            const flatten = (list, folder) => {
                if (!folder.children) {
                    return list;
                }
                
                return list
                    .concat(folder.children
                        .flatMap(child => child.isFolder ? flatten([], child) : child));
            }
            
            const rootNode = new Node();
            rootNode.children = this.bookmarks;

            return flatten([], rootNode);
        },
        filteredBookmarks() {
            if (!this.flatBookmarks) {
                return this.flatBookmarks;
            }
            
            const query = this.searchQuery.toLowerCase();
            
            return this.flatBookmarks
                .filter(bookmark => bookmark.title && bookmark.url &&
                    (bookmark.title.toLowerCase().includes(query) || bookmark.url.includes(query)));
        }
    },
    mounted() {
        chrome.bookmarks.getTree(bookmark => {
            this.bookmarks = new Node(bookmark[0].children[0])
                .children
                .sort((a, b) => {
                    // bookmarks first, then folders
                    // but we preserve the order that they are stored in
                    if (a.isFolder && !b.isFolder) {
                        return 1;
                    }
                    
                    if (!a.isFolder && b.isFolder) {
                        return -1;
                    }
                    
                    return 0;
                });
        });
    }
}
</script>
