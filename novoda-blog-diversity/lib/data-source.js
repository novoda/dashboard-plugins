const Rss = require('rss-parser')

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
    var map = tagsWithUsagesFrom(items)
    return {
        mostUsedTags: mostUsedTagsFrom(map),
        crossPlatformMentions: counUniqueTagsIn(map, crossPlatformTags),
        androidMentions: counUniqueTagsIn(map, androidTags),
        iosMentions: counUniqueTagsIn(map, iosTags)
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

function tagsWithUsagesFrom(items) {
    var tagsWithUsages = new Map()

    items
        .filter(item => item.categories != null)
        .map(item => item.categories)
        .reduce((prev, curr) => prev.concat(curr))
        .map(category => {
            if (tagsWithUsages[category] == undefined) {
                tagsWithUsages[category] = 0
            }
            tagsWithUsages[category] = tagsWithUsages[category] + 1

        })

    return tagsWithUsages
}

function counUniqueTagsIn(map, tags) {
    return Object.keys(map)
        .map(key => [key, map[key]]) // transforms map into array
        .filter((item, pos, rep) => rep.indexOf(item) == pos) // filter unique elements
        .filter((item, pos) => tags.indexOf(item[0]) > 0) // filter elements that are not in 'tags' array
        .map(item => item[1]) // take only the values
        .reduce((accumulator, currentValue) => accumulator + currentValue) // add the values
}

module.exports = () => generateViewStateFrom('https://www.novoda.com/blog/rss/')