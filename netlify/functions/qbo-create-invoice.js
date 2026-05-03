const { createClient } = require('@supabase/supabase-js');
const { getValidToken } = require('./qbo-refresh');
const QBO_BASE = 'https://quickbooks.api.intuit.com/v3/company';

async function findOrCreateCustomer(accessToken, realmId, clientName) {
  const headers = { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json', 'Content-Type': 'application/json' };
  const query = `SELECT * FROM Customer WHERE DisplayName = '${clientName.replace(/'/g, "\\'")}'`;
  const searchRes = await fetch(`${QBO_BASE}/${realmId}/query?query=${encodeURIComponent(query)}`, { headers });
  const searchData = await searchRes.json();
  const customers = searchData?.QueryResponse?.Customer || [];
  if (customers.length > 0) return customers[0].Id;
  const createRes = await fetch(`${QBO_BASE}/${realmId}/customer`, { method: 'POST', headers, body: JSON.stringify({ DisplayName: clientName }) });
  const createData = await createRes.json();
  if (!createData?.Customer?.Id) throw new Error('Failed to create QBO customer');
  return createData.Customer.Id;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  try {
    const { clientName, dateFrom, dateTo, hIn, hOut, storage, dryRows, total, rates } = JSON.parse(event.body);
    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY);
    const { access_token, realm_id } = await getValidToken(supabase);
    const qboHeaders = { 'Authorization': `Bearer ${access_token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' };
    const customerId = await findOrCreateCustomer(access_token, realm_id, clientName);

    const lines = [];
    let n = 1;
    if (hIn > 0) lines.push({ LineNum: n++, Description: `Handling Fee — Stock In (${rates.handling_in_per_kg}/kg) | ${dateFrom} to ${dateTo}`, Amount: Math.round(hIn * 100) / 100, DetailType: 'SalesItemLineDetail', SalesItemLineDetail: { UnitPrice: Math.round(hIn * 100) / 100, Qty: 1 } });
    if (hOut > 0) lines.push({ LineNum: n++, Description: `Handling Fee — Stock Out (${rates.handling_out_per_kg}/kg) | ${dateFrom} to ${dateTo}`, Amount: Math.round(hOut * 100) / 100, DetailType: 'SalesItemLineDetail', SalesItemLineDetail: { UnitPrice: Math.round(hOut * 100) / 100, Qty: 1 } });
    if (storage > 0) lines.push({ LineNum: n++, Description: `Cold Storage Fee (${rates.storage_per_kg_per_day}/kg/day) | ${dateFrom} to ${dateTo}`, Amount: Math.round(storage * 100) / 100, DetailType: 'SalesItemLineDetail', SalesItemLineDetail: { UnitPrice: Math.round(storage * 100) / 100, Qty: 1 } });
    for (const row of (dryRows || [])) {
      lines.push({ LineNum: n++, Description: `Dry Storage — ${row.period?.label || row.yearMonth} | Flat: ₱${row.flat_fee} + ${row.slots_occupied} slots × ₱${row.slot_rate}`, Amount: Math.round(row.total * 100) / 100, DetailType: 'SalesItemLineDetail', SalesItemLineDetail: { UnitPrice: Math.round(row.total * 100) / 100, Qty: 1 } });
    }

    const invoiceRes = await fetch(`${QBO_BASE}/${realm_id}/invoice`, {
      method: 'POST', headers: qboHeaders,
      body: JSON.stringify({ CustomerRef: { value: customerId }, DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), DocNumber: `FKC-${Date.now().toString().slice(-6)}`, PrivateNote: `FKC Logistics billing: ${dateFrom} to ${dateTo}`, Line: lines }),
    });
    const invoiceData = await invoiceRes.json();
    if (!invoiceData?.Invoice?.Id) throw new Error('Invoice creation failed: ' + JSON.stringify(invoiceData));

    const invoice = invoiceData.Invoice;
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, invoiceId: invoice.Id, invoiceNumber: invoice.DocNumber, total: invoice.TotalAmt, url: `https://app.qbo.intuit.com/app/invoice?txnId=${invoice.Id}` }) };
  } catch (err) {
    console.error('QBO error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
