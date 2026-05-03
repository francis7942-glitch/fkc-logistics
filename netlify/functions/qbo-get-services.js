// Fetch products/services (Items) from QuickBooks Online
const { createClient } = require('@supabase/supabase-js');
const { getValidToken } = require('./qbo-refresh');

const QBO_BASE = 'https://quickbooks.api.intuit.com/v3/company';

exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  try {
    const supabase = createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY
    );
    const { access_token, realm_id } = await getValidToken(supabase);

    const query = `SELECT * FROM Item WHERE Active = true AND Type IN ('Service','NonInventory') MAXRESULTS 1000`;
    const res = await fetch(
      `${QBO_BASE}/${realm_id}/query?query=${encodeURIComponent(query)}`,
      { headers: { 'Authorization': `Bearer ${access_token}`, 'Accept': 'application/json' } }
    );
    const data = await res.json();
    const items = (data?.QueryResponse?.Item || []).map(i => ({
      id: i.Id,
      name: i.Name,
      description: i.Description || '',
      unit_price: i.UnitPrice || 0,
      type: i.Type,
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, items, total: items.length }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
