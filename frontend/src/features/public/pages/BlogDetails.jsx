import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import http from '../../../lib/axios';
import { formatDate } from '../../../utils/helpers';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await http.get(`/blogs/${id}`);
        setBlog(res.data?.blog);
      } catch (error) {
        console.error("Failed to fetch blog", error);
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">Loading...</div>;
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/blogs" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
        </Link>
        
        <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {blog.image && (
            <img src={blog.image} alt={blog.title} className="w-full h-96 object-cover" />
          )}
          <div className="p-8 sm:p-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-6">
              <span className="flex items-center"><Calendar className="w-5 h-5 mr-2" /> {formatDate(blog.createdAt)}</span>
              <span className="flex items-center"><User className="w-5 h-5 mr-2" /> {blog.author?.name || 'Admin'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
              {blog.title}
            </h1>
            
            <div className="prose dark:prose-invert max-w-none prose-slate text-lg text-slate-700 dark:text-slate-300">
              {blog.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300 mr-2">Tags:</span>
                {blog.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetails;