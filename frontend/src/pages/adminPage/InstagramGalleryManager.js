import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus, FaArrowUp, FaArrowDown, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../galleryPage/GalleryPage.css';

const InstagramGalleryManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputUrl, setInputUrl] = useState('');
  
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
      setLoading(false);
    } catch (err) {
      console.error('Fetch posts error:', err);
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
      alert("Invalid Instagram URL. Must be a Post link (/p/) or Reel link (/reel/).");
      return;
    }

    try {
      const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
      const userData = JSON.parse(localStorage.getItem('UserData'));
      const token = userData?.loginToken;
      
      const config = {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      };

      // Only sending instagramUrl. Backend generates the rest.
      await axios.post(`${serverUrl}/api/v1/instagram/admin`, {
        instagramUrl: inputUrl
      }, config);
      
      setInputUrl('');
      fetchPosts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add post';
      alert(msg);
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
        fetchPosts();
      } catch (err) {
        alert('Failed to delete post');
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
    } catch (err) {
      alert('Failed to update status');
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
        fetchPosts();
      } catch (err) {
        alert('Failed to save order');
        fetchPosts();
      }
  };

  if (loading) return <div className="p-4">Loading Gallery Manager...</div>;

  return (
    <div className="admin-container" style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Instagram Gallery Manager</h2>
      
      <div className="add-post-section" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Add New Post</h3>
        <form onSubmit={handleAddPost} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
             <div style={{ flex: 1, minWidth: '300px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#666' }}>Instagram URL (Post or Reel)</label>
                <input
                  type="text"
                  placeholder="https://www.instagram.com/reel/..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  required
                  style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                />
             </div>
            
            <button type="submit" style={{ padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaPlus /> Add Post
            </button>
        </form>
      </div>

      <div className="posts-list">
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Gallery Posts ({posts.length})</h3>
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
            <tr>

              <th style={{ padding: '12px', textAlign: 'left' }}>URL</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Order</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>No posts found. Add one above.</td></tr>
            ) : posts.map((post, index) => (
              <tr key={post._id} style={{ borderBottom: '1px solid #eee' }}>

                <td style={{ padding: '12px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <a href={post.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>{post.instagramUrl}</a>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleToggleStatus(post)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      color: post.isActive ? '#28a745' : '#dc3545',
                      fontSize: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'
                    }}
                    title={post.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {post.isActive ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                        <button onClick={() => movePost(post, 'up')} disabled={index === 0} style={{ border: '1px solid #ddd', background: 'none', borderRadius: '4px', padding: '4px 8px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.5 : 1 }}><FaArrowUp size={12}/></button>
                        <button onClick={() => movePost(post, 'down')} disabled={index === posts.length - 1} style={{ border: '1px solid #ddd', background: 'none', borderRadius: '4px', padding: '4px 8px', cursor: index === posts.length - 1 ? 'not-allowed' : 'pointer', opacity: index === posts.length - 1 ? 0.5 : 1 }}><FaArrowDown size={12}/></button>
                    </div>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button onClick={() => handleDelete(post._id)} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#dc3545', fontSize: '16px' }} title="Delete"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default InstagramGalleryManager;
