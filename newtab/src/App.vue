<template>
    <div id="app" v-cloak>
        <BackgroundImage />
        <BookmarkBar />
        <div id="center-widget" class="box">
            <Clock />
            <RecentSites />
        </div>
    </div>
</template>

<script>
import BackgroundImage from './components/BackgroundImage.vue'
import BookmarkBar from './components/BookmarkBar.vue';
import Clock from './components/Clock.vue';
import RecentSites from './components/RecentSites.vue';

export default {
    name: 'App',
    components: {
        BackgroundImage,
        BookmarkBar,
        Clock,
        RecentSites
    }
}
</script>
