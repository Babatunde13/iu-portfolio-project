export const forgotPasswordMail = ({ name, url }: {name: string, url: string }) => `
<div class="container">
  <p>Hello ${name},</p>
  <p>We received a request to reset your password. Click the button below to reset it:</p> <br />
  <a href="${url}" class="btn">Reset Password</a> <br /><br />
  <p>If you did not request a password reset, please ignore this email.</p><br />
  <p>Regards,<br> <br />
  Admin @SmaartPass</p>
</div>
`
