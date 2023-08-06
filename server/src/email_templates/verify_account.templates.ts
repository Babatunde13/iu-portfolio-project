export const verifyAccount = ({ name, url }: {name: string, url: string }) => `
<div class="container">
  <h1>Verify Your Account</h1>
  <p>Hello ${name},</p>
  <p>Thank you for creating an account with us. To verify your email address, please click the button below:</p>
  <p><a href="${url}" class="btn">Verify Account</a></p>
  <p>If you did not create an account, please ignore this email.</p>
  <p>Regards,<br>Admin @SmartPass</p>
</div>
`
