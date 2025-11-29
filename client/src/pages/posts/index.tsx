import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import MainDashboardLayout from '@/components/dashboard/MainDashboardLayout';
import CreateEditPostDialog from '@/components/posts/CreateEditPostDialog';
import postsService, { Post } from '@/services/posts.service';

interface PostFormData {
  id?: string;
  title: string;
  description: string;
  status?: 'published' | 'draft' | 'archived';
  file?: File;
}

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError('');
        const fetchedPosts = await postsService.getAll();
        setPosts(fetchedPosts);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const activePostData = editingPostId ? (() => {
    const post = posts.find(p => p.id === editingPostId);
    return post ? {
      id: post.id,
      title: post.title,
      description: post.description || '',
      status: post.status
    } : undefined;
  })() : undefined;

  const handleCreate = () => {
    setEditingPostId(null);
    setDialogOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPostId(post.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setLoading(true);
        setError('');
        await postsService.delete(id);
        setPosts(prev => prev.filter(post => post.id !== id));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to delete post');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async (data: PostFormData) => {
    try {
      setLoading(true);
      setError('');
      if (data.id) {
        const updatedPost = await postsService.update(data.id, {
          id: data.id,
          title: data.title,
          content: data.description,
          status: data.status
        }, data.file);
        setPosts(prev => prev.map(post => post.id === data.id ? updatedPost : post));
      } else {
        const newPost = await postsService.create({
          title: data.title,
          content: data.description,
          status: data.status
        }, data.file);
        setPosts(prev => [newPost, ...prev]);
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainDashboardLayout title="Posts Management">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1>Posts</h1>
            <button onClick={handleCreate} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              Create Post
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '64px 0' }}>
            <div>Loading...</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <Image
                    src={post.imageUrl || 'https://picsum.photos/800/600'}
                    alt={post.title}
                    width={300}
                    height={140}
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '16px' }}>
                    <h2 style={{ margin: '0 0 8px 0' }}>{post.title}</h2>
                    <p style={{ margin: '0 0 16px 0', color: '#666' }}>{post.description}</p>
                    <div>
                      <button onClick={() => handleEdit(post)} style={{ marginRight: '8px', padding: '4px 8px' }}>Edit</button>
                      <button onClick={() => handleDelete(post.id)} style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', border: '2px dashed #ddd' }}>
                <div style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }}>📝</div>
                <h2>No posts found</h2>
                <button onClick={handleCreate} style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                  Create Post
                </button>
              </div>
            )}
          </div>
        )}

        <CreateEditPostDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSave}
          initialData={activePostData}
          title={activePostData ? 'Edit Post' : 'Create New Post'}
        />
      </div>
    </MainDashboardLayout>
  );
};

export default PostsPage;
