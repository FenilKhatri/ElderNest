import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import http from '../../../lib/axios';
import { formatDate } from '../../../utils/helpers';
import { Calendar, User, ArrowLeft, Clock, Share2, Mail } from 'lucide-react';
import { getBlogImageUrl } from '../../../utils/blogImage';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await http.get(`/blogs/${id}`);
        setBlog(res.data?.blog);

        // Fetch related blogs (mock by fetching all and picking first 3 excluding current)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const bannerImage = getBlogImageUrl(blog);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    const payload = {
      title: blog.title,
      text: blog.title,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
      } else {
        toast.info(shareUrl);
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        toast.error('Could not share this article');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-site-wide mx-auto">
        <Link to="/blogs" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Articles
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content (Left) */}
          <div className="w-full lg:w-2/3">
            <article className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200 dark:border-slate-700 overflow-hidden">
              
              <div className="p-8 md:p-12 pb-8">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
                  {blog.tags && blog.tags.length > 0 && (
                    <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                      {blog.tags[0]}
                    </span>
                  )}
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {formatDate(blog.createdAt)}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> 5 min read</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 leading-[1.2]">
                  {blog.title}
                </h1>

                <div className="flex items-center justify-between border-y border-slate-100 dark:border-slate-700/50 py-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <User className="w-full h-full p-2.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{blog.author?.name || 'ElderNest Team'}</p>
                      <p className="text-xs text-slate-500">Elder Care Specialist</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Banner Image */}
              {bannerImage && (
                <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-700 overflow-hidden px-8 md:px-12 mb-8">
                  <img src={bannerImage} alt={blog.title} className="w-full h-full object-cover rounded-2xl shadow-sm" />
                </div>
              )}

              {/* Content */}
              <div className="p-8 md:p-12 pt-0">
                <div 
                  className="prose dark:prose-invert max-w-none prose-lg text-slate-700 dark:text-slate-300 prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 marker:text-blue-600 prose-img:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags Footer */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white mr-2">Topics:</span>
                    {blog.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar (Right) */}
          <div className="w-full lg:w-1/3 space-y-8">
            
            {/* Newsletter */}
            <div className="bg-blue-600 rounded-3xl p-8 text-center text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
              <Mail className="w-10 h-10 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-bold mb-2">Subscribe to Newsletter</h3>
              <p className="text-blue-100 text-sm mb-6">Get the latest elder care tips and resources delivered directly to your inbox.</p>
              <form onSubmit={handleSubmit(onSubmitNewsletter)}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 rounded-xl border-none bg-white/10 text-white placeholder:text-blue-200 mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-red-300 text-xs text-left mb-3">{errors.email.message}</p>}
                <button type="submit" disabled={subscribing} className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-70">
                  {subscribing ? 'Subscribing...' : 'Subscribe Now'}
                </button>
              </form>
            </div>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center border-b border-slate-100 dark:border-slate-700 pb-4">
                  Related Articles
                </h3>
                <div className="space-y-6">
                  {relatedBlogs.map(rb => (
                    <Link to={`/blogs/${rb._id}`} key={rb._id} className="group flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                        {getBlogImageUrl(rb) ? (
                          <img src={getBlogImageUrl(rb)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Img</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
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
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;