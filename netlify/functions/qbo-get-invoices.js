// Fetch invoice payment status from QuickBooks Online
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

    // Get invoices from last 12 months
    const since = new Date();
    since.setMonth(since.getMonth() - 12);
    const sinceStr = since.toISOString().slice(0, 10);

    const query = `SELECT * FROM Invoice WHERE TxnDate >= '${sinceStr}' MAXRESULTS 1000`;
    const res = await fetch(
      `${QBO_BASE}/${realm_id}/query?query=${encodeURIComponent(query)}`,
      { headers: { 'Authorization': `Bearer ${access_token}`, 'Accept': 'application/json' } }
    );
    const data = await res.json();
    const invoices = (data?.QueryResponse?.Invoice || []).map(inv => ({
      id: inv.Id,
      doc_number: inv.DocNumber,
      customer_name: inv.CustomerRef?.name || '',
      customer_id: inv.CustomerRef?.value || '',
      date: inv.TxnDate,
      due_date: inv.DueDate,
      amount: inv.TotalAmt,
      balance: inv.Balance,
      status: inv.Balance === 0 ? 'paid' : new Date(inv.DueDate) < new Date() ? 'overdue' : 'open',
      email_status: inv.EmailStatus,
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, invoices, total: invoices.length }) };
  } catch (err) {
    console.error('QBO get invoices error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
