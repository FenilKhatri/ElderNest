import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Camera, X, Plus } from "lucide-react";
import http from "../../../lib/axios";
import { createService, updateService, getServiceById, getAllCaregivers } from "../api/admin.api";
import { SERVICE_CATEGORIES, SERVICE_MODES, emptyServiceForm } from "@/constants";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Checkbox from "../../../components/ui/Checkbox";
import Textarea from "../../../components/ui/Textarea";
import Input from "../../../components/ui/Input";

const ServiceFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...emptyServiceForm(), status: "published" });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getServiceById(id)
      .then((res) => {
        const s = res?.data?.service;
        if (!s) return;
        setForm({
          title: s.title || "",
          category: s.category || "",
          shortDescription: s.shortDescription || "",
          description: s.description || "",
          coverImage: s.coverImage || s.image || "",
          image: s.image || s.coverImage || "",
          images: s.images || [],
          duration: s.duration ?? 1,
          serviceMode: s.serviceMode || "home-visit",
          features: s.features || [],
          benefits: s.benefits || [],
          isFeatured: Boolean(s.isFeatured),
          status: s.isDraft ? "draft" : (s.isActive !== false ? "published" : "inactive"),
        });
      })
      .catch(() => toast.error("Failed to load service"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const uploadImage = async (file, field) => {
    const data = new FormData();
    data.append("image", file);
    data.append("folder", "photos");
    setUploadingCover(true);
    try {
      const res = await http.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.url) {
        setForm((prev) => ({
          ...prev,
          [field]: res.url,
          ...(field === "coverImage" ? { image: res.url } : {}),
        }));
        toast.success("Image uploaded");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingCover(false);
    }
  };


  const addListItem = (key, value, clear) => {
    const v = value.trim();
    if (!v) return;
    setForm((prev) => ({ ...prev, [key]: [...prev[key], v] }));
    clear("");
  };

  const savePayload = () => ({
    ...form,
    isDraft: form.status === "draft",
    isActive: form.status === "published",
    duration: Number(form.duration) || 0,
    image: form.coverImage || form.image,
    coverImage: form.coverImage || form.image,
  });

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (form.status !== "draft" && (!form.title || !form.category || !form.description)) {
      toast.error("Title, category, and description are required");
      return;
    }
    try {
      setSaving(true);
      const payload = savePayload();
      const isDraft = payload.isDraft;
      if (isEdit) {
        await updateService(id, payload);
        toast.success(isDraft ? "Draft saved" : "Service updated");
        navigate(isDraft ? "/admin/services" : `/admin/services/${id}`);
      } else {
        const res = await createService(payload);
        toast.success(isDraft ? "Draft saved" : "Service created");
        const createdId = res?.data?.service?._id;
        navigate(createdId && !isDraft ? `/admin/services/${createdId}` : "/admin/services");
      }
    } catch (err) {
      toast.error(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-200 dark:bg-slate-800 rounded-xl" />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button type="button" onClick={() => navigate(isEdit ? `/admin/services/${id}` : "/admin/services")} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="w-5 h-5 dark:text-slate-100" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEdit ? "Edit Service" : "Create Service"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title *">
            <Input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </Field>
          <Field label="Category *">
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={SERVICE_CATEGORIES}
              placeholder="Select category"
              required
            />
          </Field>
          <Field label="Service Mode">
            <Select
              value={form.serviceMode}
              onChange={(e) => setForm({ ...form, serviceMode: e.target.value })}
              options={SERVICE_MODES}
            />
          </Field>
          <Field label="Duration (hours)">
            <Input type="number" min="0" step="0.5" className={inputCls} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </Field>
        </div>

        <Field label="Short Description">
          <div className="relative">
            <Textarea 
              className={`${inputCls} resize-none pr-16`} 
              rows={3} 
              value={form.shortDescription} 
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} 
              maxLength={500} 
              placeholder="Brief summary of the service..."
            />
            <div className={`absolute bottom-3 right-3 text-xs font-medium ${
              form.shortDescription.length >= 480 ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {form.shortDescription.length}/500
            </div>
          </div>
        </Field>

        <Field label="Description *">
          <Textarea className={`${inputCls} resize-none`} rows={10} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </Field>

        <Field label="Cover Image">
          <ImageUpload url={form.coverImage} uploading={uploadingCover} onUpload={(f) => uploadImage(f, "coverImage")} onClear={() => setForm({ ...form, coverImage: "", image: "" })} />
        </Field>

        <Field label="Gallery Images">
          <div className="flex gap-2 mb-2">
            <Input className={inputCls} placeholder="Image URL" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} />
            <Button type="button" variant="outline" onClick={() => addListItem("images", imageUrlInput, setImageUrlInput)}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.images.map((url) => (
              <span key={url} className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 dark:text-slate-100 px-2 py-1 rounded">
                <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{url.slice(0, 30)}…</a>
                <Button type="button" onClick={() => setForm({ ...form, images: form.images.filter((u) => u !== url) })}><X className="w-3 h-3" /></Button>
              </span>
            ))}
          </div>
        </Field>

        <Field label="Features">
          <div className="flex gap-2 mb-2">
            <Input className={inputCls} value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add feature" />
            <Button type="button" variant="outline" onClick={() => addListItem("features", featureInput, setFeatureInput)}><Plus className="w-4 h-4" /></Button>
          </div>
          <TagList items={form.features} onRemove={(i) => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })} />
        </Field>

        <Field label="Benefits">
          <div className="flex gap-2 mb-2">
            <Input className={inputCls} value={benefitInput} onChange={(e) => setBenefitInput(e.target.value)} placeholder="Add benefit" />
            <Button type="button" variant="outline" onClick={() => addListItem("benefits", benefitInput, setBenefitInput)}><Plus className="w-4 h-4" /></Button>
          </div>
          <TagList items={form.benefits} onRemove={(i) => setForm({ ...form, benefits: form.benefits.filter((_, idx) => idx !== i) })} />
        </Field>


        <div className="flex flex-wrap gap-6">
          <Checkbox 
            label="Featured service"
            checked={form.isFeatured} 
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} 
            className="mr-6"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status:</label>
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={[
                { value: "published", label: "Active (Published)" },
                { value: "draft", label: "Draft" },
                { value: "inactive", label: "Inactive (Hidden)" }
              ]}
              className="w-56"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Service"}
          </Button>
        </div>
      </form>
    </div>
  );
};

const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
    {children}
  </div>
);

const ImageUpload = ({ url, uploading, onUpload, onClear }) => (
  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 h-36 flex items-center justify-center">
    {url ? (
      <>
        <img src={url} alt="" className="max-h-full object-contain" />
        <Button variant="danger" type="button" onClick={onClear} className="absolute top-2 right-2 p-1"><X className="w-4 h-4" /></Button>
      </>
    ) : (
      <label className="cursor-pointer flex flex-col items-center text-slate-500">
        <Camera className="w-8 h-8 mb-2" />
        <span className="text-sm">{uploading ? "Uploading..." : "Upload cover"}</span>
        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])} disabled={uploading} />
      </label>
    )}
  </div>
);

const TagList = ({ items, onRemove }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item, i) => (
      <span key={`${item}-${i}`} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 dark:text-slate-100 rounded text-xs">
        {item}
        <Button type="button" onClick={() => onRemove(i)}><X className="w-3 h-3" /></Button>
      </span>
    ))}
  </div>
);

export default ServiceFormPage;
