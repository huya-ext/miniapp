export default {
    formatTime: (time) => {
        let min = Math.floor(time / 60),
            second = time % 60;
        min = min < 10 ? ('0' + min) : min;
        second = second < 10 ? ('0' + second) : second;
        return min + ':' + second;
    }
}