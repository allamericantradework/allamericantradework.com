var AWS = require('aws-sdk')

var ses = new AWS.SES()
var dynamo = new AWS.DynamoDB({region: 'us-east-1'})

var CUSTOMER_REQUESTS_TABLE = 'customer-requests'
var SENDER = 'noreply@allamericantradework.com'
var RECEIVER = 'darren@allamericantradework.com'

exports.handler = function(event, context) {
  console.log('Received event:', event)
  sendEmail(event, function (err, data) {
    console.log('SES data:', data)
    if (err) return context.done(err)
    storeEvent(event, function (err, data) {
      context.done(err, data)
    })
  })
}

function storeEvent (event, done) {
  var params = {
    TableName: CUSTOMER_REQUESTS_TABLE,
    Item: {
      email: {
        S: event.email
      },
      timestamp: {
        N: String(Date.now())
      },
      name: {
        S: event.name
      },
      description: {
        S: event.description
      }
    }
  }
  dynamo.putItem(params, done)
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
