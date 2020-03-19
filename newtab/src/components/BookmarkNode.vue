<template>
    <li :class="{
            folder: node.isFolder,
            bookmark: !node.isFolder,
            collapsed: node.isFolder && !node.isOpen,
            expanded: node.isOpen
        }">
        <a v-if="!node.isFolder" :href="node.url">
            <IconText :iconUrl="node.iconUrl" :text="node.title" />
        </a>
        <span v-else class="folder-header" @click="toggle">
            <IconText :iconUrl="node.iconUrl" :text="node.title" />
        </span>
        <ul v-if="node.isOpen">
            <BookmarkNode
                v-for="(child, index) in node.children"
                :key="index"
                :node="child" />
        </ul>
    </li>
</template>

<script>
import IconText from './IconText.vue'
import Node from '../Node';

export default {
    name: 'BookmarkNode',
    props: {
        node: Node
    },
    components: {
        IconText
    },
    methods: {
        toggle() {
            this.node.toggle();
        }
    },
    created() {
        this.node.sortChildren(true);
    }
}
</script>
