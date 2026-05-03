exports.handler = async (event) => {
  const CLIENT_ID = process.env.QBO_CLIENT_ID;
  const REDIRECT_URI = process.env.QBO_REDIRECT_URI;
  const scope = 'com.intuit.quickbooks.accounting';
  const state = Math.random().toString(36).slice(2);
  const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);
  return { statusCode: 302, headers: { Location: authUrl.toString() }, body: '' };
};
