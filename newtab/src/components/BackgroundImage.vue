<template>
    <div id="background" :style="{ backgroundImage, opacity }"></div>
</template>

<script>
export default {
    name: 'BackgroundImage',
    data() {
        return {
            backgroundImage: 'none',
            opacity: 0.0
        };
    },
    mounted() {
        const imageFolder = './img/backgrounds';
        
        // grab all images from dist/img/backgrounds, choose a random one for the page background
        chrome.runtime.getPackageDirectoryEntry(root => {
            root.getDirectory(imageFolder, { create: false }, backgrounds => {
                const reader = backgrounds.createReader();

                reader.readEntries(images => {
                    const image = new Image();

                    // callback to fade the image in when it loads
                    image.onload = () => {
                        this.backgroundImage = `url("${image.src}")`;
                        this.opacity = 1.0;
                    };

                    // get a random image from the folder
                    image.src = `${imageFolder}/${images[Math.floor(Math.random() * images.length)].name}`;
                });
            });
        });
    }
};
</script>
