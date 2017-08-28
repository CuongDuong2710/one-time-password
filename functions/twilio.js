const twilio = require('twilio')

const accountSid = 'ACace70b6b50f2ccc8e98ed4e5b11072b3'
const authToken = '419d234bf232a644eabcdffd435492c3'

// Twilio Credentials
module.exports = new twilio.Twilio(accountSid, authToken)