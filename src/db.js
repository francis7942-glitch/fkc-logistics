import { supabase } from './supabase';

const uid = () => Math.random().toString(36).slice(2,10).toUpperCase() + Date.now().toString(36).toUpperCase();
const today = () => new Date().toISOString().slice(0,10);
const CY = new Date().getFullYear();
const PY = CY - 1;

// ── AUTH ──────────────────────────────────────────────────────────
export async function login(username, password) {
  const { data, error } = await supabase
    .from('users').select('*')
    .eq('username', username).eq('password', password).eq('active', true).single();
  if (error || !data) return null;
  return data;
}

// ── USERS ─────────────────────────────────────────────────────────
export async function getUsers() {
  const { data } = await supabase.from('users').select('*').order('name');
  return data || [];
}
export async function saveUser(u) {
  const { error } = await supabase.from('users').upsert({ ...u, id: u.id || uid() });
  if (error) throw error;
}
export async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
}

// ── CLIENTS ───────────────────────────────────────────────────────
export async function getClients() {
  const { data } = await supabase.from('clients').select('*').order('name');
  return data || [];
}
export async function saveClient(c) {
  const { error } = await supabase.from('clients').upsert({ ...c, id: c.id || uid() });
  if (error) throw error;
}
export async function deleteClient(id) {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw error;
}

// ── LOCATIONS ─────────────────────────────────────────────────────
export async function getLocations() {
  const { data } = await supabase.from('locations').select('*').order('name');
  return data || [];
}
export async function saveLocation(l) {
  const { error } = await supabase.from('locations').upsert({ ...l, id: l.id || uid() });
  if (error) throw error;
}
export async function deleteLocation(id) {
  const { error } = await supabase.from('locations').delete().eq('id', id);
  if (error) throw error;
}

// ── ITEMS ─────────────────────────────────────────────────────────
export async function getItems(clientId = '') {
  let q = supabase.from('items').select('*').order('name');
  if (clientId) q = q.eq('client_id', clientId);
  const { data } = await q;
  return data || [];
}
export async function saveItem(item) {
  const { error } = await supabase.from('items').upsert({ ...item, id: item.id || uid() });
  if (error) throw error;
}
export async function deleteItem(id) {
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) throw error;
}

// ── TRANSACTIONS ──────────────────────────────────────────────────
export async function getTransactions(f = {}) {
  let q = supabase.from('transactions').select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  if (f.client_id)   q = q.eq('client_id', f.client_id);
  if (f.type)        q = q.eq('type', f.type);
  if (f.from)        q = q.gte('date', f.from);
  if (f.to)          q = q.lte('date', f.to);
  if (f.location_id) q = q.eq('location_id', f.location_id);
  const { data } = await q;
  return data || [];
}
export async function saveTransaction(tx) {
  const { data, error } = await supabase
    .from('transactions').insert({ ...tx, id: tx.id || uid() }).select().single();
  if (error) throw error;
  return data;
}

// ── RATES ─────────────────────────────────────────────────────────
export async function getRates() {
  const { data } = await supabase.from('rates').select('*').single();
  return data || { storage_per_kg_per_day: 2.50, handling_in_per_kg: 1.00, handling_out_per_kg: 1.00 };
}
export async function saveRates(r) {
  const { data: existing } = await supabase.from('rates').select('id').single();
  if (existing?.id) {
    await supabase.from('rates').update(r).eq('id', existing.id);
  } else {
    await supabase.from('rates').insert(r);
  }
}

// ── CONTRACTS ─────────────────────────────────────────────────────
export async function getContracts(clientId = '') {
  let q = supabase.from('contracts').select('*, contract_periods(*)').order('start_date', { ascending: false });
  if (clientId) q = q.eq('client_id', clientId);
  const { data } = await q;
  return (data || []).map(c => ({
    ...c,
    periods: (c.contract_periods || []).sort((a,b) => a.start_date.localeCompare(b.start_date))
  }));
}
export async function saveContract(contract) {
  const { periods, contract_periods, ...contractData } = contract;
  const id = contractData.id || uid();
  const { error } = await supabase.from('contracts').upsert({ ...contractData, id });
  if (error) throw error;
  // Replace periods
  await supabase.from('contract_periods').delete().eq('contract_id', id);
  if (periods && periods.length > 0) {
    const rows = periods.map(p => ({
      contract_id: id,
      label: p.label,
      start_date: p.start,
      end_date: p.end,
      flat_fee: p.flat_fee,
      slot_rate: p.slot_rate,
      slots_occupied: p.slots_occupied,
    }));
    const { error: pe } = await supabase.from('contract_periods').insert(rows);
    if (pe) throw pe;
  }
}
export async function deleteContract(id) {
  await supabase.from('contract_periods').delete().eq('contract_id', id);
  await supabase.from('contracts').delete().eq('id', id);
}

