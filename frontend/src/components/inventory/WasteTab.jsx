import { useState, useMemo } from 'react';
import { Trash2, AlertTriangle, Search, Filter, Archive } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast, Button, Modal, Input, Select, Textarea, Table, Tr, Td, Pagination, Badge, Card, ConfirmModal } from '../ui';

const PER_PAGE = 10;

// ─── SAMPLE MOCK DATA PARA MAY LAMANG AGAD ANG SCREEN MO ───
const MOCK_WASTE_LOGS = [
  { id: 'w1', dt: '2026-06-24 08:30', type: 'ingredient', item: 'Fresh Milk', qty: '2 Liters', cost: 190.00, reason: 'Spoiled', notes: 'Na-iwan sa labas ng ref overnight.' },
  { id: 'w2', dt: '2026-06-23 14:15', type: 'product', item: 'Chocolate Ensaymada', qty: '5 pcs', cost: 225.00, reason: 'Unsold', notes: 'Hindi nabenta mula kahapon.' },
  { id: 'w3', dt: '2026-06-22 10:00', type: 'material', item: 'Balloons (Red)', qty: '3 pcs', cost: 45.00, reason: 'Popped/Butas', notes: 'Pumutok habang tina-try i-inflate.' },
  { id: 'w4', dt: '2026-06-20 17:00', type: 'ingredient', item: 'White Sugar', qty: '1 kg', cost: 85.00, reason: 'Pest Damage', notes: 'Inantat ng langgam ang sako.' },
  { id: 'w5', dt: '2026-06-19 11:00', type: 'product', item: 'Ube Cake (Small)', qty: '1 pcs', cost: 280.00, reason: 'Damaged', notes: 'Nahulog habang nililipat sa display case.' }
];

const REASONS = {
  ingredient: ['Spoiled', 'Expiring Soon', 'Spilled/Wasted', 'Pest Damage', 'Other'],
  product: ['Unsold', 'Damaged', 'Expired', 'Quality Defect', 'Other'],
  material: ['Popped/Butas', 'Damaged', 'Misprinted', 'Lost', 'Other']
};

