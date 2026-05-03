// Fetch customers from QuickBooks Online
const { createClient } = require('@supabase/supabase-js');
const { getValidToken } = require('./qbo-refresh');

const QBO_BASE = 'https://quickbooks.api.intuit.com/v3/company';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const supabase = createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY
    );

    const { access_token, realm_id } = await getValidToken(supabase);

    // Fetch all active customers from QBO
    const query = `SELECT * FROM Customer WHERE Active = true MAXRESULTS 1000`;
    const res = await fetch(
      `${QBO_BASE}/${realm_id}/query?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/json',
        },
      }
    );

    const data = await res.json();
    const customers = data?.QueryResponse?.Customer || [];

    // Map QBO customers to FKC client format
    const mapped = customers.map(c => ({
      qbo_id: c.Id,
      name: c.DisplayName || c.CompanyName || c.FullyQualifiedName,
      contact: c.GivenName && c.FamilyName ? `${c.GivenName} ${c.FamilyName}` : (c.GivenName || c.FamilyName || ''),
      email: c.PrimaryEmailAddr?.Address || '',
      phone: c.PrimaryPhone?.FreeFormNumber || '',
      address: [
        c.BillAddr?.Line1,
        c.BillAddr?.City,
        c.BillAddr?.CountrySubDivisionCode,
      ].filter(Boolean).join(', '),
      balance: c.Balance || 0,
    })).filter(c => c.name); // only include customers with a name

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, customers, mapped, total: mapped.length }),
    };

  } catch (err) {
    console.error('QBO get customers error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
