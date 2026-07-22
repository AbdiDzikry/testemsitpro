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
    const [formData, setFormData] = useState({ name: '', category_id: '', stock: 0, price: 0 });

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

    const handleExport = () => {
        window.open('http://localhost:8000/api/products/export', '_blank');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, formData);
            } else {
                await api.post('/products', formData);
            }
            setShowModal(false);
            setFormData({ name: '', category_id: '', stock: 0, price: 0 });
            setEditingId(null);
            fetchProducts();
        } catch (e) {
            console.error(e);
            alert("Error saving data");
        }
    };

    const handleEdit = (product: any) => {
        setFormData({
            name: product.name,
            category_id: product.category_id,
            stock: product.stock,
            price: product.price
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

    const SortIcon = ({ field }: { field: string }) => {
        if (sortField !== field) return null;
        return <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6 min-h-[calc(100vh-4rem)] relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Products</h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded font-medium transition">
                        <Download size={18} /> Export Excel
                    </button>
                    <button onClick={() => { setEditingId(null); setFormData({ name: '', category_id: '', stock: 0, price: 0 }); setShowModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded font-medium transition">
                        <Plus size={18} /> Add Product
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select 
                    value={categoryId} 
                    onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
                    className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 font-medium text-slate-600 cursor-pointer" onClick={() => handleSort('id')}>ID <SortIcon field="id"/></th>
                            <th className="px-4 py-3 font-medium text-slate-600 cursor-pointer" onClick={() => handleSort('name')}>Name <SortIcon field="name"/></th>
                            <th className="px-4 py-3 font-medium text-slate-600">Category</th>
                            <th className="px-4 py-3 font-medium text-slate-600 cursor-pointer" onClick={() => handleSort('stock')}>Stock <SortIcon field="stock"/></th>
                            <th className="px-4 py-3 font-medium text-slate-600 cursor-pointer" onClick={() => handleSort('price')}>Price (Rp) <SortIcon field="price"/></th>
                            <th className="px-4 py-3 font-medium text-slate-600 w-24 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-8 text-slate-500">Loading data...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8 text-slate-500">No products found.</td></tr>
                        ) : (
                            products.map((p: any) => (
                                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                    <td className="px-4 py-3 text-slate-700">{p.id}</td>
                                    <td className="px-4 py-3 text-slate-800 font-medium">{p.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{p.category?.name || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600">{p.stock}</td>
                                    <td className="px-4 py-3 text-slate-600">{Number(p.price).toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3 flex gap-2 justify-center">
                                        <button onClick={() => handleEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit size={16}/></button>
                                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash size={16}/></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-slate-500">
                    Page {page} of {lastPage}
                </div>
                <div className="flex gap-2">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(page - 1)}
                        className="p-2 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button 
                        disabled={page === lastPage || lastPage === 0} 
                        onClick={() => setPage(page + 1)}
                        className="p-2 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <ChevronRight size={18} />
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                                    <option value="" disabled>Select Category</option>
                                    {categories.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                                    <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                                    <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-2 justify-end">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
