<template>
    <div id="bookmarks-bar" class="box">
        <ul id="bookmarks">
            <template v-if="bookmarks">
                <BookmarkNode
                    v-for="(bookmark, index) in bookmarks"
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
            bookmarks: null
        };
    },
    components: {
        BookmarkNode
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
