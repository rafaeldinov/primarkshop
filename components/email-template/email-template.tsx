export default function EmailTemplate(
  tokenWithTimestamp: string,
  type: 'change_password' | 'verify_email'
) {
  return (
    <div>
      <p>
        <b>
          {type === 'verify_email'
            ? 'Для активації акаунта '
            : 'Для зміни паролю '}
          перейдіть за посиланням:
        </b>
      </p>
      <p>
        <a
          href={`${process.env.API_URL}/${
            type === 'verify_email' ? 'verifyemail' : 'changepassword'
          }/${tokenWithTimestamp}`}
        >
          {process.env.API_URL}/
          {type === 'verify_email' ? 'verifyemail' : 'changepassword'}/
          {tokenWithTimestamp}
        </a>
      </p>
      <p style={{ color: 'red' }}>
        If you have not registered on the {process.env.API_URL} ignore this
        message
      </p>
    </div>
  );
}
