export const getCategories = (topics) => {
    let result = [];
    topics.forEach(topic => {
    if (topic.category && !result.includes(topic.category.name)) {
        result.push(topic.category.name);
    }
    });
    return result;
};