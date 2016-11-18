/*
    To enable mapping asset to different base url.
    e.g https://amazon.com/your/asset/path or
    https://heroku.com/your/asset/path
*/
const baseUrl = '';

exports.map = function (name) {
    return baseUrl + name;
};
