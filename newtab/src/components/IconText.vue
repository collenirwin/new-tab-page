<template>
    <span>
        <img class="icon" :src="iconUrl" />
        {{ text }}
    </span>
</template>

<script>
export default {
    name: 'IconText',
    props: {
        iconUrl: String,
        text: String
    }
}
</script>
