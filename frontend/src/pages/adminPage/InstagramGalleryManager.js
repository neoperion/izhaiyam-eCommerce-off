import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, ArrowUp, ArrowDown, Eye, EyeOff, Move, Image as ImageIcon, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout'; // Import AdminLayout
import { useToast } from "../../context/ToastContext";

export const InstagramGalleryManager = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [inputUrl, setInputUrl] = useState('');
    const { toastSuccess, toastError, toastWarn } = useToast();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
            const userData = JSON.parse(localStorage.getItem('UserData'));
            const token = userData?.loginToken;

            if (!token) return;

            const response = await axios.get(`${serverUrl}/api/v1/instagram/admin`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data.posts || []);
        } catch (err) {
            console.error('Fetch posts error:', err);
            toastError("Failed to fetch gallery posts");
        } finally {
            setLoading(false);
        }
    };

    const validateUrl = (url) => {
        if (!url) return false;
        const regex = /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/(p|reel)\//;
        return regex.test(url);
    };

    const handleAddPost = async (e) => {
        e.preventDefault();

        if (!validateUrl(inputUrl)) {
            toastWarn("Invalid Instagram URL. Must be a Post link (/p/) or Reel link (/reel/).");
            return;
        }

        try {
            setActionLoading(true);
            const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
            const userData = JSON.parse(localStorage.getItem('UserData'));
            const token = userData?.loginToken;

            const config = {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post(`${serverUrl}/api/v1/instagram/admin`, {
                instagramUrl: inputUrl
            }, config);

            setInputUrl('');
            toastSuccess("Post added successfully");
            fetchPosts();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to add post';
            toastError(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
                const userData = JSON.parse(localStorage.getItem('UserData'));
                const token = userData?.loginToken;
                await axios.delete(`${serverUrl}/api/v1/instagram/admin/${id}`, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                });
                toastSuccess("Post deleted");
                fetchPosts();
            } catch (err) {
                toastError('Failed to delete post');
            }
        }
    };

    const handleToggleStatus = async (post) => {
        try {
            const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
            const userData = JSON.parse(localStorage.getItem('UserData'));
            const token = userData?.loginToken;
            await axios.put(`${serverUrl}/api/v1/instagram/admin/${post._id}`, {
                isActive: !post.isActive
            }, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPosts();
            toastSuccess(`Post ${post.isActive ? 'hidden' : 'visible'} now`);
        } catch (err) {
            toastError('Failed to update status');
        }
    };

    const movePost = async (post, direction) => {
        const index = posts.findIndex(p => p._id === post._id);
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === posts.length - 1) return;

        const newPosts = [...posts];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        [newPosts[index], newPosts[targetIndex]] = [newPosts[targetIndex], newPosts[index]];

        const updates = newPosts.map((p, idx) => ({
            _id: p._id,
            displayOrder: idx + 1
        }));

        setPosts(newPosts);

        try {
            const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
            const userData = JSON.parse(localStorage.getItem('UserData'));
            const token = userData?.loginToken;
            await axios.patch(`${serverUrl}/api/v1/instagram/admin/reorder`, { posts: updates }, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            // fetchPosts(); // Optional, local state update is instant
            toastSuccess("Order updated");
        } catch (err) {
            toastError('Failed to save order');
            fetchPosts(); // Revert on error
        }
    };

    return (
        <AdminLayout>
            <section className="w-full xl:px-[4%] px-[4%] lg:px-[2%]">
                <div className="container mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <ImageIcon className="w-8 h-8 text-primaryColor" /> 
                                Instagram Gallery
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Manage showing your Instagram posts on the website</p>
                        </div>
                    </div>

                    {/* Add Post Input */}
                    <div className="bg-white rounded-xl shadow-md border p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Post</h3>
                        <form onSubmit={handleAddPost} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Instagram URL (Post or Reel)
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://www.instagram.com/reel/..."
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-80 transition-all flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap h-[42px]"
                            >
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Add Post
                            </button>
                        </form>
                    </div>

                    {/* Posts Table */}
                    <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                             <h3 className="text-lg font-bold text-gray-800">Gallery Items ({posts.length})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[700px]">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider w-16 text-center">Order</th>
                                        <th className="p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Post URL</th>
                                        <th className="p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Status</th>
                                        <th className="p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Move</th>
                                        <th className="p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                                <div className="flex justify-center items-center gap-2">
                                                     <Loader2 className="w-6 h-6 animate-spin text-primaryColor" />
                                                     <span>Loading gallery...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : posts.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                                No gallery posts found. Add your first Instagram link above.
                                            </td>
                                        </tr>
                                    ) : (
                                        posts.map((post, index) => (
                                            <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-center font-mono text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="p-4">
                                                    <a
                                                        href={post.instagramUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline text-sm truncate max-w-[300px] block"
                                                    >
                                                        {post.instagramUrl}
                                                    </a>
                                                    <span className="text-xs text-gray-400 mt-1 block">ID: {post.instagramId || 'Pending...'}</span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => handleToggleStatus(post)}
                                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                                            post.isActive
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {post.isActive ? (
                                                            <>
                                                                <Eye className="w-3 h-3 mr-1" /> Visible
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="w-3 h-3 mr-1" /> Hidden
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => movePost(post, 'up')}
                                                            disabled={index === 0}
                                                            className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors"
                                                            title="Move Up"
                                                        >
                                                            <ArrowUp className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => movePost(post, 'down')}
                                                            disabled={index === posts.length - 1}
                                                            className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors"
                                                            title="Move Down"
                                                        >
                                                            <ArrowDown className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(post._id)}
                                                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Delete Post"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
};

// export default InstagramGalleryManager;
