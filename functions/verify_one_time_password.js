const admin = require('firebase-admin')

module.exports = function(req, res) {
    if (!req.body.phone || !req.body.code) {
        return res.status(422).send({ error: 'Phone and code must be provided' })
    }

    const phone = String(req.body.phone).replace(/[^\d]/g, '')
    const code = parseInt(req.body.code)

    admin.auth().getUser(phone)
      .then(() => {
        // fetch amound of some 'value', call this callback function 'snapshot' of the data was retrieved
        const ref = admin.database().ref('users/' + phone)
        ref.on('value', snapshot => {

          // 'Value' don't attempt to listen for any more value changes
          ref.off()

          // Get user
          const user = snapshot.val()

          // If the code is stored on our server is not equal the code user sent us 
          // OR the code we have stored is not valid 
          // => something went wrong
          if (user.code !== code || !user.codeValid) {
            return res.status(422).send({ error: 'Code not valid' })
          }

          // code is used one time, so invalid it
          ref.update({ codeValid: false })

          // create JWT
          admin.auth().createCustomToken(phone)
            .then(token => res.send({ token: token }))
        })
      })
      .catch((err) => res.status(422).send({ error: err }))
}