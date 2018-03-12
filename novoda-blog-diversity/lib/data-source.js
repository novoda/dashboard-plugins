const Rss = require('rss-parser')
const parser = require('./tags-parser')

const crossPlatformTags = ["react native", "flutter", "j2objc", "kotlin multiplatform", "kotlin/native"]
const androidTags = ["android", "google", "kotlin", "android studio", "gradle"]
const iosTags = ["ios", "xcode", "swift", "apple", "cocoa pods"]

const generateViewStateFrom = (url) => {
    return parseRss(url)
        .then(rss => rss.feed.entries)
        .then(toViewState)
}

const parseRss = (url) => {
    return new Promise((resolve, reject) => {
        Rss.parseURL(url, (err, result) => {
            err ? reject(err) : resolve(result)
        })
    })
}

const toViewState = (items) => {
    var map = parser.tagsWithUsagesFrom(items)
    return {
        mostUsedTags: mostUsedTagsFrom(map),
        crossPlatformMentions: parser.countUniqueTagsIn(map, crossPlatformTags),
        androidMentions: parser.countUniqueTagsIn(map, androidTags),
        iosMentions: parser.countUniqueTagsIn(map, iosTags)
    }
}

function mostUsedTagsFrom(map) {
    return Object.keys(map)
        .map(key => [key, map[key]]) // transforms map into array
        .sort((firstTag, secondTag) => secondTag[1] - firstTag[1]) // sort array by value
        .splice(0, 3) // take the first 3 elements
        .map(tagUsage => tagUsage[0]) // take only the names
        .join(", ")
}

module.exports = () => generateViewStateFrom('https://www.novoda.com/blog/rss/')