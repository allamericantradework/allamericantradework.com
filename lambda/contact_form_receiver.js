var AWS = require('aws-sdk')
console.log('Loading function')

var ses = new AWS.SES()

var SENDER = 'noreply@allamericantradework.com'
var RECEIVER = 'info@painterbros.com'

exports.handler = function(event, context) {
  console.log('Received event:', event)
  sendEmail(event, function (err, data) {
    console.log('SES data:', data)
    context.done(err, null)
  })
}

function sendEmail (event, done) {
  var params = {
    Destination: {
      ToAddresses: [
        RECEIVER
      ]
    },
    Message: {
      Body: {
        Text: {
          Data: '*Do Not Reply To This Message!\nName: ' + event.name + '\nEmail: ' + event.email + '\nDesc: ' + event.description,
          Charset: 'UTF-8'
        }
      },
      Subject: {
        Data: 'Website Referral Form: ' + event.name,
        Charset: 'UTF-8'
      }
    },
    Source: SENDER
  }
  ses.sendEmail(params, done)
}
