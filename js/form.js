var URL = 'https://8kcwjsqpqh.execute-api.us-east-1.amazonaws.com/test/contact'

$('#contact-form').submit(function (event) {
  event.preventDefault()
  var nameField = $('#name-input')
  var emailField = $('#email-input')
  var descField = $('#description-input')

  var data = {
    name: nameField.val(),
    email: emailField.val(),
    description: descField.val()
  }

  $.ajax({
    type: 'POST',
    url: URL,
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function (response) {
      nameField.val('')
      emailField.val('')
      descField.val('')
      $('#success-alert').slideDown()
    },
    error: function (response) {
      $('#error-alert').slideDown()
      populateMailtoLink(data.name, data.description)
    }
  })
})

/**
 * Generate the href of the Mailto Link so our customer does not
 * need to re-enter everything.
 */
function populateMailtoLink (name, description) {
  var recipient = 'zach@allamericantradework.com'
  var hrefParts = [
    'subject=' + encodeURIComponent('Website Referral: ' + name),
    'body=' + encodeURIComponent(description)
  ]
  var href = 'mailto:' + recipient + '?' + hrefParts.join('&')
  $('#mailto-link').attr('href', href).text(recipient)
}