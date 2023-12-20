const newsLetterEmail = (clientName) => `<p>Hi ${clientName}, here you have today news.</p>`
//const welcomeEmail = (email) => `<p>Welcome ${email} to filashAir.</p>`
const welcomeEmail = (email) => `
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Welcome to filashAir</title>
</head>
<body>
  <h2>Hello ${email} </h2>
  <p>You are the first registered user, hence the first administrator, and registering will be turned off, more users can only be invited.</p>
</body>
</html>
`
const resetEmail = (password) => `
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Reset password at filashAir</title>
</head>
<body>
  <p>Here is your new password, please don't forget to change it to a new password of your own choice!</p>
  <p>${password}</p>
</body>
</html>
`

const changePasswordEmail = (email) => `
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Password changed</title>
</head>
<body>
  <p>Your password has been changed successfully, if it wasn't done by yourself, please reset it immediately.</p>
</body>
</html>
`

export {newsLetterEmail, welcomeEmail, resetEmail, changePasswordEmail}
