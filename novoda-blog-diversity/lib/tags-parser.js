module.exports = {
    tagsWithUsagesFrom: function (items) {
        var tagsWithUsages = new Map()
        items
            .filter(item => item.categories != null)
            .map(item => item.categories)
            .reduce((prev, curr) => prev.concat(curr), [])
            .map(category => {
                if (tagsWithUsages[category] == undefined) {
                    tagsWithUsages[category] = 0
                }
                tagsWithUsages[category] = tagsWithUsages[category] + 1

            })

        return tagsWithUsages
    },

    countUniqueTagsIn: function (map, tags) {
        return Object.keys(map)
            .map(key => [key, map[key]]) // transforms map into array
            .filter((item, pos, rep) => rep.indexOf(item) == pos) // filter unique elements
            .filter((item, pos) => findIndexForCategoryIn(item[0], tags) > 0) // filter elements that are not in 'tags' array
            .map(item => item[1]) // take only the values
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0) // add the values
    }
}

function findIndexForCategoryIn(category, tags) {
    for (var i = tags.length; i--;) {
        var tag = tags[i].toLowerCase()

        if (tag.includes(category) || category.includes(tag)) {
            break;
        } else {
            //console.log("NO Match: " + category);
        }
    }
    return i
}