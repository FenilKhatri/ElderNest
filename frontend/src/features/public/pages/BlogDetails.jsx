import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import http from '../../../lib/axios';
import { formatDate } from '../../../utils/helpers';
import { getBlogImageUrl } from '../../../utils/blogImage';
import { Calendar, User, ArrowLeft, Clock, Share2, Mail, List, Sparkles, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { fadeUp } from '../../../animations/motionVariants';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHeading, setActiveHeading] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await http.get(`/blogs/${id}`);
        setBlog(res.data?.blog);

        const allBlogsRes = await http.get('/blogs');
        const allB = allBlogsRes.data?.blogs || [];
        setRelatedBlogs(allB.filter(b => b._id !== id).slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch blog", error);
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  // Extract headings from content for TOC
  const headings = useMemo(() => {
    if (!blog?.content) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(blog.content, "text/html");
    const elements = doc.querySelectorAll("h1, h2, h3");
    return Array.from(elements).map((el, i) => ({
      id: `heading-${i}`,
      text: el.textContent,
      level: parseInt(el.tagName.charAt(1)),
    }));
  }, [blog?.content]);

  // Inject IDs into headings for scroll targeting
  const processedContent = useMemo(() => {
    if (!blog?.content) return "";
    let content = blog.content;
    let idx = 0;
    content = content.replace(/<(h[1-3])(.*?)>/gi, (match, tag, attrs) => {
      const id = `heading-${idx}`;
      idx++;
      return `<${tag}${attrs} id="${id}">`;
    });
    return content;
  }, [blog?.content]);

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings, processedContent]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [subscribing, setSubscribing] = useState(false);

  const onSubmitNewsletter = async (data) => {
    try {
      setSubscribing(true);
      await http.post('/newsletter/subscribe', { email: data.email });
      toast.success('Successfully subscribed to newsletter!');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: blog.title, text: blog.title, url: shareUrl });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') toast.error('Could not share');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 pb-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!blog) return null;

  const bannerImage = getBlogImageUrl(blog);

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      
      {/* Hero Header */}
      <div className="relative w-full h-[480px] md:h-[540px] overflow-hidden">
        {bannerImage ? (
          <img src={bannerImage} alt={blog.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-site-wide mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Link to="/blogs" className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
              </Link>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-4">
                {blog.tags?.[0] && (
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20 font-semibold text-xs">
                    {blog.category || blog.tags[0]}
                  </span>
                )}
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {formatDate(blog.createdAt)}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {blog.readingTime || 5} min read</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.15] max-w-4xl">
                {blog.title}
              </h1>

              <div className="flex items-center gap-4 mt-6">
                <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden">
                  <User className="w-full h-full p-2.5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{blog.author?.name || 'ElderNest Team'}</p>
                  <p className="text-xs text-slate-400">Elder Care Specialist</p>
                </div>
                <button
                  onClick={handleShare}
                  className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-slate-300 text-sm font-semibold hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-site-wide mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="w-full lg:w-2/3">
            <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
              <div className="p-8 md:p-12">
                <div 
                  className="prose prose-invert prose-lg max-w-none 
                    prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                    prose-p:text-slate-300 prose-p:leading-relaxed
                    prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white
                    prose-blockquote:border-cyan-500 prose-blockquote:text-slate-400
                    prose-code:text-cyan-300 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10
                    prose-img:rounded-xl
                    prose-li:text-slate-300 prose-li:marker:text-cyan-500
                    prose-table:border-white/10 prose-th:text-white prose-td:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />

                {/* Tags Footer */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white mr-2">Topics:</span>
                    {blog.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white/5 text-slate-300 text-sm font-medium rounded-lg border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>

            {/* Author Card */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{blog.author?.name || "ElderNest Team"}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our team of elder care experts shares insights, tips, and stories to help you provide the best care for your loved ones.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 space-y-8">
            
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="sticky top-24 space-y-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <List className="w-4 h-4 text-cyan-400" /> Table of Contents
                  </h3>
                  <nav className="space-y-1">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className={`block text-sm py-1.5 transition-all duration-200 border-l-2 ${
                          activeHeading === h.id
                            ? "border-cyan-400 text-cyan-400 font-semibold"
                            : "border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20"
                        }`}
                        style={{ paddingLeft: `${(h.level - 1) * 12 + 12}px` }}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Related Articles */}
                {relatedBlogs.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedBlogs.map(rb => (
                        <Link to={`/blogs/${rb._id}`} key={rb._id} className="group flex gap-3 items-center">
                          <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/10">
                            {getBlogImageUrl(rb) ? (
                              <img src={getBlogImageUrl(rb)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Sparkles className="w-4 h-4 text-slate-600" /></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-cyan-400 transition-colors mb-1">
                              {rb.title}
                            </h4>
                            <span className="text-xs text-slate-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" /> {formatDate(rb.createdAt)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newsletter */}
                <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl p-6 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <Mail className="w-8 h-8 text-cyan-400 mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Stay Updated</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                      Get expert elder care insights delivered to your inbox.
                    </p>
                    <form onSubmit={handleSubmit(onSubmitNewsletter)} className="space-y-3">
                      <input
                        type="email"
                        {...register('email', { required: 'Email required' })}
                        placeholder="Your email"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 text-sm"
                      />
                      {errors.email && <span className="text-cyan-400 text-xs">{errors.email.message}</span>}
                      <button
                        type="submit"
                        disabled={subscribing}
                        className="w-full px-4 py-3 bg-cyan-500 text-slate-950 rounded-lg font-bold text-sm hover:bg-cyan-400 transition-colors"
                      >
                        {subscribing ? "Subscribing..." : "Subscribe"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;