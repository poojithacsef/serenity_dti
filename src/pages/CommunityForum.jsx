import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { addPost, toggleLike, addComment } from '../utils/db';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Send, Clock, Heart, MessageCircle } from 'lucide-react';
import { SkeletonPost } from '../components/SkeletonLoader';

const PostCard = ({ post, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const hasLiked = post.likes?.includes(currentUser.uid);

  useEffect(() => {
    if (!showComments) return;
    
    const q = query(collection(db, "Posts", post.id, "comments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [post.id, showComments]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike(post.id, currentUser.uid, hasLiked);
    } catch (error) {
      toast.error("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsCommenting(true);
    try {
      const authorName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Unknown User';
      await addComment(post.id, newComment, currentUser.uid, authorName);
      setNewComment('');
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl relative transition-all">
      <p className="text-slate-800 whitespace-pre-wrap">{post.content}</p>
      
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/50 pt-4">
        <div className="flex items-center gap-2">
          <span className="bg-slate-100/50 px-2 py-1 rounded-full text-slate-600 font-medium border border-slate-200/50">
            {post.authorName}
          </span>
          <span className="mx-1">•</span>
          <Clock className="w-3 h-3" />
          <span>{post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString() : 'Just now'}</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike} 
            disabled={isLiking}
            className={`flex items-center gap-1 transition-colors hover:text-red-500 ${hasLiked ? 'text-red-500' : 'text-slate-400'}`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{post.likes?.length || 0}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 transition-colors hover:text-blue-500 text-slate-400"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">Comment</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-200/50">
          {/* Comment List */}
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No comments yet. Be the first to reply!</p>
            ) : (
              comments.map(c => (
                <div key={c.id} className="bg-white/40 p-3 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700">{c.authorName}</span>
                    <span className="text-[10px] text-slate-400">
                      {c.createdAt ? new Date(c.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{c.content}</p>
                </div>
              ))
            )}
          </div>
          
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow bg-white/50 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue"
            />
            <button
              type="submit"
              disabled={isCommenting || !newComment.trim()}
              className="bg-slate-800 text-white p-2 rounded-full hover:bg-slate-700 disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "Posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    try {
      // Use profile name or fallback
      const authorName = userProfile?.name || currentUser.displayName || currentUser.email?.split('@')[0] || 'Unknown User';
      await addPost(newPostContent, currentUser.uid, authorName);
      setNewPostContent('');
      toast.success('Your thought was shared with the community.');
    } catch (error) {
      toast.error('Failed to post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Community Forum</h1>
        <p className="text-slate-600 mt-2">Share your thoughts safely in a judgment-free space.</p>
      </div>

      {/* Post Form */}
      <div className="glass p-6 rounded-3xl mb-10">
        <form onSubmit={handleSubmit}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-pastel-blue resize-none min-h-[120px]"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-slate-400">
              {newPostContent.length}/500 characters
            </span>
            <button
              type="submit"
              disabled={isPosting || !newPostContent.trim()}
              className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
              {isPosting ? 'Posting...' : 'Post Message'}
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {loading ? (
          <>
            <SkeletonPost />
            <SkeletonPost />
            <SkeletonPost />
          </>
        ) : posts.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            No posts yet. Be the first to share!
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} currentUser={currentUser} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityForum;
