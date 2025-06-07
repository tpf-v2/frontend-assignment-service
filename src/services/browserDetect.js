import bowser from 'bowser';

const browser = bowser.parse(window.navigator.userAgent);

export default browser;
