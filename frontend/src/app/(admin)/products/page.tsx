'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Download, Plus, Edit, Trash, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

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
            } else {
                await api.post('/products', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
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

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure?")) {
            await api.delete(`/products/${id}`);
            fetchProducts();
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

    const handleDeleteCategory = async (id: string) => {
        if (confirm("Are you sure you want to delete this category? All products within it will also be deleted!")) {
            try {
                await api.delete(`/categories/${id}`);
                await fetchCategories();
                setFormData({ ...formData, category_id: '' });
                fetchProducts();
            } catch (e: any) {
                console.error(e);
                alert(e.response?.data?.message || "Failed to delete category");
            }
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
                        <Download size={16} /> Export
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
                <select 
                    value={categoryId} 
                    onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
                    className="w-full md:w-64 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                >
                    <option value="">All Categories</option>
                    {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
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
                                            <img src={`http://localhost:8000/storage/${p.image}`} alt={p.name} className="w-10 h-10 object-cover rounded-md shadow-sm border border-slate-100" />
                                        ) : (
                                            <div className="w-10 h-10 bg-slate-50 rounded-md flex items-center justify-center text-slate-400 text-xs border border-slate-200">No Img</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-semibold text-slate-800">{p.name}</td>
                                    <td className="px-4 py-4 text-sm text-slate-500">{p.category?.name || '-'}</td>
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
                                    <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all">
                                        <option value="" disabled>Select Category</option>
                                        {categories.map((c: any) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
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
                                <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files ? e.target.files[0] : null})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none transition-all"/>
                                {typeof formData.image === 'string' && formData.image && (
                                    <div className="mt-2">
                                        <img src={`http://localhost:8000/storage/${formData.image}`} alt="Preview" className="w-16 h-16 object-cover rounded-md border border-slate-200" />
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
        </div>
    );
}
