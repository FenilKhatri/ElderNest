import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import http from '../../../lib/axios';
import { formatDate } from '../../../utils/helpers';
import { getBlogImageUrl } from '../../../utils/blogImage';
import { Calendar, User, Search, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { stagger, fadeUp } from '../../../animations/motionVariants';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Health", "Tips", "Wellness", "Caregiving", "Eldercare", "Lifestyle"];

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
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-site-wide mx-auto">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }}
          className="text-center mb-16 relative"
        >
          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              ElderNest Insights
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
              Stories, Tips & <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Expert Insights
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Stay updated with the latest trends, tips, and expert stories in elder care and wellness.
            </p>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
              />
            </div>
            
            {/* Category pills */}
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/10 bg-white/5 animate-pulse h-96">
                <div className="w-full h-48 bg-white/10 rounded-xl mb-4" />
                <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-4 bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center rounded-2xl p-16 border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-xl font-bold text-white mb-2">No articles found</p>
            <p className="text-slate-400 max-w-md mx-auto">Try searching with a different keyword or category.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Blog */}
            {featuredBlog && !search && activeCategory === "All" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Link 
                  to={`/blogs/${featuredBlog._id}`} 
                  className="group block rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-500 flex flex-col md:flex-row"
                >
                  <div className="w-full md:w-1/2 aspect-video md:aspect-auto h-64 md:h-auto overflow-hidden relative">
                    {getBlogImageUrl(featuredBlog) ? (
                      <img src={getBlogImageUrl(featuredBlog)} alt={featuredBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-900/50 to-blue-900/50 flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-cyan-400/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent md:bg-gradient-to-l" />
                  </div>
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
                      <span className="font-semibold px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">Featured</span>
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {formatDate(featuredBlog.createdAt)}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {featuredBlog.readingTime || 5} min</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                      {featuredBlog.title}
                    </h2>
                    <p className="text-slate-400 mb-8 line-clamp-3 leading-relaxed">
                      {featuredBlog.shortDescription || getExcerpt(featuredBlog.content)}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                          <User className="w-full h-full p-2 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{featuredBlog.author?.name || 'ElderNest Team'}</p>
                          <p className="text-xs text-slate-500">Author</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                        Read Article <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Blog Grid */}
            <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {(search || activeCategory !== "All" ? filtered : regularBlogs).map((blog) => (
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
                      className="group block rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.08)] transition-all duration-500 h-full flex flex-col"
                    >
                      {/* Image */}
                      <div className="w-full aspect-[16/10] overflow-hidden relative">
                        {getBlogImageUrl(blog) ? (
                          <img src={getBlogImageUrl(blog)} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-slate-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        {/* Category badge on image */}
                        {(blog.category || blog.tags?.[0]) && (
                          <span className="absolute top-4 left-4 px-3 py-1 bg-cyan-500/20 backdrop-blur-md text-cyan-300 text-xs font-bold rounded-lg border border-cyan-500/20">
                            {blog.category || blog.tags[0]}
                          </span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 md:p-7 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                          <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {formatDate(blog.createdAt)}</span>
                          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {blog.readingTime || 5} min</span>
                        </div>
                        
                        <h2 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
                          {blog.title}
                        </h2>
                        
                        <p className="text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                          {blog.shortDescription || getExcerpt(blog.content)}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
                              <User className="w-full h-full p-1.5 text-cyan-400/60" />
                            </div>
                            <span className="text-sm font-semibold text-slate-300 truncate max-w-[120px]">
                              {blog.author?.name || 'ElderNest Team'}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-cyan-400 flex items-center group-hover:translate-x-1 transition-transform">
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