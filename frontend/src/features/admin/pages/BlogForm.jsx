import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowLeft, Save, UploadCloud, X, ImageIcon, Type, FileText, CheckCircle, ToggleRight } from "lucide-react";
import { createBlog, updateBlog, getBlogById } from "../api/admin.api";
import http from "../../../lib/axios";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import Input from "../../../components/ui/Input";
import { INITIAL_STATE, BLOG_CATEGORIES } from "@/constants";

const BlogForm = () => {
  const categoryOptions = useMemo(() => [
    { value: "", label: "Select Category" },
    ...(BLOG_CATEGORIES || []).filter(c => c !== "All Categories").map(c => ({ value: c, label: c }))
  ], []);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

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
        setFormData({ 
            ...INITIAL_STATE, 
            ...res.data.blog,
            publishedAt: res.data.blog.publishedAt 
                ? new Date(res.data.blog.publishedAt).toISOString().split("T")[0] 
                : new Date().toISOString().split("T")[0]
        });
      }
    } catch (error) {
      toast.error("Failed to load blog");
      navigate("/admin/blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
        ...prev, 
        [name]: type === "checkbox" ? checked : value 
    }));
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

  // SEO Keywords Handler
  const [keywordInput, setKeywordInput] = useState("");
  const addKeyword = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!formData.seo?.metaKeywords?.includes(keywordInput.trim())) {
        handleNestedChange("seo", "metaKeywords", [...(formData.seo?.metaKeywords || []), keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };
  const removeKeyword = (kwToRemove) => {
    handleNestedChange("seo", "metaKeywords", (formData.seo?.metaKeywords || []).filter((k) => k !== kwToRemove));
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

  const uploadImage = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append("image", file);
    data.append("folder", "photos");
    
    setUploadingImage(true);
    try {
      const res = await http.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
        toast.success(`Image uploaded successfully`);
      }
    } catch (err) {
      toast.error(`Failed to upload image`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e, overrideStatus = null) => {
    if (e) e.preventDefault();
    const payload = overrideStatus ? { ...formData, status: overrideStatus } : formData;

    if (!payload.title || !payload.content) {
      toast.error("Title and Content are required");
      return;
    }

    try {
      setSaving(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-site mx-auto pb-20">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex items-center justify-between mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            type="button"
            onClick={() => navigate("/admin/blogs")}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </Button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEdit ? "Edit Blog" : "Create New Blog"}
          </h1>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${formData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {formData.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            type="button"
            onClick={(e) => handleSave(e, "draft")} 
            disabled={saving}
          >
            Save as Draft
          </Button>
          <Button 
            type="button" 
            onClick={(e) => handleSave(e, "published")} 
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
                <Input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  className="w-full px-4 py-3 text-lg font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Slug *</label>
                  <Input
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="blog-url-slug"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <Select
                    name="category"
                    required
                    options={categoryOptions}
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Excerpt *</label>
                <Textarea
                  name="excerpt"
                  required
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quote (Blue Highlight Section)</label>
                <Textarea
                  name="quote"
                  value={formData.quote}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Raw Text Content Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <FileText className="w-5 h-5 text-purple-500" /> Standard Content *
            </h2>
            <Textarea
              name="content"
              required
              value={formData.content}
              onChange={handleInputChange}
              rows={15}
              placeholder="Enter standard text/HTML content..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-y font-mono text-sm"
            />
          </motion.div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Settings Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <ToggleRight className="w-5 h-5 text-emerald-500" /> Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Published Date</label>
                <Input
                  type="date"
                  name="publishedAt"
                  value={formData.publishedAt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Read Time</label>
                <Input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  placeholder="5 min read"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* SEO Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <ToggleRight className="w-5 h-5 text-emerald-500" /> SEO Optimization
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
                <Input
                  type="text"
                  value={formData.seo?.metaTitle || ""}
                  onChange={(e) => handleNestedChange("seo", "metaTitle", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
                <Textarea
                  rows={2}
                  value={formData.seo?.metaDescription || ""}
                  onChange={(e) => handleNestedChange("seo", "metaDescription", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords</label>
                <Input
                  type="text"
                  placeholder="Press enter to add keyword"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={addKeyword}
                  className="w-full px-4 py-2 mb-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {(formData.seo?.metaKeywords || []).map((kw, idx) => (
                    <span key={idx} className="px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md text-xs flex items-center gap-2">
                      {kw}
                      <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-red-500 cursor-pointer ml-2">X</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Media Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <ImageIcon className="w-5 h-5 text-rose-500" /> Featured Image
            </h2>
            
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center text-center relative overflow-hidden bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Featured" className="w-full h-32 object-cover rounded-md" />
                  <Button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, image: ""}))}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <label className="cursor-pointer w-full h-32 flex flex-col items-center justify-center">
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">{uploadingImage ? "Uploading..." : "Click to upload"}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadImage(e.target.files[0])} />
                </label>
              )}
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
              <Type className="w-5 h-5 text-indigo-500" /> Tags
            </h2>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Press enter to add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-2">
                {(formData.tags || []).map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 cursot-pointer"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </form>
  );
};

export default BlogForm;
