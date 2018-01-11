const WebClient = require('@slack/client').WebClient
const DEFAULT_AVATAR = 'http://www.alfabetajuega.com/abj_public_files/multimedia/imagenes/201405/69941.homer_mr_x.jpg'
const Jimp = require("jimp");

module.exports = (slackToken, storage, database) => (request, response) => {
  const userId = request.body.originalRequest.data.event.user
  const game = request.body.result.parameters.game
  const score = parseInt(request.body.result.parameters.score)

  const web = new WebClient(slackToken)

  web.users.info(userId).then((response) => {
    const user = response.user
    const avatarUrl = user.profile.image_512 || user.profile.image_192 || user.profile.image_72 || DEFAULT_AVATAR
    const bucket = storage.bucket()

    return pixelate(avatarUrl)
      .then(image => {
        const file = bucket.file(`${user.id}/avatar.png`)
        return file.save(image, {
          metadata: {
            contentType: 'image/png'
          },
          public: true
        })
      }).then(snapshot => {
        return `https://storage.googleapis.com/${bucket.name}/${user.id}/avatar.png`
      }).then(avatarUrl => {
        const userName = user.profile.real_name_normalized
        const scorePayload = { userName, avatarUrl, score }

        const gameRef = database.ref(`/arcadeScore/${game}`)
        const appendNewScore = gameRef.child('scores').push(scorePayload)
        const highscoreRef = gameRef.child('highscore')
        const updateHighScore = highscoreRef.once('value').then((snapshot) => {
          const highscore = snapshot.val()
          if (!highscore || highscore.score < score) {
            return highscoreRef.set(scorePayload)
          }
        })
        return Promise.all([appendNewScore, updateHighScore])
      })
  }).then(() => {
    console.log("Finished!")
    response.send("Hello from Firebase!")
  }).catch(console.log)
}

const pixelate = url => {
  console.log('read', url)
  return Jimp.read(url).then(image => {
    console.log('image read')
    return new Promise((resolve, reject) => {
      image.resize(Jimp.AUTO, 150).pixelate(15).getBuffer(Jimp.MIME_PNG, (err, result) => {
        err ? reject(err) : resolve(result)
      })
    })
  })
}
