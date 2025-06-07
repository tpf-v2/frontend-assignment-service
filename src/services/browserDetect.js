import bowser from 'bowser';

const browser = bowser.parse(window.navigator.userAgent);

export default {
    isDateCompatible: () => {
        try {
            const version = browser.browser.version.split('.')[0];
            return browser.browser.name === 'Chrome' && parseInt(version) >= 137;
        } catch (error) {
            console.error('Error al verificar la compatibilidad de navegador', error);
            return false;
        }
    }
}
