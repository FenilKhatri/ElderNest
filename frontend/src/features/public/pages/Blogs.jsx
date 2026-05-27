import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import http from '../../../lib/axios';
import { stagger, fadeUp } from '../../../animations/motionVariants';
import { formatDate } from '../../../utils/helpers';
import { Calendar, User } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await http.get('/blogs');
        setBlogs(res.data?.blogs || []);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Latest Insights & Articles</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and stories in elder care.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-slate-500">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-slate-500">No blogs available right now. Check back later!</div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <motion.div variants={fadeUp} key={blog._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                {blog.image ? (
                  <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">No Image</div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center space-x-4 mb-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {formatDate(blog.createdAt)}</span>
                    <span className="flex items-center"><User className="w-4 h-4 mr-1" /> {blog.author?.name || 'Admin'}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2">{blog.title}</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">{blog.content}</p>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                    <Link to={`/blogs/${blog._id}`} className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">
                      Read Full Article &rarr;
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blogs;