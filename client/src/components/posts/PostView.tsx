import React, { useState, useEffect } from 'react';

// --- Types ---
export type PostStatus = 'To Do' | 'In Progress' | 'Completed';

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: PostStatus;
  createdAt: string;
}

// --- Mock Data ---
const initialPosts: Post[] = [
  {
    id: '1',
    title: 'Project Kickoff',
    description: 'Initial meeting with the stakeholders to define project scope and deliverables.',
    status: 'To Do',
    createdAt: '2025-07-15',
  },
  {
    id: '2',
    title: 'Design System',
    description: 'Create a unified design system with colors, typography, and components.',
    status: 'In Progress',
    createdAt: '2025-07-20',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    title: 'User Authentication',
    description: 'Implement login and registration flows using OAuth.',
    status: 'Completed',
    createdAt: '2025-10-30',
  },
];

// --- Helper Components ---
const Icon: React.FC<{ name: string; className?: string; onClick?: () => void }> = ({ name, className = "", onClick }) => (
  <span onClick={onClick} className={`material-icons-outlined select-none ${className}`}>
    {name}
  </span>
);

// --- Sub-Components ---

// 1. Header
const Header: React.FC = () => (
  <header className="p-4 bg-background-light dark:bg-background-dark sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Icon name="article" className="text-primary" />
        Post Manager
      </h1>
      <div className="flex items-center space-x-4">
        <div className="relative cursor-pointer">
          <Icon name="notifications" className="text-slate-600 dark:text-slate-400" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">3</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm cursor-pointer">
          A
        </div>
      </div>
    </div>
  </header>
);

// 2. Post Modal (Add/Edit)
interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Post) => void;
  postToEdit?: Post | null;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onSave, postToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<PostStatus>('To Do');
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setDescription(postToEdit.description);
      setStatus(postToEdit.status);
      setImageUrl(postToEdit.imageUrl || '');
    } else {
      resetForm();
    }
  }, [postToEdit, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('To Do');
    setImageUrl('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: Post = {
      id: postToEdit ? postToEdit.id : Date.now().toString(),
      title,
      description,
      status,
      imageUrl: imageUrl || undefined,
      createdAt: postToEdit ? postToEdit.createdAt : new Date().toISOString().split('T')[0],
    };
    onSave(newPost);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {postToEdit ? 'Edit Post' : 'New Post'}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-red-500 transition-colors">
            <Icon name="close" className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent dark:text-white"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PostStatus)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary bg-transparent dark:text-white dark:bg-slate-900"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent dark:text-white resize-none"
              placeholder="What's this post about?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image (Optional)</label>
            <div className="space-y-3">
              <label className="cursor-pointer flex items-center justify-center space-x-2 px-4 py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <div className="text-center">
                    <Icon name="cloud_upload" className="text-slate-400 group-hover:text-primary text-3xl mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Click to upload image</p>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              {imageUrl && (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                  <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                  >
                    <Icon name="close" className="text-sm" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2 bg-slate-50 dark:bg-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
            >
              {postToEdit ? 'Save Changes' : 'Create Post'}
            </button>
        </div>
      </div>
    </div>
  );
}

// 3. Post Card
const PostCard: React.FC<{ post: Post; onEdit: (post: Post) => void; onDelete: (id: string) => void }> = ({ post, onEdit, onDelete }) => (
  <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
    {post.imageUrl && (
      <div className="h-32 w-full overflow-hidden relative">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    )}
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-tight pr-2">{post.title}</h3>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onEdit(post); }} className="p-1 text-slate-400 hover:text-primary rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Icon name="edit" className="text-sm" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(post.id); }} className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Icon name="delete" className="text-sm" />
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">{post.description}</p>
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto">
        <span className="flex items-center gap-1">
            <Icon name="calendar_today" className="text-[14px]" />
            {post.createdAt}
        </span>
        {post.status === 'Completed' && <Icon name="check_circle" className="text-green-500 text-sm" />}
      </div>
    </div>
  </div>
);

// 4. Main Component
const PostView: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleSavePost = (post: Post) => {
    if (editingPost) {
      setPosts(posts.map(p => p.id === post.id ? post : p));
    } else {
      setPosts([...posts, post]);
    }
  };

  const handleDeletePost = (id: string) => {
    if(window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const columns: { id: string; title: string; status: PostStatus; color: string }[] = [
    { id: 'todo', title: 'To Do', status: 'To Do', color: 'bg-blue-500' },
    { id: 'progress', title: 'In Progress', status: 'In Progress', color: 'bg-yellow-500' },
    { id: 'completed', title: 'Completed', status: 'Completed', color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display transition-colors duration-200">
      <Header />

      <main className="flex-1 p-4 md:p-6 overflow-x-hidden max-w-7xl mx-auto w-full">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'board' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <Icon name="grid_view" className="text-[18px]" /> <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <Icon name="list" className="text-[18px]" /> <span>List</span>
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="hidden sm:flex bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium items-center space-x-2 transition-colors shadow-sm hover:shadow-md"
          >
            <Icon name="add" /> <span>Add Post</span>
          </button>
        </div>

        {/* Board View */}
        {viewMode === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full items-start">
            {columns.map(col => (
              <div key={col.id} className="flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${col.color}`} />
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100">{col.title}</h2>
                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">
                      {posts.filter(p => p.status === col.status).length}
                    </span>
                  </div>
                  <button onClick={openAddModal} className="text-slate-400 hover:text-primary transition-colors">
                    <Icon name="add" />
                  </button>
                </div>

                <div className="space-y-4 min-h-[100px]">
                  {posts.filter(p => p.status === col.status).map(post => (
                    <PostCard key={post.id} post={post} onEdit={openEditModal} onDelete={handleDeletePost} />
                  ))}
                  {posts.filter(p => p.status === col.status).length === 0 && (
                     <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm italic">
                        No posts
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
             {posts.length === 0 ? (
               <div className="p-12 text-center text-slate-500">No posts found. Start by adding one!</div>
             ) : (
               <div className="divide-y divide-slate-100 dark:divide-slate-800">
                 {posts.map(post => (
                   <div key={post.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                     {post.imageUrl ? (
                        <img src={post.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                     ) : (
                        <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                            <Icon name="image" />
                        </div>
                     )}
                     <div className="flex-1 min-w-0">
                       <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">{post.title}</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{post.description}</p>
                       <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                         <Icon name="calendar_today" className="text-[12px]" /> {post.createdAt}
                       </div>
                     </div>
                     <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 w-full sm:w-auto">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          post.status === 'Completed' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' :
                          post.status === 'In Progress' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400' :
                          'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                        }`}>
                          {post.status}
                        </span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEditModal(post)} className="p-2 text-slate-400 hover:text-primary transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <Icon name="edit" />
                          </button>
                          <button onClick={() => handleDeletePost(post.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <Icon name="delete" />
                          </button>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={openAddModal}
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
        aria-label="Add Post"
      >
        <Icon name="add" className="text-2xl" />
      </button>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePost}
        postToEdit={editingPost}
      />
    </div>
  );
};

export default PostView;