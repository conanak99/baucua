export default {
    wait(miliseconds) {
        return new Promise((resolve) => setTimeout(resolve, miliseconds));
    }
}