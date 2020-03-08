<template>
    <div>
        <div id="clock">{{ timeString }}</div>
        <div id="date">{{ dateString }}</div>
    </div>
</template>

<script>
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

export default {
    name: 'Clock',
    data() {
        return {
            dateString: '',
            timeString: ''
        };
    },
    methods: {
        /**
         * Calls updateDate and updateTime with the current date
         */
        updateDateAndTime() {
            const date = new Date();
            this.updateTime(date);
            this.updateDate(date);
        },
        
        /**
         * Updates dateString to the passed date in long format
         * @param {Date} date 
         */
        updateDate(date) {
            this.dateString = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
        },
        
        /**
         * Updates timeString to the passed date's time portion
         * @param {Date} date 
         */
        updateTime(date) {
            let hour = date.getHours();
            let minute = date.getMinutes();
            let amOrPm = 'AM';

            // we want 12 hour time
            if (hour >= 12) {
                hour -= 12;
                amOrPm = 'PM';
            }

            // again, 12 hour time
            if (hour === 0) {
                hour = 12;
            }

            // make sure we always show two digits for minute
            if (minute < 10) {
                minute = '0' + minute.toString();
            }
            
            this.timeString = `${hour}:${minute} ${amOrPm}`;
        }
    },
    mounted() {
        // force the clock and date to update immediately
        this.updateDateAndTime();

        // start updating clock and date every second
        setInterval(this.updateDateAndTime, 1000);
    }
}
</script>
