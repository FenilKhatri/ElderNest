import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import http from '../../../lib/axios';
import { formatDate } from '../../../utils/helpers';
import { getBlogImageUrl } from '../../../utils/blogImage';
import { Calendar, Search, ArrowRight, ChevronDown, Clock } from 'lucide-react';
import { stagger, fadeUp } from '../../../animations/motionVariants';
import { BLOG_CATEGORIES } from '../../../constants/appConstants';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  const categories = BLOG_CATEGORIES;

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
    if (activeCategory !== "All Categories") {
      result = result.filter(b => 
        b.category?.toLowerCase() === activeCategory.toLowerCase() ||
        b.tags?.some(t => t.toLowerCase() === activeCategory.toLowerCase())
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => b.title?.toLowerCase().includes(q) || b.shortDescription?.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [search, activeCategory, blogs]);

  const getExcerpt = (htmlString) => {
    if (!htmlString) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = htmlString;
    return tmp.textContent || tmp.innerText || "";
  };

  const featuredBlog = filtered.length > 0 ? filtered[0] : null;
  const regularBlogs = filtered.length > 1 ? filtered.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Healthcare & Wellness Blog
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Expert advice, health tips, and caregiving resources to help you and your loved ones.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-center max-w-3xl mx-auto"
        >
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow shadow-sm"
            />
          </div>
          
          <div className="relative w-full md:w-64">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow shadow-sm cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="space-y-12">
            <div className="w-full h-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse h-[400px]">
                  <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-t-2xl mb-4" />
                  <div className="p-6">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center rounded-2xl p-16 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No articles found</p>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Try searching with a different keyword or category.</p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Featured Blog */}
            {featuredBlog && !search && activeCategory === "All Categories" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="mb-4 text-sm font-bold text-slate-400 uppercase tracking-wider">Featured Article</div>
                <Link 
                  to={`/blogs/${featuredBlog._id}`} 
                  className="group block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:shadow-lg transition-shadow duration-300 flex flex-col-reverse lg:flex-row"
                >
                  <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      {featuredBlog.category && (
                        <span className="font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                          {featuredBlog.category}
                        </span>
                      )}
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {formatDate(featuredBlog.createdAt)}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {featuredBlog.readingTime || 5} min read</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {featuredBlog.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 leading-relaxed text-lg">
                      {featuredBlog.shortDescription || getExcerpt(featuredBlog.content)}
                    </p>
                    <span className="inline-flex items-center font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                      Read Article <ArrowRight className="w-5 h-5 ml-1.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                  <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden relative">
                    {getBlogImageUrl(featuredBlog) ? (
                      <img src={getBlogImageUrl(featuredBlog)} alt={featuredBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                        <span className="text-slate-400">No Image Available</span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Latest Articles */}
            <motion.div variants={stagger} initial="hidden" animate="show">
              <div className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">Latest Articles</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {(search || activeCategory !== "All Categories" ? filtered : regularBlogs).map((blog) => (
                    <motion.div 
                      layout 
                      variants={fadeUp} 
                      initial="hidden" 
                      animate="show" 
                      exit="hidden" 
                      key={blog._id}
                    >
                      <Link 
                        to={`/blogs/${blog._id}`} 
                        className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:shadow-lg transition-shadow duration-300 h-full"
                      >
                        {/* Image */}
                        <div className="w-full aspect-[16/10] overflow-hidden relative border-b border-slate-100 dark:border-slate-800">
                          {getBlogImageUrl(blog) ? (
                            <img src={getBlogImageUrl(blog)} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <span className="text-slate-400">No Image Available</span>
                            </div>
                          )}
                          {blog.category && (
                            <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-sm text-slate-900 dark:text-white text-xs font-bold rounded-full shadow-sm">
                              {blog.category}
                            </span>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(blog.createdAt)}
                          </div>
                          
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {blog.title}
                          </h3>
                          
                          <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                            {blog.shortDescription || getExcerpt(blog.content)}
                          </p>
                          
                          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center group-hover:underline">
                              Read Article <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;