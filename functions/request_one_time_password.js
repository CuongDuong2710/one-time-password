const admin = require('firebase-admin')
const twilio = require('./twilio')

module.exports = function(req, res) {
    if (!req.body.phone) {
        return res.status(422).send({ error: 'You must provide a phone number' })
    }

    const phone = String(req.body.phone).replace(/[^\d]/g, '')

    // Get user model by phone
    admin.auth().getUser(phone)
      .then(userRecord => {

        // Generate code
        const code = Math.floor((Math.random() * 8999 + 1000))

        // Sending texts to user, asynchonorous action use callback 'err' object
        twilio.messages.create({
            body: 'Your code is ' + code,
            to: phone,
            from: '+12404396725'
        }, (err) => {
            if (err) { return res.status(422).send(err) }

            // Save code into user model firebase database
            admin.database().ref('users/' + phone)
              .update({ code: code, codeValid: true }, () => {
                  res.send({ success: true })
              })
        })
      })
      .catch((err) => {
          res.status(422).send({ error: 'User not found' })
      })
}