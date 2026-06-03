import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogBySlug, getRelatedBlogs, addComment } from "../api/blog.api";
import { motion } from "framer-motion";
import { fadeUp } from "../../../animations/motionVariants";
import GlobalLoader from "../../../components/ui/GlobalLoader";
import { ArrowRight } from "lucide-react";
import Textarea from "../../../components/ui/Textarea";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [commentData, setCommentData] = useState({ name: "", email: "", text: "" });
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getBlogBySlug(slug);
        const fetchedBlog = res.data.blog;
        setBlog(fetchedBlog);

        if (fetchedBlog) {
          const relatedRes = await getRelatedBlogs(fetchedBlog.category, fetchedBlog._id);
          setRelatedBlogs(relatedRes.data.blogs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (!blog) return;
    
    // Update Title
    const newTitle = blog.seo?.metaTitle || `${blog.title} | ElderNest`;
    document.title = newTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (blog.seo?.metaDescription) {
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = blog.seo.metaDescription;
    }

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (blog.seo?.metaKeywords?.length > 0) {
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = blog.seo.metaKeywords.join(", ");
    }

    // Cleanup when component unmounts
    return () => {
      document.title = "ElderNest – Trusted Elder Care Services at Home";
    };
  }, [blog]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentData.name || !commentData.email || !commentData.text) return;
    
    setCommentLoading(true);
    try {
      const res = await addComment(blog._id, commentData);
      setBlog(res.data.blog);
      setCommentData({ name: "", email: "", text: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <GlobalLoader />;
  if (!blog) return <div className="text-center py-20 dark:text-white">Blog not found.</div>;

  return (
    <div className="bg-white dark:bg-[#0b1120] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-site-wide mx-auto">
        
        {/* We use max-w-4xl for the reading content area so it's not too wide, but inside the max-w-site-wide container */}
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">
              <span className="text-blue-600 dark:text-blue-400">{blog.category}</span>
              <span>•</span>
              <span>{blog.readTime || "5 min read"}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                <img src={`https://ui-avatars.com/api/?name=${blog.author?.name || 'Admin'}&background=random`} alt={blog.author?.name} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{blog.author?.name || 'Admin'}</span>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden mb-12 border border-slate-100 dark:border-slate-800">
            <img 
              src={blog.image || "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1200"} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Excerpt */}
          <div className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-8">
            {blog.excerpt}
          </div>

          {/* Main Content */}
          <article 
            className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Quote Box (If exists) */}
          {blog.quote && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-8 rounded-r-xl mb-12">
              <p className="text-xl md:text-2xl font-semibold text-blue-900 dark:text-blue-100 italic">
                "{blog.quote}"
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-12">
            {blog.tags?.map(tag => (
              <span key={tag} className="px-4 py-2 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg">
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-blue-50 dark:bg-[#111827] rounded-2xl p-8 md:p-12 text-center mb-16 flex flex-col items-center border border-blue-100 dark:border-slate-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Need Professional Elderly Care at Home?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Our vetted caregivers are ready to provide compassionate and professional assistance for your loved ones right at their home.
            </p>
            <Link to="/caregivers" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors">
              Book Caregiver <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {/* Comments Section */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-12 mb-16">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              Leave a Comment
            </h3>
            
            <form onSubmit={handleCommentSubmit} className="space-y-6 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name *</label>
                  <Input 
                    type="text" 
                    required
                    value={commentData.name}
                    onChange={(e) => setCommentData({...commentData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email *</label>
                  <Input 
                    type="email" 
                    required
                    value={commentData.email}
                    onChange={(e) => setCommentData({...commentData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message *</label>
                <Textarea 
                  required
                  rows={5}
                  value={commentData.text}
                  onChange={(e) => setCommentData({...commentData, text: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                ></Textarea>
              </div>
              <Button 
                type="submit" 
                disabled={commentLoading}
                >
                {commentLoading ? "Posting..." : "Post Comment"}
              </Button>
            </form>

            {/* Existing Comments */}
            {blog.comments?.length > 0 && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{blog.comments.length} Comments</h3>
                {blog.comments.map((comment, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                      <img src={`https://ui-avatars.com/api/?name=${comment.name}&background=random`} alt={comment.name} />
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl rounded-tl-none p-6 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{comment.name}</span>
                        <span className="text-sm text-slate-400">•</span>
                        <span className="text-sm text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((b) => (
                <div key={b._id} className="bg-white dark:bg-[#111827] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow">
                  <div className="relative w-full aspect-[4/3] border-b border-slate-100 dark:border-slate-800">
                    <img 
                      src={b.image || "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800"} 
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                    {b.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-[#111827]/90 text-slate-900 dark:text-white text-xs font-bold rounded-md shadow-sm">
                        {b.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                      <Link to={`/blogs/${b.slug}`}>{b.title}</Link>
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                      {b.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
                      <Link to={`/blogs/${b.slug}`} className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center hover:underline">
                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;