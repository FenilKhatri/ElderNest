import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import http from '../../../lib/axios';
import { stagger, fadeUp } from '../../../animations/motionVariants';
import { formatDate } from '../../../utils/helpers';
import { getBlogImageUrl } from '../../../utils/blogImage';
import { Calendar, User, Search, Clock, ArrowRight } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Health", "Tips", "Wellness", "Caregiving", "Lifestyle"];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await http.get('/blogs');
        const fetchedBlogs = res.data?.blogs || [];
        setBlogs(fetchedBlogs);
        setFiltered(fetchedBlogs);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = blogs;

    if (activeCategory !== "All") {
      result = result.filter(b => b.tags?.some(t => t.toLowerCase() === activeCategory.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => b.title?.toLowerCase().includes(q));
    }

    setFiltered(result);
  }, [search, activeCategory, blogs]);

  // Strip HTML for plain text excerpt
  const getExcerpt = (htmlString) => {
    if (!htmlString) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = htmlString;
    return tmp.textContent || tmp.innerText || "";
  };

  const featuredBlog = filtered.length > 0 ? filtered[0] : null;
  const regularBlogs = filtered.length > 1 ? filtered.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-site-wide mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Latest Insights & Articles</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 w-full max-w-4xl mx-auto">
            Stay updated with the latest trends, tips, and stories in elder care.
          </p>
        </div>

        {/* Search & Filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm shadow-sm"
              />
            </div>
            
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 animate-pulse h-96">
                <div className="w-full h-40 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center bg-white dark:bg-slate-800 rounded-3xl p-16 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-400">
               <Search className="w-8 h-8" />
             </div>
             <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No articles found</p>
             <p className="text-slate-500 max-w-md">Try searching with a different keyword or category.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Blog */}
            {featuredBlog && !search && activeCategory === "All" && (
              <motion.div variants={fadeUp} initial="hidden" animate="show">
                <Link to={`/blogs/${featuredBlog._id}`} className="group block bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 aspect-video md:aspect-auto h-64 md:h-auto overflow-hidden">
                    {getBlogImageUrl(featuredBlog) ? (
                      <img src={getBlogImageUrl(featuredBlog)} alt={featuredBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-blue-300 font-bold">Featured Image</div>
                    )}
                  </div>
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <span className="flex items-center font-medium px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">Featured</span>
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {formatDate(featuredBlog.createdAt)}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> 5 min read</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {featuredBlog.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 leading-relaxed">
                      {getExcerpt(featuredBlog.content)}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <User className="w-full h-full p-2 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{featuredBlog.author?.name || 'ElderNest Team'}</p>
                          <p className="text-xs text-slate-500">Author</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                        Read Article <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Regular Blogs Grid */}
            <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {(search || activeCategory !== "All" ? filtered : regularBlogs).map((blog) => (
                  <motion.div layout variants={fadeUp} initial="hidden" animate="show" exit="hidden" key={blog._id}>
                    <Link to={`/blogs/${blog._id}`} className="group block bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all h-full flex flex-col">
                      <div className="w-full aspect-[16/10] overflow-hidden">
                        {getBlogImageUrl(blog) ? (
                          <img src={getBlogImageUrl(blog)} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-medium">No Image</div>
                        )}
                      </div>
                      
                      <div className="p-6 md:p-8 flex-1 flex flex-col">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                          {blog.tags && blog.tags.length > 0 && (
                            <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                              {blog.tags[0]}
                            </span>
                          )}
                          <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {formatDate(blog.createdAt)}</span>
                        </div>
                        
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {blog.title}
                        </h2>
                        
                        <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                          {getExcerpt(blog.content)}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <User className="w-full h-full p-1.5 text-slate-400" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[100px]">
                              {blog.author?.name || 'ElderNest Team'}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center group-hover:translate-x-1 transition-transform">
                            Read <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;