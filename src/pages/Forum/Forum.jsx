import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import ForumNavbar from '../../components/ForumNavbar';
import './Forum.css';

// Mock data for demonstration
const mockPosts = [
  {
    _id: '1',
    content: 'Today marks 6 months of sobriety for me. The journey has been challenging but incredibly rewarding. Every day is a new opportunity to choose life over addiction.',
    author: {
      username: 'Sarah_Recovery',
      avatar: 'https://i.pravatar.cc/150?img=47'
    },
    likes: [1, 2, 3, 4, 5, 6, 7, 8],
    createdAt: new Date('2024-10-28'),
    category: 'recovery'
  },
  {
    _id: '2',
    content: 'Remember: You are stronger than your struggles. Reaching out for help is not a sign of weakness, it\'s a sign of courage. Keep fighting!',
    author: {
      username: 'Hope_Fighter',
      avatar: 'https://i.pravatar.cc/150?img=33'
    },
    likes: [1, 2, 3, 4, 5],
    createdAt: new Date('2024-10-29'),
    category: 'support'
  },
  {
    _id: '3',
    content: 'Just completed my first NA meeting. The support and understanding I received was overwhelming. If you\'re thinking about going, please do it. You won\'t regret it.',
    author: {
      username: 'NewBeginnings',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    likes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    createdAt: new Date('2024-10-30'),
    category: 'support'
  },
  {
    _id: '4',
    content: 'Celebrating 1 year clean today! To anyone struggling: it gets better. One day at a time. Don\'t give up on yourself.',
    author: {
      username: 'OneYearStrong',
      avatar: 'https://i.pravatar.cc/150?img=68'
    },
    likes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    createdAt: new Date('2024-10-31'),
    category: 'recovery'
  }
];

function Forum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostBody, setNewPostBody] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/forum/posts');
      const fetchedPosts = response.data.posts || response.data || [];
      // Use mock data if no posts from backend
      setPosts(fetchedPosts.length > 0 ? fetchedPosts : mockPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Use mock data on error
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to create a post');
      navigate('/login');
      return;
    }
    if (!newPostBody.trim()) {
      alert('Please enter some content');
      return;
    }

    try {
      const response = await api.post('/forum/posts', {
        title: 'Post',
        content: newPostBody,
        category: 'general'
      });
      console.log('Post created successfully:', response.data);
      setNewPostBody('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to create post: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleLike = async (postId, e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/forum/posts/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return (
      <>
        <ForumNavbar />
        <div className="forum-loading">Loading posts...</div>
      </>
    );
  }

  return (
    <>
      <ForumNavbar />
      <div className="forum-page">
        <div className="forum-wrapper">
          <div className="forum-header">
            <h1 className="forum-main-title">Community Support Forum</h1>
            <p className="forum-subtitle">Share your journey, inspire others, find support</p>
          </div>
          
          {!user && (
            <div className="login-prompt">
              <i className="fa fa-info-circle"></i>
              <span>You must be logged in to create posts. <Link to="/login">Login here</Link></span>
            </div>
          )}
          
          <form onSubmit={handleCreatePost} className="post-form">
            <div className="form-header">
              <i className="fa fa-pencil"></i>
              <h3>Share Your Thoughts</h3>
            </div>
            <textarea
              value={newPostBody}
              onChange={(e) => setNewPostBody(e.target.value)}
              placeholder="Share your story, support others, or ask for help..."
              rows="4"
            />
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                <i className="fa fa-paper-plane"></i> Post
              </button>
            </div>
          </form>

          <div className="posts-header">
            <h3 className="section-title">
              <i className="fa fa-comments"></i> Community Posts
            </h3>
            <span className="posts-count">{posts.length} posts</span>
          </div>

          {posts.length === 0 ? (
            <div className="no-posts">
              <i className="fa fa-inbox"></i>
              <p>No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header-info">
                  <div className="author-section">
                    <img 
                      src={post.author?.avatar || 'https://i.pravatar.cc/150?img=1'} 
                      alt={post.author?.username}
                      className="author-avatar"
                    />
                    <div className="author-details">
                      <h2 className="author-name">{post.author?.username || 'Anonymous'}</h2>
                      <span className="post-time">
                        <i className="fa fa-clock-o"></i> {new Date(post.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  {post.category && (
                    <span className={`post-badge ${post.category}`}>
                      {post.category}
                    </span>
                  )}
                </div>
                <p className="post-text">{post.content}</p>
                <div className="post-actions">
                  <button 
                    onClick={(e) => handleLike(post._id, e)}
                    className="action-btn like-btn"
                  >
                    <i className="fa fa-heart"></i>
                    <span>{post.likes?.length || 0} Likes</span>
                  </button>
                  <Link to={`/forum/post/${post._id}`} className="action-btn comment-btn">
                    <i className="fa fa-comment"></i>
                    <span>Comment</span>
                  </Link>
                  <button className="action-btn share-btn">
                    <i className="fa fa-share"></i>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Forum;
