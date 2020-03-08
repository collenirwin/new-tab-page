<template>
    <li :class="{folder: node.isFolder, bookmark: !node.isFolder, collapsed: !node.isOpen, expanded: node.isOpen}"
        @click="toggle">
        <a v-if="!node.isFolder">
            <IconText iconUrl="node.iconUrl" text="node.title" />
        </a>
        <span v-if="node.isFolder">
            <IconText iconUrl="node.iconUrl" text="node.title" />
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

export default {
    name: 'BookmarkNode',
    props: {
        node
    },
    components: {
        IconText
    }
}
</script>