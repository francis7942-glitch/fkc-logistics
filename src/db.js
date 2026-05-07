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

export async function updateLastLogin(userId) {
  await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', userId);
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

export async function updateTransaction(tx) {
  const { error } = await supabase
    .from('transactions').update({
      date: tx.date, kg: tx.kg, ref_no: tx.ref_no, notes: tx.notes
    }).eq('id', tx.id);
  if (error) throw error;
}

export async function deleteTransaction(id) {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
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
  const { data } = await supabase.from('sp_parts').select('*').order('name');
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
  if (partId)    q = q.eq('part_id', partId);
  if (machineId) q = q.eq('machine_id', machineId);
  const { data } = await q;
  return data || [];
}
export async function saveMovement(mvt) {
  const id = 'MVT' + uid();
  const { error } = await supabase.from('sp_movements').insert({ ...mvt, id, date: mvt.date || new Date().toISOString() });
  if (error) throw error;
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
  let q = supabase.from('transactions').select('type,kg,date,client_id,item_id')
    .gte('date', `${year}-01-01`).lte('date', `${year}-12-31`);
  if (clientId) q = q.eq('client_id', clientId);
  const { data: txs } = await q;
  const { data: items } = await supabase.from('items').select('id,storage_type');
  const dryIds = new Set((items||[]).filter(i=>i.storage_type==='dry').map(i=>i.id));

  const months = Array(12).fill(null).map(() => ({ storage:0, handlingIn:0, handlingOut:0, total:0, kgIn:0, kgOut:0 }));
  for (const tx of (txs||[])) {
    if (dryIds.has(tx.item_id)) continue;
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



// ── ROLES & PERMISSIONS ───────────────────────────────────────────
export const MODULES = [
  { id:'mod_dashboard',     label:'Dashboard',     icon:'📊', category:'Operations',  path:'dashboard' },
  { id:'mod_stock_in',      label:'Stock In',      icon:'📥', category:'Operations',  path:'stock-in' },
  { id:'mod_stock_out',     label:'Stock Out',     icon:'📤', category:'Operations',  path:'stock-out' },
  { id:'mod_transactions',  label:'Transactions',  icon:'📋', category:'Operations',  path:'transactions' },
  { id:'mod_contracts',     label:'Dry Contracts', icon:'📋', category:'Management',  path:'contracts' },
  { id:'mod_item_database', label:'Item Database', icon:'📦', category:'Management',  path:'items' },
  { id:'mod_clients',       label:'Clients',       icon:'🏢', category:'Management',  path:'clients' },
  { id:'mod_billing',       label:'Billing',       icon:'📄', category:'Management',  path:'billing' },
  { id:'mod_spare_parts',   label:'Spare Parts',   icon:'🔧', category:'Maintenance', path:'spareparts' },
  { id:'mod_settings',      label:'Settings',      icon:'⚙️', category:'System',      path:'settings' },
];

export const PROCESSES = [
  { id:'perm_stock_in_create',       label:'Create Stock In',          module:'Stock In' },
  { id:'perm_stock_in_delete',       label:'Delete Stock In',          module:'Stock In' },
  { id:'perm_stock_out_create',      label:'Create Stock Out',         module:'Stock Out' },
  { id:'perm_stock_out_delete',      label:'Delete Stock Out',         module:'Stock Out' },
  { id:'perm_tx_view_all_clients',   label:'View All Clients',         module:'Transactions' },
  { id:'perm_tx_export',             label:'Export Transactions',      module:'Transactions' },
  { id:'perm_client_create',         label:'Create Clients',           module:'Clients' },
  { id:'perm_client_edit',           label:'Edit Clients',             module:'Clients' },
  { id:'perm_client_delete',         label:'Delete Clients',           module:'Clients' },
  { id:'perm_item_create',           label:'Create Items',             module:'Item Database' },
  { id:'perm_item_edit',             label:'Edit Items',               module:'Item Database' },
  { id:'perm_item_delete',           label:'Delete Items',             module:'Item Database' },
  { id:'perm_billing_generate',      label:'Generate Billing',         module:'Billing' },
  { id:'perm_billing_push_qbo',      label:'Push to QuickBooks',       module:'Billing' },
  { id:'perm_billing_view_rates',    label:'View Rates',               module:'Billing' },
  { id:'perm_billing_edit_rates',    label:'Edit Rates',               module:'Billing' },
  { id:'perm_contract_create',       label:'Create Contracts',         module:'Contracts' },
  { id:'perm_contract_edit',         label:'Edit Contracts',           module:'Contracts' },
  { id:'perm_contract_delete',       label:'Delete Contracts',         module:'Contracts' },
  { id:'perm_sp_receive',            label:'Receive Parts',            module:'Spare Parts' },
  { id:'perm_sp_issue',              label:'Issue Parts',              module:'Spare Parts' },
  { id:'perm_sp_adjust',             label:'Adjust Stock',             module:'Spare Parts' },
  { id:'perm_sp_manage_parts',       label:'Manage Parts',             module:'Spare Parts' },
  { id:'perm_sp_approve_pr',         label:'Approve Purchase Requests',module:'Spare Parts' },
  { id:'perm_manage_users',          label:'Manage Users',             module:'Settings' },
  { id:'perm_manage_roles',          label:'Manage Roles',             module:'Settings' },
  { id:'perm_manage_rates',          label:'Manage Rates',             module:'Settings' },
  { id:'perm_manage_locations',      label:'Manage Locations',         module:'Settings' },
];

export async function getRoles() {
  const { data } = await supabase.from('roles').select('*').order('name');
  return data || [];
}

export async function saveRole(role) {
  const isNew = !role.id;
  const id = role.id || 'ROLE' + Math.random().toString(36).slice(2,8).toUpperCase();
  const { error } = await supabase.from('roles').upsert({ ...role, id });
  if (error) throw error;
  if (isNew) {
    // Auto-seed permissions for new role — dashboard visible by default
    await supabase.from('role_permissions').insert({
      id: 'RP' + Math.random().toString(36).slice(2,8).toUpperCase(),
      role_id: id,
      mod_dashboard: true,
    });
  }
  return id;
}

export async function deleteRole(id) {
  const { data } = await supabase.from('roles').select('is_system').eq('id', id).single();
  if (data?.is_system) throw new Error('Cannot delete a system role.');
  await supabase.from('role_permissions').delete().eq('role_id', id);
  await supabase.from('roles').delete().eq('id', id);
}

export async function getRolePermissions(roleId) {
  const { data } = await supabase.from('role_permissions').select('*').eq('role_id', roleId).single();
  return data || { role_id: roleId, mod_dashboard: true };
}

export async function saveRolePermissions(perms) {
  const { error } = await supabase.from('role_permissions').upsert({ ...perms, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function getUserPermissions(roleId) {
  if (!roleId) return {};
  const { data } = await supabase.from('role_permissions').select('*').eq('role_id', roleId).single();
  return data || {};
}

// ── ACTIVITY LOG ──────────────────────────────────────────────────
export async function logActivity({ userId, userName, roleName, action, module, description, recordId, recordName, metadata } = {}) {
  try {
    await supabase.from('activity_logs').insert({
      id: 'LOG' + Math.random().toString(36).slice(2,10).toUpperCase(),
      user_id: userId, user_name: userName, role_name: roleName,
      action, module, description, record_id: recordId, record_name: recordName,
      metadata: metadata || null,
      created_at: new Date().toISOString(),
    });
  } catch(e) { console.warn('Activity log failed:', e.message); }
}

export async function getActivityLogs({ userId, module, limit = 200 } = {}) {
  let q = supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(limit);
  if (userId) q = q.eq('user_id', userId);
  if (module) q = q.eq('module', module);
  const { data } = await q;
  return data || [];
}

// ── CLIENT RATES ──────────────────────────────────────────────────
export async function getClientRates(clientId) {
  const { data } = await supabase.from('client_rates').select('*').eq('client_id', clientId).single();
  return data || null;
}

export async function saveClientRates(rates) {
  const { error } = await supabase.from('client_rates').upsert({
    ...rates,
    id: rates.id || 'CR' + Math.random().toString(36).slice(2,10).toUpperCase(),
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function getClientContainers(clientId) {
  const { data } = await supabase.from('client_containers').select('*')
    .eq('client_id', clientId).order('name');
  return data || [];
}

export async function saveClientContainer(container) {
  const { error } = await supabase.from('client_containers').upsert({
    ...container,
    id: container.id || 'CON' + Math.random().toString(36).slice(2,10).toUpperCase(),
  });
  if (error) throw error;
}

export async function deleteClientContainer(id) {
  await supabase.from('client_containers').delete().eq('id', id);
}

// ── BILLING — DAILY RUNNING BALANCE METHOD ────────────────────────
export async function computeBilling(clientId, dateFrom, dateTo) {
  const globalRates = await getRates();
  const clientRates = await getClientRates(clientId);
  const containers  = await getClientContainers(clientId);
  const items = await getItems(clientId);
  const dryIds = new Set(items.filter(i => i.storage_type === 'dry').map(i => i.id));
  const chlIds = new Set(items.filter(i => i.storage_type === 'chilled').map(i => i.id));

  // Build effective rates per storage type (client rates override global)
  // Use ?? (nullish coalescing) not || to handle 0 values correctly
  const cr = clientRates;
  const gr = globalRates;
  const effectiveRates = {
    frozen: {
      storage:     cr ? (cr.frozen_storage_per_kg_per_day  ?? gr.storage_per_kg_per_day) : gr.storage_per_kg_per_day,
      handling_in: cr ? (cr.frozen_handling_in_per_kg       ?? gr.handling_in_per_kg)    : gr.handling_in_per_kg,
      handling_out:cr ? (cr.frozen_handling_out_per_kg      ?? gr.handling_out_per_kg)   : gr.handling_out_per_kg,
      charge_out:  cr ? cr.frozen_charge_handling_out : true,
    },
    chilled: {
      storage:     cr ? (cr.chilled_storage_per_kg_per_day ?? gr.storage_per_kg_per_day) : gr.storage_per_kg_per_day,
      handling_in: cr ? (cr.chilled_handling_in_per_kg      ?? gr.handling_in_per_kg)    : gr.handling_in_per_kg,
      handling_out:cr ? (cr.chilled_handling_out_per_kg     ?? gr.handling_out_per_kg)   : gr.handling_out_per_kg,
      charge_out:  cr ? cr.chilled_charge_handling_out : true,
    },
    dry: {
      storage:     cr ? (cr.dry_storage_per_kg_per_day     ?? gr.storage_per_kg_per_day) : gr.storage_per_kg_per_day,
      handling_in: cr ? (cr.dry_handling_in_per_kg          ?? gr.handling_in_per_kg)    : gr.handling_in_per_kg,
      handling_out:cr ? (cr.dry_handling_out_per_kg         ?? gr.handling_out_per_kg)   : gr.handling_out_per_kg,
      charge_out:  cr ? cr.dry_charge_handling_out : true,
    },
  };
  console.log('Client rates:', cr);
  console.log('Effective frozen storage rate:', effectiveRates.frozen.storage);

  // Helper to get storage type of an item
  const getItemType = (itemId) => {
    if (dryIds.has(itemId)) return 'dry';
    if (chlIds.has(itemId)) return 'chilled';
    return 'frozen';
  };

  // Get ALL transactions up to end of billing period (need history for opening balance)
  const { data: allTxs } = await supabase.from('transactions')
    .select('*').eq('client_id', clientId).lte('date', dateTo).order('date');
  const txs = allTxs || [];
  const coldTxs = txs.filter(t => !dryIds.has(t.item_id));

  // Transactions within billing period (for handling fees)
  const inPeriod  = coldTxs.filter(t => t.date >= dateFrom && t.date <= dateTo);
  const inTxs     = inPeriod.filter(t => t.type === 'IN');
  const outTxs    = inPeriod.filter(t => t.type === 'OUT');

  // Handling fees using per-type client rates
  const hIn  = inTxs.reduce((s,t)  => {
    const type = getItemType(t.item_id);
    return s + t.kg * effectiveRates[type].handling_in;
  }, 0);
  const hOut = outTxs.reduce((s,t) => {
    const type = getItemType(t.item_id);
    if (!effectiveRates[type].charge_out) return s;
    return s + t.kg * effectiveRates[type].handling_out;
  }, 0);

  // ── DAILY RUNNING BALANCE STORAGE COMPUTATION ────────────────────
  // Build a map of all transactions grouped by item
  const itemMap = {};
  for (const tx of coldTxs) {
    if (!itemMap[tx.item_id]) itemMap[tx.item_id] = { name: tx.item_name, txs: [] };
    itemMap[tx.item_id].txs.push(tx);
  }

  // For each day in the billing period, compute kg on hand per item
  const dailyRows = []; // { date, items: [{item_name, kg}], totalKg, charge }
  let totalStorage = 0;

  // Enumerate each day in the billing period
  // Use string-based date iteration to avoid timezone issues
  const addDays = (dateStr, n) => {
    const d = new Date(dateStr + 'T12:00:00Z'); // noon UTC avoids DST issues
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  };

  let currentDate = dateFrom;
  while (currentDate <= dateTo) {
    const dateStr = currentDate;
    const dayItems = [];
    let dayTotalKg = 0;

    for (const [itemId, itemData] of Object.entries(itemMap)) {
      // Sum all transactions for this item UP TO AND INCLUDING this day
      let kgOnHand = 0;
      for (const tx of itemData.txs) {
        if (tx.date <= dateStr) {
          kgOnHand += tx.type === 'IN' ? tx.kg : -tx.kg;
        }
      }
      kgOnHand = Math.max(0, kgOnHand); // can't be negative
      if (kgOnHand > 0) {
        dayItems.push({ item_name: itemData.name, kg: kgOnHand });
        dayTotalKg += kgOnHand;
      }
    }

    // Compute charge per item type using correct rate
    let dayCharge = 0;
    for (const item of dayItems) {
      const itemEntry = Object.entries(itemMap).find(([,v]) => v.name === item.item_name);
      if (itemEntry) {
        const itemId = itemEntry[0];
        const type = getItemType(itemId);
        dayCharge += item.kg * effectiveRates[type].storage;
      }
    }
    totalStorage += dayCharge;

    dailyRows.push({
      date: dateStr,
      items: dayItems,
      totalKg: dayTotalKg,
      charge: dayCharge,
    });

    // Move to next day using string arithmetic (timezone-safe)
    currentDate = addDays(currentDate, 1);
  }

  // Container rental fees for the billing period
  const containerFees = containers.filter(c => c.active).map(c => {
    const from = new Date(dateFrom);
    const to   = new Date(dateTo);
    const days = Math.ceil((to - from) / 864e5) + 1;
    let fee = 0;
    if (c.fee_type === 'monthly') {
      fee = c.fee_amount * (days / 30);
    } else if (c.fee_type === 'weekly') {
      fee = c.fee_amount * (days / 7);
    }
    return { ...c, days, fee: Math.round(fee * 100) / 100 };
  });
  const totalContainerFees = containerFees.reduce((s,c) => s + c.fee, 0);

  const coldTotal = hIn + hOut + totalStorage + totalContainerFees;
  const dryBilling = await computeDryBillingRange(clientId, dateFrom, dateTo);

  return {
    clientId, dateFrom, dateTo,
    inTxsInPeriod: inTxs,
    outTxs,
    hIn, hOut,
    storage: totalStorage,
    dailyRows,
    containerFees,
    totalContainerFees,
    coldTotal,
    dryBilling,
    total: coldTotal + dryBilling.total,
    rates: globalRates,
    effectiveRates,
    clientRates,
  };
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
