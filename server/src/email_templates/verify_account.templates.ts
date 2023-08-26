export const verifyAccount = ({ name, url }: {name: string, url: string }) => `
<div class="container">
  <p>Hello ${name},</p> <br />
  <p>Thank you for creating an account with us. To verify your email address, please click the button below:</p> <br /> <br />
  <p><a href="${url}" class="btn">Verify Account</a></p> <br /><br />
  <p>If you did not create an account, please ignore this email.</p> <br />
  <p>Regards,<br>
  Admin @SmaartPass</p>
</div>
`
