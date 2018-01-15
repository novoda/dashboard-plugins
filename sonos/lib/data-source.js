const http = require('request-promise-native')

const generateViewState = (database) => (configuration) => {
    const room = configuration.room_name.value
    const apiKey = configuration.last_fm_api_key.value
    return database.ref(`/sonos/${room}/currentTrack/`)
        .once('value')
        .then(snapshot => snapshot.val())
        .then(currentTrack => {
            return fetchAlbumArt(currentTrack, apiKey).then(albumArt => {
                return {
                    artist: currentTrack.artist,
                    title: currentTrack.title,
                    artwork: albumArt,
                    room: room
                }
            })
        })
}

const fetchAlbumArt = (track, apiKey) => {
    if (track.type !== 'radio' && track.albumArtUrl) {
        return Promise.resolve(track.albumArtUrl)
    }

    const request = {
        url: 'http://ws.audioscrobbler.com/2.0',
        qs: {
            method: 'track.getInfo',
            api_key: apiKey,
            artist: track.artist,
            track: track.title,
            format: 'json'
        }
    }

    return http.get(request)
        .then((response) => {
            const apiTrack = JSON.parse(response).track
            if (apiTrack && apiTrack.album) {
                const album = apiTrack.album
                return album.image[album.image.length - 1]['#text'] || track.albumArtUrl
            } else {
                return track.albumArtUrl
            }
        }).catch((error) => {
            console.error(error)
            return track.albumArtUrl
        })
}

module.exports = generateViewState