// ── SPARE PARTS ───────────────────────────────────────────────────
export async function getMachines() {
  const { data } = await supabase.from('sp_machines').select('*').order('name');
  return data || [];
}
export async function saveMachine(m) {
  const { error } = await supabase.from('sp_machines').upsert({ ...m, id: m.id || uid() });
  if (error) throw error;
}
export async function deleteMachine(id) {
  await supabase.from('sp_machines').delete().eq('id', id);
}

export async function getParts(filter = '') {
  let q = supabase.from('sp_parts').select('*').order('name');
  if (filter === 'low') q = q.lte('current_stock', supabase.raw('min_stock'));
  const { data } = await q;
  if (!data) return [];
  if (filter === 'low') return data.filter(p => p.current_stock <= p.min_stock);
  if (filter === 'ok')  return data.filter(p => p.current_stock > p.min_stock);
  return data;
}
export async function savePart(p) {
  const { error } = await supabase.from('sp_parts').upsert({ ...p, id: p.id || uid() });
  if (error) throw error;
}
export async function deletePart(id) {
  await supabase.from('sp_parts').delete().eq('id', id);
}

export async function getMovements(partId = '', machineId = '') {
  let q = supabase.from('sp_movements').select('*').order('date', { ascending: false });
  if (partId)   q = q.eq('part_id', partId);
  if (machineId)q = q.eq('machine_id', machineId);
  const { data } = await q;
  return data || [];
}
export async function saveMovement(mvt) {
  // 1. Insert movement record
  const id = 'MVT' + uid();
  const { error } = await supabase.from('sp_movements').insert({ ...mvt, id, date: mvt.date || new Date().toISOString() });
  if (error) throw error;
  // 2. Update stock on the part
  const { data: part } = await supabase.from('sp_parts').select('current_stock').eq('id', mvt.part_id).single();
  if (part) {
    let newStock = part.current_stock;
    if (mvt.type === 'receive' || mvt.type === 'return') newStock += mvt.qty;
    if (mvt.type === 'issue')   newStock = Math.max(0, newStock - mvt.qty);
    if (mvt.type === 'adjust')  newStock = mvt.qty;
    await supabase.from('sp_parts').update({ current_stock: newStock }).eq('id', mvt.part_id);
  }
}

export async function getPurchaseRequests() {
  const { data } = await supabase.from('sp_purchase_requests').select('*').order('requested_at', { ascending: false });
  return data || [];
}
export async function savePR(pr) {
  const { error } = await supabase.from('sp_purchase_requests').upsert({ ...pr, id: pr.id || uid() });
  if (error) throw error;
}
export async function deletePR(id) {
  await supabase.from('sp_purchase_requests').delete().eq('id', id);
}

// ── INVENTORY (computed) ──────────────────────────────────────────
export async function getInventory() {
  const { data: txs } = await supabase.from('transactions').select('*');
  const { data: items } = await supabase.from('items').select('*');
  const { data: locations } = await supabase.from('locations').select('*');
  const { data: clients } = await supabase.from('clients').select('*');
  if (!txs) return [];
  const map = {};
  for (const tx of txs) {
    const key = `${tx.item_id}__${tx.location_id}`;
    if (!map[key]) {
      const item = (items||[]).find(i => i.id === tx.item_id) || {};
      const loc  = (locations||[]).find(l => l.id === tx.location_id) || {};
      const cli  = (clients||[]).find(c => c.id === tx.client_id) || {};
      map[key] = { item_id:tx.item_id, item_name:tx.item_name, item_code:item.code||'',
        storage_type:item.storage_type||'frozen', location_id:tx.location_id,
        location_name:loc.name||'Unknown', client_id:tx.client_id, client_name:cli.name||'Unknown', kg:0 };
    }
    map[key].kg += tx.type === 'IN' ? tx.kg : -tx.kg;
  }
  return Object.values(map).filter(r => r.kg > 0)
    .sort((a,b) => a.client_name.localeCompare(b.client_name) || a.item_name.localeCompare(b.item_name));
}

// ── MONTHLY REVENUE ───────────────────────────────────────────────
export async function getMonthlyRevenue(year, clientId = '') {
  const rates = await getRates();
  let q = supabase.from('transactions').select('type,kg,date,client_id')
    .gte('date', `${year}-01-01`).lte('date', `${year}-12-31`);
  if (clientId) q = q.eq('client_id', clientId);
  const { data: txs } = await q;
  const months = Array(12).fill(null).map(() => ({ storage:0, handlingIn:0, handlingOut:0, total:0, kgIn:0, kgOut:0 }));
  for (const tx of (txs||[])) {
    const m = parseInt(tx.date.slice(5,7)) - 1;
    if (m < 0 || m > 11) continue;
    if (tx.type === 'IN') {
      months[m].handlingIn += tx.kg * rates.handling_in_per_kg;
      months[m].storage    += tx.kg * rates.storage_per_kg_per_day * 30;
      months[m].kgIn       += tx.kg;
    } else {
      months[m].handlingOut += tx.kg * rates.handling_out_per_kg;
      months[m].kgOut       += tx.kg;
    }
  }
  months.forEach(d => { d.total = d.storage + d.handlingIn + d.handlingOut; });
  return months;
}

