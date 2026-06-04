import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBlogs } from "../api/blog.api";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { stagger, fadeUp } from "../../../animations/motionVariants";
import GlobalLoader from "../../../components/ui/GlobalLoader";
import { categoryNames, popularTags } from "../../../constants";
import LoadMore from "../../../components/common/LoadMore";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, hasMore: false });

  const fetchBlogs = async (pageToFetch = 1, append = false) => {
    try {
      if (append) setIsLoadingMore(true);
      else setLoading(true);

      const params = { page: pageToFetch, limit: 6 };
      if (activeCategory !== "All Articles") {
      }

      const res = await getAllBlogs(params);
      const list = res.data?.blogs || [];
      const pag = res.data?.pagination || { page: 1, hasMore: false };

      if (append) {
        setBlogs(prev => {
          const existingIds = new Set(prev.map(b => b._id));
          const newItems = list.filter(b => !existingIds.has(b._id));
          return [...prev, ...newItems];
        });
      } else {
        setBlogs(list);
      }
      setPagination(pag);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1, false);
  }, []);

  const handleLoadMore = () => {
    if (!isLoadingMore && pagination.hasMore) {
      fetchBlogs(pagination.page + 1, true);
    }
  };



  const filteredBlogs = activeCategory === "All Articles" 
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  const categories = categoryNames.map(name => ({
    name,
    count: name === "All Articles" ? blogs.length : blogs.filter(b => b.category === name).length
  }));

  if (loading) return <GlobalLoader />;

  return (
    <div className="bg-slate-50 dark:bg-[#0b1120] min-h-screen py-16">
      <div className="w-full max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Healthcare & Wellness Blog
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            Insights, advice, and tips for families and caregivers to provide the best home healthcare for their loved ones.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 flex flex-col gap-8">
            {/* Categories */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Categories</h3>
              <ul className="flex flex-col gap-2">
                {categories.map((cat, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => setActiveCategory(cat.name)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === cat.name
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeCategory === cat.name 
                          ? "bg-white/20 text-white" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-medium rounded-md cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* Blog Grid */}
          <main className="w-full lg:w-3/4">
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                No blogs found in this category.
              </div>
            ) : (
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {filteredBlogs.map((blog, idx) => (
                  <motion.div variants={fadeUp} key={blog._id} className={idx === 0 ? "md:col-span-2" : ""}>
                    <div className={`bg-white dark:bg-[#111827] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col ${idx === 0 ? "md:flex-row h-full" : "h-full"}`}>
                      {/* Image */}
                      <div className={`relative ${idx === 0 ? "w-full md:w-1/2" : "w-full aspect-video"}`}>
                        <img 
                          src={blog.image || "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800"} 
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className={`p-8 flex flex-col justify-between ${idx === 0 ? "w-full md:w-1/2" : "w-full flex-grow"}`}>
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-medium rounded-md">
                              {blog.category}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {blog.readTime || "5 min read"}
                            </span>
                          </div>
                          <h2 className={`${idx === 0 ? "text-2xl" : "text-xl"} font-bold text-slate-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}>
                            <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                          </h2>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                            {blog.excerpt}
                          </p>
                        </div>

                        {idx === 0 ? (
                          <div className="mt-auto">
                            <Link to={`/blogs/${blog.slug}`} className="inline-block px-5 py-2 border border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                              Read Article
                            </Link>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                              <img src={`https://ui-avatars.com/api/?name=${blog.author?.name || 'Admin'}&background=random`} alt={blog.author?.name} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{blog.author?.name || 'Admin'}</span>
                              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                                {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {pagination.hasMore && (
              <div className="mt-12 flex justify-center">
                <LoadMore 
                  hasMore={pagination.hasMore}
                  onLoadMore={handleLoadMore}
                  isLoading={isLoadingMore}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Blogs;