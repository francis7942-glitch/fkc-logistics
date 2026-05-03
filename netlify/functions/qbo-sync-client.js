// Push an FKC client update back to QuickBooks as a customer
const { createClient } = require('@supabase/supabase-js');
const { getValidToken } = require('./qbo-refresh');

const QBO_BASE = 'https://quickbooks.api.intuit.com/v3/company';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  try {
    const { clientName, email, phone, address } = JSON.parse(event.body);
    const supabase = createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY
    );
    const { access_token, realm_id } = await getValidToken(supabase);
    const qboHeaders = { 'Authorization': `Bearer ${access_token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' };

    // Check if customer exists
    const query = `SELECT * FROM Customer WHERE DisplayName = '${clientName.replace(/'/g, "\\'")}'`;
    const searchRes = await fetch(`${QBO_BASE}/${realm_id}/query?query=${encodeURIComponent(query)}`, { headers: qboHeaders });
    const searchData = await searchRes.json();
    const existing = searchData?.QueryResponse?.Customer?.[0];

    const customerPayload = {
      DisplayName: clientName,
      ...(email && { PrimaryEmailAddr: { Address: email } }),
      ...(phone && { PrimaryPhone: { FreeFormNumber: phone } }),
      ...(address && { BillAddr: { Line1: address } }),
    };

    let result;
    if (existing) {
      // Update existing
      const updateRes = await fetch(`${QBO_BASE}/${realm_id}/customer`, {
        method: 'POST',
        headers: qboHeaders,
        body: JSON.stringify({ ...customerPayload, Id: existing.Id, SyncToken: existing.SyncToken, sparse: true }),
      });
      result = await updateRes.json();
    } else {
      // Create new
      const createRes = await fetch(`${QBO_BASE}/${realm_id}/customer`, {
        method: 'POST', headers: qboHeaders,
        body: JSON.stringify(customerPayload),
      });
      result = await createRes.json();
    }

    if (!result?.Customer?.Id) throw new Error('Customer sync failed: ' + JSON.stringify(result));
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, customerId: result.Customer.Id, action: existing ? 'updated' : 'created' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