// ── BILLING ───────────────────────────────────────────────────────
export async function computeBilling(clientId, dateFrom, dateTo) {
  const rates = await getRates();
  const items = await getItems(clientId);
  const dryIds = new Set(items.filter(i => i.storage_type === 'dry').map(i => i.id));

  const { data: allTxs } = await supabase.from('transactions')
    .select('*').eq('client_id', clientId).lte('date', dateTo);
  const txs = allTxs || [];

  const isCold = tx => !dryIds.has(tx.item_id);
  const allIn  = txs.filter(t => t.type==='IN' && isCold(t));
  const inP    = txs.filter(t => t.type==='IN'  && isCold(t) && t.date>=dateFrom);
  const outP   = txs.filter(t => t.type==='OUT' && isCold(t) && t.date>=dateFrom);

  const from = new Date(dateFrom), to = new Date(dateTo); to.setHours(23,59,59,999);
  const hIn  = inP.reduce((s,t)  => s + t.kg * rates.handling_in_per_kg,  0);
  const hOut = outP.reduce((s,t) => s + t.kg * rates.handling_out_per_kg, 0);
  let storage = 0;
  for (const tx of allIn) {
    const start = new Date(tx.date) < from ? from : new Date(tx.date);
    const days  = Math.max(Math.ceil((to - start) / 864e5) + 1, 0);
    storage += tx.kg * rates.storage_per_kg_per_day * days;
  }
  const coldTotal = hIn + hOut + storage;

  // Dry billing from contracts
  const dryBilling = await computeDryBillingRange(clientId, dateFrom, dateTo);

  return { clientId, dateFrom, dateTo, inTxsInPeriod:inP, outTxs:outP, hIn, hOut, storage, coldTotal, dryBilling, total: coldTotal + dryBilling.total, rates };
}

// ── DRY CONTRACT BILLING ──────────────────────────────────────────
export async function computeDryMonthBill(clientId, yearMonth) {
  const contracts = await getContracts(clientId);
  const d = yearMonth + '-01';
  const contract = contracts.find(c => c.start_date <= d && c.end_date >= d);
  if (!contract) return null;
  const period = (contract.periods || []).find(p => p.start_date <= d && p.end_date >= d);
  if (!period) return null;
  const slotTotal = period.slot_rate * period.slots_occupied;
  const total     = period.flat_fee  + slotTotal;
  return { contract, period: { ...period, start: period.start_date, end: period.end_date, label: period.label }, flat_fee: period.flat_fee, slot_rate: period.slot_rate, slots_occupied: period.slots_occupied, slot_total: slotTotal, total, yearMonth };
}

export async function computeDryBillingRange(clientId, dateFrom, dateTo) {
  const months = [];
  let d = new Date(dateFrom.slice(0,7) + '-01');
  const end = new Date(dateTo.slice(0,7) + '-01');
  while (d <= end) { months.push(d.toISOString().slice(0,7)); d = new Date(d.getFullYear(), d.getMonth()+1, 1); }
  const rows = (await Promise.all(months.map(ym => computeDryMonthBill(clientId, ym)))).filter(Boolean);
  return { rows, total: rows.reduce((s,r) => s + r.total, 0) };
}

// ── DASHBOARD ─────────────────────────────────────────────────────
export async function getDashboard() {
  const [inv, clients, parts, contracts] = await Promise.all([
    getInventory(), getClients(), getParts(), getContracts()
  ]);
  const td = new Date().toISOString().slice(0,10);
  const { data: todayTxs } = await supabase.from('transactions').select('*')
    .eq('date', td).order('created_at', { ascending: false });

  const totalStock = inv.reduce((s,r) => s + r.kg, 0);
  const frozen     = inv.filter(r => r.storage_type==='frozen').reduce((s,r) => s+r.kg, 0);
  const chilled    = inv.filter(r => r.storage_type==='chilled').reduce((s,r) => s+r.kg, 0);
  const dry        = inv.filter(r => r.storage_type==='dry').reduce((s,r) => s+r.kg, 0);
  const activeContracts = contracts.filter(c => c.start_date<=td && c.end_date>=td);
  const lowParts   = parts.filter(p => p.current_stock <= p.min_stock);

  return { totalStock, frozen, chilled, dry, clientCount: clients.length, inventory: inv, todayTxs: todayTxs||[], activeContracts, lowParts };
}

export async function getSpDashboard() {
  const parts = await getParts();
  const low   = parts.filter(p => p.current_stock === 0);
  const warn  = parts.filter(p => p.current_stock > 0 && p.current_stock <= p.min_stock);
  const { data: openPRs } = await supabase.from('sp_purchase_requests').select('*').in('status', ['open','ordered']);
  const totalValue = parts.reduce((s,p) => s + p.current_stock * p.unit_cost, 0);
  return { low, warn, ok: parts.filter(p => p.current_stock > p.min_stock), openPRs: openPRs||[], totalValue };
}
