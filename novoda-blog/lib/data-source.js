const Rss = require('rss-parser')

const rssOptions = {
    customFields: {
        item: ['media:content']
    }
}

const fetchLatestBlogPost = (url) => {
    return parseRss(url).then(rss => {
        return rss.feed.entries[0];
    }).then(toItem)
}

const parseRss = (url) => {
    return new Promise((resolve, reject) => {
        Rss.parseURL(url, rssOptions, (err, result) => {
            err ? reject(err) : resolve(result)
        })
    })
}

const toItem = (item) => {
    const roleRegex = / [(][^)]+[)]/
    return {
        title: item.title,
        showDescription: item.title.length < 20,
        description: item.description,
        author: item['dc:creator'].replace(roleRegex, ''),
        image: item['media:content'] ? item['media:content']['$'].url : null,
        date: formatDateString(item.pubDate)
    }
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const formatDateString = (dateString) => {
    const realDate = new Date(dateString)
    return dayNames[realDate.getDay()] + ' ' + realDate.getDate() + ' ' + monthNames[realDate.getMonth()]
}

module.exports = () => fetchLatestBlogPost('https://blog.novoda.com/rss/')
