'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { Download, Plus, Edit, Trash, Search, ChevronLeft, ChevronRight, X, ChevronDown, FileText, AlertTriangle } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, placeholder, className = '' }: { value: string, onChange: (val: string) => void, options: {value: string, label: string}[], placeholder: string, className?: string }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className={`relative ${className}`} ref={ref}>
            <div 
                onClick={() => setOpen(!open)}
                className={`w-full px-4 py-2 bg-slate-50 border ${open ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200'} rounded-lg text-sm transition-all cursor-pointer flex justify-between items-center`}
            >
                <span className={selectedOption ? 'text-slate-800' : 'text-slate-500'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </div>
            {open && (
                <div className="absolute z-[70] w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] max-h-60 overflow-y-auto py-2">
                    <div 
                        onClick={() => { onChange(''); setOpen(false); }}
                        className="px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                        {placeholder}
                    </div>
                    {options.map(opt => (
                        <div 
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === opt.value ? 'bg-orange-50 text-orange-600 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination & Sorting & Filters
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', category_id: '', stock: 0, price: 0, image: null });
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products', {
                params: { page, search, category_id: categoryId, sort_field: sortField, sort_order: sortOrder }
            });
            setProducts(res.data.data);
            setLastPage(res.data.last_page);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [page, search, categoryId, sortField, sortOrder]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/products/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error('Export error', e);
            alert('Failed to export data');
        }
    };

    const handleExportPdf = async () => {
        try {
            const response = await api.get('/products/export-pdf', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'laporan-produk-emsitpro.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error('Export PDF error', e);
            alert('Failed to export PDF');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('category_id', formData.category_id);
            submitData.append('stock', formData.stock.toString());
            submitData.append('price', formData.price.toString());
            
            if (formData.image instanceof File) {
                submitData.append('image', formData.image);
            }

            if (editingId) {
                submitData.append('_method', 'PUT');
                await api.post(`/products/${editingId}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setToastMessage('Produk berhasil diperbarui!');
            } else {
                await api.post('/products', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setToastMessage('Produk berhasil ditambahkan!');
            }
            
            setTimeout(() => setToastMessage(null), 3000);
            
            setShowModal(false);
            setFormData({ name: '', category_id: '', stock: 0, price: 0, image: null });
            setEditingId(null);
            setIsAddingCategory(false);
            setNewCategoryName('');
            fetchProducts();
        } catch (e: any) {
            console.error(e);
            alert(e.response?.data?.message || "Error saving data");
        }
    };

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            category_id: product.category_id,
            stock: product.stock,
            price: parseInt(product.price, 10),
            image: product.image
        });
        setEditingId(product.id);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        setDeleteConfirmId(id);
    };

    const confirmDeleteProduct = async () => {
        if (!deleteConfirmId) return;
        try {
            await api.delete(`/products/${deleteConfirmId}`);
            setDeleteConfirmId(null);
            fetchProducts();
        } catch (e: any) {
            console.error(e);
            alert("Failed to delete product");
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const res = await api.post('/categories', { name: newCategoryName });
            await fetchCategories();
            setFormData({ ...formData, category_id: res.data.id });
            setIsAddingCategory(false);
            setNewCategoryName('');
        } catch (e: any) {
            console.error(e);
            alert(e.response?.data?.message || "Failed to add category");
        }
    };

    const [deleteCategoryConfirmId, setDeleteCategoryConfirmId] = useState<string | null>(null);

    const handleDeleteCategory = (id: string) => {
        setDeleteCategoryConfirmId(id);
    };

    const confirmDeleteCategory = async () => {
        if (!deleteCategoryConfirmId) return;
        try {
            await api.delete(`/categories/${deleteCategoryConfirmId}`);
            await fetchCategories();
            if (formData.category_id === deleteCategoryConfirmId) {
                setFormData({ ...formData, category_id: '' });
            }
            setDeleteCategoryConfirmId(null);
            fetchProducts();
        } catch (e: any) {
            console.error(e);
            alert(e.response?.data?.message || "Failed to delete category");
        }
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (sortField !== field) return null;
        return <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-6 min-h-[calc(100vh-4rem)] relative flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Products List</h1>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-all text-sm">
                        <Download size={16} /> Excel
                    </button>
                    <button onClick={handleExportPdf} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-all text-sm">
                        <FileText size={16} /> PDF
                    </button>
                    <button onClick={() => { setEditingId(null); setFormData({ name: '', category_id: '', stock: 0, price: 0, image: null }); setShowModal(true); }} className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-lg font-medium transition-all text-sm shadow-sm shadow-orange-500/20">
                        <Plus size={16} /> Add Product
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                </div>
                <CustomSelect 
                    value={categoryId} 
                    onChange={(val) => { setCategoryId(val); setPage(1); }}
                    placeholder="All Categories"
                    options={categories.map((c: any) => ({ value: c.id.toString(), label: c.name }))}
                    className="w-full md:w-64"
                />
                <CustomSelect 
                    value={`${sortField}-${sortOrder}`} 
                    onChange={(val) => { 
                        if (!val) { setSortField('id'); setSortOrder('desc'); }
                        else {
                            const [f, o] = val.split('-'); 
                            setSortField(f); 
                            setSortOrder(o); 
                        }
                        setPage(1); 
                    }}
                    placeholder="Default Sorting"
                    options={[
                        { value: 'id-desc', label: 'Latest Added' },
                        { value: 'name-asc', label: 'Name (A-Z)' },
                        { value: 'name-desc', label: 'Name (Z-A)' },
                        { value: 'price-asc', label: 'Lowest Price' },
                        { value: 'price-desc', label: 'Highest Price' },
                    ]}
                    className="w-full md:w-48"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                            <th className="px-4 py-3 font-semibold cursor-pointer hover:text-slate-600" onClick={() => handleSort('id')}>ID <SortIcon field="id"/></th>
                            <th className="px-4 py-3 font-semibold w-16">Image</th>
                            <th className="px-4 py-3 font-semibold cursor-pointer hover:text-slate-600" onClick={() => handleSort('name')}>Name <SortIcon field="name"/></th>
                            <th className="px-4 py-3 font-semibold">Category</th>
                            <th className="px-4 py-3 font-semibold cursor-pointer hover:text-slate-600" onClick={() => handleSort('stock')}>Stock <SortIcon field="stock"/></th>
                            <th className="px-4 py-3 font-semibold cursor-pointer hover:text-slate-600" onClick={() => handleSort('price')}>Price (Rp) <SortIcon field="price"/></th>
                            <th className="px-4 py-3 font-semibold w-24 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-8 text-slate-500">Loading data...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-8 text-slate-500">No products found.</td></tr>
                        ) : (
                            products.map((p: any) => (
                                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-4 text-sm text-slate-500">{p.id}</td>
                                    <td className="px-4 py-4">
                                        {p.image ? (
                                            <img 
                                                src={`http://localhost:8000/storage/${p.image}`} 
                                                alt={p.name} 
                                                onClick={() => setPreviewImage(p.image)}
                                                className="w-10 h-10 object-cover rounded-md shadow-sm border border-slate-100 cursor-pointer hover:opacity-80 transition-opacity" 
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-slate-50 rounded-md flex items-center justify-center text-slate-400 text-xs border border-slate-200">No Img</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-semibold text-slate-800">{p.name}</td>
                                    <td className="px-4 py-4 text-sm text-slate-500">{p.category_name || p.category?.name || '-'}</td>
                                    <td className="px-4 py-4 text-sm text-slate-500">{p.stock}</td>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-700">{Number(p.price).toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-4 flex gap-1 justify-center">
                                        <button onClick={() => handleEdit(p)} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"><Edit size={16}/></button>
                                        <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash size={16}/></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                <div className="text-sm font-medium text-slate-500">
                    Page {page} of {lastPage}
                </div>
                <div className="flex gap-2">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(page - 1)}
                        className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        disabled={page === lastPage || lastPage === 0} 
                        onClick={() => setPage(page + 1)}
                        className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSave} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"/>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase">Category</label>
                                    {!isAddingCategory && (
                                        <div className="flex gap-4">
                                            {formData.category_id && (
                                                <button type="button" onClick={() => handleDeleteCategory(formData.category_id)} className="text-xs text-red-500 font-medium hover:text-red-600 flex items-center gap-1">
                                                    <Trash size={12}/> Delete Category
                                                </button>
                                            )}
                                            <button type="button" onClick={() => setIsAddingCategory(true)} className="text-xs text-orange-500 font-medium hover:text-orange-600 flex items-center gap-1">
                                                <Plus size={12}/> New Category
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isAddingCategory ? (
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={newCategoryName} 
                                            onChange={e => setNewCategoryName(e.target.value)} 
                                            placeholder="Category name"
                                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                                        />
                                        <button type="button" onClick={handleAddCategory} className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 shadow-sm shadow-orange-500/20">Save</button>
                                        <button type="button" onClick={() => { setIsAddingCategory(false); setNewCategoryName(''); }} className="px-3 py-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center"><X size={16}/></button>
                                    </div>
                                ) : (
                                    <CustomSelect 
                                        value={formData.category_id ? formData.category_id.toString() : ''} 
                                        onChange={(val) => setFormData({...formData, category_id: val})}
                                        placeholder="Select Category"
                                        options={categories.map((c: any) => ({ value: c.id.toString(), label: c.name }))}
                                    />
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Stock</label>
                                    <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value ? parseInt(e.target.value) : '' as any})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Price</label>
                                    <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value ? parseInt(e.target.value) : '' as any})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Image (Optional)</label>
                                <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files ? e.target.files[0] : null})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer file:shadow-sm file:shadow-orange-500/20 text-slate-500"/>
                                {typeof formData.image === 'string' && formData.image && (
                                    <div className="mt-2">
                                        <img 
                                            src={`http://localhost:8000/storage/${formData.image}`} 
                                            alt="Preview" 
                                            onClick={() => setPreviewImage(formData.image as string)}
                                            className="w-16 h-16 object-cover rounded-md border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity" 
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 flex gap-3 justify-end border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-all shadow-sm shadow-orange-500/20">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {previewImage && (
                <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-[60]" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button onClick={() => setPreviewImage(null)} className="absolute -top-4 -right-4 p-2 bg-white text-slate-800 hover:text-red-500 hover:bg-slate-50 rounded-full shadow-lg transition-all"><X size={20}/></button>
                        <img src={`http://localhost:8000/storage/${previewImage}`} alt="Full Preview" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
                    </div>
                </div>
            )}

            {deleteConfirmId && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[70] animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Hapus Produk?</h2>
                            <p className="text-sm text-slate-500 mb-6">
                                Tindakan ini tidak dapat dibatalkan. Data produk akan dihapus secara permanen dari sistem.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button 
                                    onClick={() => setDeleteConfirmId(null)} 
                                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={confirmDeleteProduct} 
                                    className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 shadow-sm shadow-red-500/20 transition-colors"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteCategoryConfirmId && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[80] animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Hapus Kategori?</h2>
                            <p className="text-sm text-slate-500 mb-6">
                                Peringatan keras: Menghapus kategori ini juga akan menghapus <strong>seluruh produk</strong> yang ada di dalamnya secara permanen!
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button 
                                    onClick={() => setDeleteCategoryConfirmId(null)} 
                                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={confirmDeleteCategory} 
                                    className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 shadow-sm shadow-red-500/20 transition-colors"
                                >
                                    Ya, Hapus Semua
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toastMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span className="text-sm font-medium">{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
