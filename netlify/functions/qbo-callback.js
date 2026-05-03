const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const { code, realmId, error } = event.queryStringParameters || {};
  if (error || !code || !realmId) return { statusCode: 302, headers: { Location: '/?qbo=error' }, body: '' };

  const CLIENT_ID = process.env.QBO_CLIENT_ID;
  const CLIENT_SECRET = process.env.QBO_CLIENT_SECRET;
  const REDIRECT_URI = process.env.QBO_REDIRECT_URI;

  try {
    const tokenRes = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
        'Accept': 'application/json',
      },
      body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI }).toString(),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) return { statusCode: 302, headers: { Location: '/?qbo=error' }, body: '' };

    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY);
    await supabase.from('qbo_tokens').upsert({ id: 'default', realm_id: realmId, access_token: tokens.access_token, refresh_token: tokens.refresh_token, expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(), created_at: new Date().toISOString() });

    return { statusCode: 302, headers: { Location: '/?qbo=connected' }, body: '' };
  } catch (err) {
    console.error('QBO callback error:', err);
    return { statusCode: 302, headers: { Location: '/?qbo=error' }, body: '' };
  }
};
