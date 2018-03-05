var expect = require('chai').expect;
const parser = require('../lib/tags-parser')

describe('tagsWithUsagesFrom', function () {
    const items = [
        { title: "post 1", categories: ["android", "iOS", "flutter"] },
        { title: "post 2", categories: ["android", "iOS"] },
        { title: "post 3", categories: ["android"] }
    ]

    it('should count tag usages when a tag is repeated in different categories', function () {
        const result = parser.tagsWithUsagesFrom(items)

        expect(result.android).to.be.equal(3);
    })
    it('should count tag usages when a tag is appears only in one category', function () {
        const result = parser.tagsWithUsagesFrom(items)

        expect(result.flutter).to.be.equal(1)
    })
    it('should return empty result when input is empty', function () {
        const result = parser.tagsWithUsagesFrom([])

        expect(result).to.be.empty
    })
})

describe('countUniqueTagsIn', function () {
    const checkArray = ["android", "google", "kotlin", "android studio", "gradle"]

    it('should count unique items', function () {
        const tags = {
            android: 3,
            ios: 2,
            flutter: 1
        }

        const result = parser.countUniqueTagsIn(tags, checkArray)

        expect(result).to.be.equal(3)
    })
    it('should count multiple items', function () {
        const tags = {
            android: 3,
            ios: 2,
            google: 4
        }

        const result = parser.countUniqueTagsIn(tags, checkArray)

        expect(result).to.be.equal(7)
    })
    it('should count partial names in source tags', function () {
        const tags = {
            android: 3,
            ios: 2,
            studio: 1
        }

        const result = parser.countUniqueTagsIn(tags, checkArray)

        expect(result).to.be.equal(4)
    })
    it('should count partial names in check array', function () {
        const tags = {
            android: 3,
            ios: 2,
            "gradle project": 3
        }

        const result = parser.countUniqueTagsIn(tags, checkArray)

        expect(result).to.be.equal(6)
    })
})
