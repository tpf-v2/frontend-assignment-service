export default async function validateUrl(url) {
    try {
        const response = await fetch(url, {method: 'OPTIONS'});
        if (response === 405) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        return false;
    }
}
