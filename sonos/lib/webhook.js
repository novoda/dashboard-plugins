const webhook = (database) => (request, response) => {
    response.status(200).send()
    const body = request.body

    if (body.type !== 'transport-state') {
        return
    }

    const roomName = body.data.roomName
    const currentTrack = body.data.state.currentTrack

    let payload = {
        stationName: currentTrack.stationName,
        type: currentTrack.type,
        albumArtUrl: inferAlbumArtUrl(currentTrack)
    }

    if (currentTrack.type === 'radio' && currentTrack.artist === currentTrack.stationName) {
        payload = Object.assign(payload, parseRadioSong(currentTrack))
    } else {
        payload = Object.assign(payload, { artist: currentTrack.artist, title: currentTrack.title })
    }

    database.ref(`/sonos/${roomName}/currentTrack`).set(payload).then()
}

const inferAlbumArtUrl = (track) => {
    if (track.albumArtUri.startsWith("http")) {
        return track.albumArtUri
    }
    if (track.absoluteAlbumArtUri.startsWith("http")) {
        return track.absoluteAlbumArtUri
    }
    console.log({
        message: 'missing album art uri',
        uris: [track.albumArtUri, track.absoluteAlbumArtUri]
    })
    return ''
}

const parseRadioSong = (track) => {
    const parts = track.title.split(' - ')
    return {
        artist: parts[0],
        title: parts[1]
    }
}

module.exports = webhook
