export const forgotPasswordMail = ({ name, url }: {name: string, url: string }) => `
<div class="container">
  <h1>Reset Your Password</h1>
  <p>Hello ${name},</p>
  <p>We received a request to reset your password. Click the button below to reset it:</p>
  <a href="${url}" class="btn">Reset Password</a>
  <p>If you did not request a password reset, please ignore this email.</p>
  <p>Regards,<br>Admin @SmartPass</p>
</div>
`