export default function WasteTab() {
  const context = useApp() || {};
  const { logWaste, deleteWasteLog } = context;
  
  // INAYOS: Binago ang fallback validation para gumana nang maayos ang empty array ([]) sa pagsusuri ng empty-states
  const wasteLogs = context.wasteLogs !== undefined ? context.wasteLogs : MOCK_WASTE_LOGS;
  const ingredients = context.ingredients || [];
  const products = context.products || [];
  const materials = context.materials || [];

  const { show: showToast } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Modal forms management
  const [modalOpen, setModalOpen] = useState(false);
  const [logType, setLogType] = useState('ingredient'); // 'ingredient' | 'product' | 'material'

  // Form Fields
  const [ingName, setIngName] = useState('');
  const [ingQty, setIngQty] = useState('');
  const [ingUnit, setIngUnit] = useState('kg');

  const [productName, setProductName] = useState('');
  const [productQty, setProductQty] = useState('');
  const [productUnit, setProductUnit] = useState('pcs');

  const [matName, setMatName] = useState('');
  const [matQty, setMatQty] = useState('');
  const [matUnit, setMatUnit] = useState('pcs');

  const [reason, setReason] = useState('Spoiled');
  const [notes, setNotes] = useState('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredLogs = useMemo(() => {
    return wasteLogs.filter(log => {
      const matchesSearch = log.item.toLowerCase().includes(search.toLowerCase()) || 
                            log.reason.toLowerCase().includes(search.toLowerCase()) ||
                            (log.notes && log.notes.toLowerCase().includes(search.toLowerCase()));
      const matchesType = filterType === 'All' || log.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [wasteLogs, search, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PER_PAGE));
  const pagedLogs = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredLogs.slice(start, start + PER_PAGE);
  }, [filteredLogs, page]);

  const handleOpenLogModal = (type) => {
    setLogType(type);
    setReason(REASONS[type][0]);
    setNotes('');
    setIngName(''); setIngQty(''); setIngUnit('kg');
    setProductName(''); setProductQty(''); setProductUnit('pcs');
    setMatName(''); setMatQty(''); setMatUnit('pcs');
    setModalOpen(true);
  };

  const handleLog = () => {
    let finalItem = '';
    let finalQtyStr = '';
    let rawQty = 0;
    let computedCost = 0;

    if (logType === 'ingredient') {
      if (!ingName || !ingQty) {
        showToast('Mangyaring punan ang pangalan at dami ng sangkap.', 'error');
        return;
      }
      const match = ingredients.find(i => i.name === ingName);
      finalItem = ingName;
      rawQty = parseFloat(ingQty);
      finalQtyStr = `${ingQty} ${match?.unit || ingUnit}`;
      computedCost = (match?.costPerUnit || 0) * rawQty;
    } else if (logType === 'product') {
      if (!productName || !productQty) {
        showToast('Mangyaring piliin ang produkto at dami.', 'error');
        return;
      }
      const match = products.find(p => p.name === productName);
      finalItem = productName;
      rawQty = parseInt(productQty, 10);
      finalQtyStr = `${productQty} ${productUnit}`;
      
      // I-estimate ang halaga base sa recipe cost kung may available, o kaya default fallback
      const matchCost = match?.estimatedCost || 45; 
      computedCost = matchCost * rawQty;
    } else if (logType === 'material') {
      if (!matName || !matQty) {
        showToast('Mangyaring piliin ang materyales at dami.', 'error');
        return;
      }
      const match = materials.find(m => m.name === matName);
      finalItem = matName;
      rawQty = parseFloat(matQty);
      finalQtyStr = `${matQty} ${match?.unit || matUnit}`;
      computedCost = (match?.costPerUnit || 0) * rawQty;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const payload = {
      id: 'w_' + Date.now(),
      dt: timestamp,
      type: logType,
      item: finalItem,
      qty: finalQtyStr,
      rawQty,
      cost: computedCost,
      reason,
      notes: notes.trim()
    };

    if (!logWaste) {
      showToast('Naka-Mock Mode: Matagumpay na naitala ang pagkasira/waste!', 'success');
      setModalOpen(false);
      return;
    }

    try {
      logWaste(payload);
      showToast('Matagumpay na nairehistro ang waste record.', 'success');
      setModalOpen(false);
    } catch (err) {
      showToast(err.message || 'May naganap na error sa pag-save.', 'error');
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (!deleteWasteLog) {
      showToast('Naka-Mock Mode: Hindi mabura ang waste record.', 'info');
      setDeleteTarget(null);
      return;
    }

    deleteWasteLog(deleteTarget.id);
    showToast('Ibinalik ang nakaraang stock at binura ang log entry.', 'success');
    setDeleteTarget(null);
  };

  const totalCostFiltered = useMemo(() => {
    return filteredLogs.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  }, [filteredLogs]);

  return (
    <div className="space-y-4">
      {/* Top Banner Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
        <div>
          <h2 className="text-base font-bold text-red-800 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" />
            Pag-uulat ng Spoilage at Kalamidad (Waste Log)
          </h2>
          <p className="text-xs text-brand-500 mt-0.5">
            I-bawas sa kasalukuyang imbentaryo ang mga expired, sira, o hindi nabentang supply.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="danger" size="sm" onClick={() => handleOpenLogModal('ingredient')} className="flex-1 sm:flex-initial gap-1">
            <Archive size={14} /> + Spoiled Ingredient
          </Button>
          <Button variant="warning" size="sm" onClick={() => handleOpenLogModal('product')} className="flex-1 sm:flex-initial gap-1">
            <Archive size={14} /> + Unsold Product
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleOpenLogModal('material')} className="flex-1 sm:flex-initial gap-1">
            <Archive size={14} /> Archive Material
          </Button>
        </div>
      </div>

      {/* Filter and Stats Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-brand-400" />
            <Input type="search" placeholder="Maghanap sa waste logs..." className="pl-8 py-1.5 text-sm" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Filter size={14} className="text-brand-400" />
            <span className="text-xs font-semibold text-brand-600 whitespace-nowrap">Uri:</span>
            <select className="text-xs border rounded-lg px-2 py-1.5 bg-white font-medium text-brand-700 focus:outline-none" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
              <option value="All">Lahat ng Kategorya</option>
              <option value="ingredient">Raw Ingredient</option>
              <option value="product">Finished Product</option>
              <option value="material">Celebration Material</option>
            </select>
          </div>
        </Card>

        <Card className="p-3 bg-brand-900 text-white flex flex-col justify-center">
          <span className="text-[10px] font-bold tracking-wider uppercase text-brand-300">Tantiya ng Kabuuang Lugi</span>
          <span className="text-xl font-black text-amber-300 mt-0.5">₱{totalCostFiltered.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </Card>
      </div>

      {/* Main Logs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table columns={[
            { label: 'Petsa at Oras' },
            { label: 'Kategorya' },
            { label: 'Aytem / Pangalan' },
            { label: 'Dami' },
            { label: 'Halaga ng Lugi (₱)' },
            { label: 'Dahilan' },
            { label: 'Tala' },
            { label: 'Aksyon', align: 'center' }
          ]}>
            {pagedLogs.map(log => (
              <Tr key={log.id}>
                <Td className="text-xs text-brand-500 font-medium whitespace-nowrap">{log.dt}</Td>
                <Td>
                  <Badge variant={log.type === 'ingredient' ? 'info' : log.type === 'product' ? 'warning' : 'secondary'}>
                    {log.type === 'ingredient' ? 'Ingredient' : log.type === 'product' ? 'Product' : 'Material'}
                  </Badge>
                </Td>
                <Td className="font-bold text-brand-800">{log.item}</Td>
                <Td className="font-medium text-brand-700">{log.qty}</Td>
                <Td className="font-semibold text-red-600">₱{log.cost?.toFixed(2)}</Td>
                <Td><span className="inline-block text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-md font-semibold">{log.reason}</span></Td>
                <Td className="text-xs text-brand-600 max-w-xs truncate" title={log.notes}>{log.notes || '—'}</Td>
                <Td align="center">
                  <button onClick={() => setDeleteTarget(log)} className="p-1.5 text-brand-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" title="Burahin ang Record / Ibalik Stock">
                    <Trash2 size={15} />
                  </button>
                </Td>
              </Tr>
            ))}
          </Table>
        </div>

        {!filteredLogs.length && (
          <div className="text-center text-brand-400 py-12 font-medium bg-white border border-dashed border-brand-200 rounded-b-xl">
            No waste records found.
          </div>
        )}

        {filteredLogs.length > 0 && (
          <div className="p-3 border-t border-brand-100">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </Card>

      {/* Creation Modal Form */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={`Mag-ulat ng ${logType === 'ingredient' ? 'Sira / Expired na Sangkap' : logType === 'product' ? 'Hindi Nabentang Produkto' : 'Nasirang Dekorasyon/Materyales'}`}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleLog}>Confirm Log</Button>
          </div>
        }
      >
        {logType === 'ingredient' && (
          <div className="space-y-3">
            <Select label="Pumili ng Sangkap" required value={ingName} onChange={e => {
              const matched = ingredients.find(i => i.name === e.target.value);
              setIngName(e.target.value);
              if (matched) setIngUnit(matched.unit);
            }}>
              <option value="">— Piliin ang sangkap —</option>
              {ingredients.map(i => (
                <option key={i.id} value={i.name}>{i.name} (Mayroon pa: {i.stock} {i.unit})</option>
              ))}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Dami ng Itatapon" required type="number" value={ingQty} onChange={e => setIngQty(e.target.value)} min="0" step="any" />
              <Select label="Dahilan" required value={reason} onChange={e => setReason(e.target.value)}>
                {REASONS.ingredient.map(r => <option key={r}>{r}</option>)}
              </Select>
            </div>
            <Textarea label="Karagdagang Detalye" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Expired shelf life, amag..." rows={2} />
          </div>
        )}

        {logType === 'material' && (
          <div className="space-y-3">
            <Select label="Pumili ng Materyales" required value={matName} onChange={e => {
              const matched = materials.find(m => m.name === e.target.value);
              setMatName(e.target.value);
              if (matched) setMatUnit(matched.unit);
            }}>
              <option value="">— Piliin ang materyales —</option>
              {materials.map(m => (
                <option key={m.id} value={m.name}>{m.name} (Mayroon pa: {m.stock} {m.unit})</option>
              ))}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Quantity Lost" required type="number" value={matQty} onChange={e => setMatQty(e.target.value)} min="0" />
              <Select label="Dahilan" required value={reason} onChange={e => setReason(e.target.value)}>
                {REASONS.material.map(r => <option key={r}>{r}</option>)}
              </Select>
            </div>
            <Textarea label="Karagdagang Detalye" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Napunit habang hinahanda..." rows={2} />
          </div>
        )}

        {logType === 'product' && (
          <div className="space-y-3">
            <Select label="Select Product" required value={productName} onChange={e => {
              setProductName(e.target.value); setProductQty(''); setProductUnit('pcs');
            }}>
              <option value="">— Piliin ang product —</option>
              {products.filter(p => p.stock > 0).map(p => (
                <option key={p.id} value={p.name}>{p.name} (Current Stock: {p.stock} pcs)</option>
              ))}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Quantity" required type="number" value={productQty} onChange={e => setProductQty(e.target.value)} max={products.find(p => p.name === productName)?.stock || ''} />
              <Select label="Reason" required value={reason} onChange={e => setReason(e.target.value)}>
                {REASONS.product.map(r => <option key={r}>{r}</option>)}
              </Select>
            </div>
            <Textarea label="Additional Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. 5 ensaymada left unsold...\" rows={2} />
          </div>
        )}
      </Modal>

      <ConfirmModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={handleDelete} 
        title="Undo Waste Log" 
        message={`Burahin ang itinalagang waste record para sa "${deleteTarget?.item}"? Babalik sa dating stock ang dami na binawas dito.`}
      />
    </div>
  );
}