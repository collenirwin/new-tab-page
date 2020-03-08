<template>
    <div id="app">
        <div id="background"></div>
        <BookmarkBar />
        <div id="center-widget" class="box">
            <Clock />
            <RecentSites />
        </div>
    </div>
</template>

<script>
import BookmarkBar from './components/BookmarkBar.vue';
import Clock from './components/Clock.vue';
import RecentSites from './components/RecentSites.vue';

export default {
    name: 'App',
    components: {
        BookmarkBar,
        Clock,
        RecentSites
    }
}
</script>