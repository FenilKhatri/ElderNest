import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { 
  ArrowLeft, Save, UploadCloud, X, Image as ImageIcon, 
  Settings, Type, Share2, FileText, CheckCircle 
} from "lucide-react";
import { createBlog, updateBlog, getBlogById } from "../api/admin.api";
import http from "../../../lib/axios";
import Button from "../../../components/ui/Button";

const INITIAL_STATE = {
  title: "",
  slug: "",
  shortDescription: "",
  content: "",
  thumbnail: "",
  bannerImage: "",
  category: "General",
  tags: [],
  author: "",
  authorImage: "",
  readingTime: "",
  status: "draft",
  seo: {
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  },
  socialLinks: {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  },
  blogSettings: {
    featured: false,
    allowComments: true,
    pinned: false,
    showTableOfContents: true,
  },
};

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await getBlogById(id);
      if (res.data?.blog) {
        setFormData({ ...INITIAL_STATE, ...res.data.blog });
      }
    } catch (error) {
      toast.error("Failed to load blog");
      navigate("/admin/blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, isEdit]);

  // Tags Handler
  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }));
  };

  // SEO Keywords Handler
  const addKeyword = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!formData.seo.metaKeywords.includes(keywordInput.trim())) {
        handleNestedChange("seo", "metaKeywords", [...formData.seo.metaKeywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };
  const removeKeyword = (kwToRemove) => {
    handleNestedChange("seo", "metaKeywords", formData.seo.metaKeywords.filter((k) => k !== kwToRemove));
  };

  const uploadImage = async (file, type) => {
    if (!file) return;
    const data = new FormData();
    data.append("image", file);

    const setLoader = type === "thumbnail" ? setUploadingThumb : setUploadingBanner;
    setLoader(true);

    try {
      const res = await http.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.url) {
        setFormData((prev) => ({ ...prev, [type]: res.url }));
        toast.success(`${type} uploaded successfully`);
      }
    } catch (err) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      setLoader(false);
    }
  };

  const handleSave = async (status = formData.status) => {
    if (!formData.title || !formData.content) {
      toast.error("Title and Content are required");
      return;
    }

    try {
      setSaving(true);
      const payload = { ...formData, status };

      if (isEdit) {
        await updateBlog(id, payload);
        toast.success("Blog updated successfully");
      } else {
        await createBlog(payload);
        toast.success("Blog created successfully");
        navigate("/admin/blogs");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean'],
      ['code-block']
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/admin/blogs")}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEdit ? "Edit Blog" : "Create New Blog"}
          </h1>
          <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-full uppercase">
            {formData.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleSave("draft")} 
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" /> Save as Draft
          </Button>
          <Button 
            onClick={() => handleSave("published")} 
            disabled={saving}
          >
            <CheckCircle className="w-4 h-4 mr-2" /> 
            {saving ? "Saving..." : "Publish Blog"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <Type className="w-5 h-5 text-blue-500" /> Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  className="w-full px-4 py-3 text-lg font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="blog-url-slug"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Eldercare">Eldercare</option>
                    <option value="Health">Health</option>
                    <option value="Tips">Tips & Advice</option>
                    <option value="News">News</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Description</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Content Editor Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <FileText className="w-5 h-5 text-purple-500" /> Content Editor *
            </h2>
            <div className="prose-editor-container bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden">
              <ReactQuill 
                theme="snow" 
                value={formData.content} 
                onChange={(val) => setFormData(prev => ({...prev, content: val}))}
                modules={modules}
                className="h-[500px] pb-12"
              />
            </div>
          </motion.div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Media Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <ImageIcon className="w-5 h-5 text-rose-500" /> Media
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Thumbnail Image</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center text-center relative overflow-hidden bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  {formData.thumbnail ? (
                    <>
                      <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-32 object-cover rounded-md" />
                      <button 
                        onClick={() => setFormData(prev => ({...prev, thumbnail: ""}))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer w-full h-32 flex flex-col items-center justify-center">
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-500">{uploadingThumb ? "Uploading..." : "Click to upload"}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], "thumbnail")} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Banner Image</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center text-center relative overflow-hidden bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  {formData.bannerImage ? (
                    <>
                      <img src={formData.bannerImage} alt="Banner" className="w-full h-32 object-cover rounded-md" />
                      <button 
                        onClick={() => setFormData(prev => ({...prev, bannerImage: ""}))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer w-full h-32 flex flex-col items-center justify-center">
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-500">{uploadingBanner ? "Uploading..." : "Click to upload banner"}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], "bannerImage")} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tags & Organization */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <Share2 className="w-5 h-5 text-indigo-500" /> Tags
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Press enter to add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Settings Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <Settings className="w-5 h-5 text-amber-500" /> Settings
            </h2>
            <div className="space-y-4">
              {Object.entries({
                featured: "Featured Post",
                allowComments: "Allow Comments",
                pinned: "Pin to Top",
                showTableOfContents: "Show TOC"
              }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
                  <div className="relative inline-block w-10 h-6">
                    <input 
                      type="checkbox" 
                      className="peer opacity-0 w-0 h-0"
                      checked={formData.blogSettings[key]}
                      onChange={(e) => handleNestedChange("blogSettings", key, e.target.checked)}
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 dark:bg-slate-700 rounded-full transition-colors peer-checked:bg-blue-600 before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform peer-checked:before:translate-x-4"></span>
                  </div>
                </label>
              ))}
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reading Time (mins)</label>
                <input
                  type="number"
                  name="readingTime"
                  value={formData.readingTime}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* SEO Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <Share2 className="w-5 h-5 text-emerald-500" /> SEO Optimization
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={formData.seo.metaTitle}
                  onChange={(e) => handleNestedChange("seo", "metaTitle", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={formData.seo.metaDescription}
                  onChange={(e) => handleNestedChange("seo", "metaDescription", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords</label>
                <input
                  type="text"
                  placeholder="Press enter to add keyword"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={addKeyword}
                  className="w-full px-4 py-2 mb-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.seo.metaKeywords.map((kw, idx) => (
                    <span key={idx} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md text-xs flex items-center gap-1">
                      {kw}
                      <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BlogForm;
