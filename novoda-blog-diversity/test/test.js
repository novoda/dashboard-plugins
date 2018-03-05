var expect = require('chai').expect;
const parser = require('../lib/tags-parser')

const given = [{
    title: "post 1",
    categories: ["android", "iOS", "flutter"]
}, {
    title: "post 2",
    categories: ["android", "iOS"]
}, {
    title: "post 3",
    categories: ["android"]
}]

describe('tagsWithUsagesFrom', function () {
    it('should count tag usages when a tag is repeated in different categories', function () {
        const result = parser.tagsWithUsagesFrom(given)

        expect(result.android).to.be.equal(3);
    })
})

describe('tagsWithUsagesFrom', function () {
    it('should count tag usages when a tag is appears only in one category', function () {
        const result = parser.tagsWithUsagesFrom(given)

        expect(result.flutter).to.be.equal(1)
    })
})

describe('tagsWithUsagesFrom', function () {
    it('should return empty result when input is empty', function () {
        const result = parser.tagsWithUsagesFrom([])

        expect(result).to.be.empty
    })
})

