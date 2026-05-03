const { createClient } = require('@supabase/supabase-js');

async function refreshTokens(supabase, tokenRow) {
  const res = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${process.env.QBO_CLIENT_ID}:${process.env.QBO_CLIENT_SECRET}`).toString('base64'),
      'Accept': 'application/json',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokenRow.refresh_token }).toString(),
  });
  const tokens = await res.json();
  if (!tokens.access_token) throw new Error('Token refresh failed');
  const updated = { ...tokenRow, access_token: tokens.access_token, refresh_token: tokens.refresh_token || tokenRow.refresh_token, expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString() };
  await supabase.from('qbo_tokens').upsert(updated);
  return updated;
}

async function getValidToken(supabase) {
  const { data, error } = await supabase.from('qbo_tokens').select('*').eq('id', 'default').single();
  if (error || !data) throw new Error('QBO not connected. Go to Settings → QuickBooks to connect.');
  const isExpired = (new Date(data.expires_at) - new Date()) < 5 * 60 * 1000;
  return isExpired ? await refreshTokens(supabase, data) : data;
}

module.exports = { getValidToken };
