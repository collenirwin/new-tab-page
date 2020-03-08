<template>
    <div id="top-sites-bar">
        <ul id="top-sites">
            <li>Top Sites</li>
            <li v-for="(site, index) in topSites" :key="index">
                <a :href="site.url" class="bookmark">
                    <IconText :iconUrl="site.iconUrl" :text="site.title" />
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import IconText from './IconText.vue';
import Node from '../Node';

export default {
    name: 'RecentSites',
    data() {
        return {
            topSites: []
        };
    },
    components: {
        IconText
    },
    mounted() {
        // grab all chrome top sites
        chrome.topSites.get(sites => {
            // wrap each site in a Node
            this.topSites = sites.map(site => new Node(site));
        });
    }
}
</script>
