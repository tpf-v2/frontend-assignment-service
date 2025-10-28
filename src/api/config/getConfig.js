export const getConfigLogin = (user) => {
    return {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        params: {
            cache_bust: new Date().getTime(), // add params to avoid caching
        },
    };
}

export const getConfigLoginCached = (user) => {
    return {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
    };
}