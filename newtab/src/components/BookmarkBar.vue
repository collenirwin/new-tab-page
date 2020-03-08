<template>
    <div id="bookmarks-bar" class="box">
        <ul id="bookmarks">
            <!--<BookmarkNode node="rootNode" />-->
        </ul>
    </div>
</template>

<script>
//import BookmarkNode from './BookmarkNode.vue'
import Node from '../Node';

export default {
    name: 'BookmarkBar',
    data: {
        rootNode: null
    },
    components: {
        //BookmarkNode
    },
    beforeMount() {
        chrome.bookmarks.getTree(bookmark => {
            // we want to skip the parent element (it's just an item called "Bookmarks bar")
            this.rootNode = new Node(bookmark[0].children[0]);
        });
    }
}
</script>