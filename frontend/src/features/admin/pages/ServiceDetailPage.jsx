import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Edit } from "lucide-react";
import { getServiceById } from "../api/admin.api";
import { SERVICE_CATEGORIES, SERVICE_MODES, WEEK_DAYS } from "@/constants";
import Button from "../../../components/ui/Button";
import { formatCurrency, formatDateTime } from "../../../utils/helpers";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServiceById(id)
      .then((res) => setService(res?.data?.service))
      .catch(() => toast.error("Failed to load service"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="animate-pulse h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />;
  }

  if (!service) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 mb-4">Service not found</p>
        <Link to="/admin/services" className="text-blue-600 hover:underline">Back to services</Link>
      </div>
    );
  }

  const categoryLabel = SERVICE_CATEGORIES.find((c) => c.value === service.category)?.label || service.category;
  const modeLabel = SERVICE_MODES.find((m) => m.value === service.serviceMode)?.label || service.serviceMode;
  const cover = service.coverImage || service.image;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => navigate("/admin/services")} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5 dark:text-white cursor-pointer" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{service.title}</h1>
            <p className="text-sm text-slate-500">/{service.slug}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/admin/services/${id}/edit`)} className="flex items-center gap-2">
          <Edit className="w-4 h-4" /> Edit Service
        </Button>
      </div>

      {cover && (
        <img src={cover} alt={service.title} className="w-full max-h-80 object-cover rounded-xl border border-slate-200 dark:border-slate-800" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Info label="Category" value={categoryLabel} />
        <Info label="Service Mode" value={modeLabel} />
        <Info label="Rating" value={`${service.rating || 0} (${service.totalReviews || 0} reviews)`} />
        <Info label="Total Bookings" value={service.totalBookings || 0} />
        <Info label="Featured" value={service.isFeatured ? "Yes" : "No"} />
        <Info label="Status" value={service.isActive ? "Active" : "Inactive"} />
        <Info label="Created" value={formatDateTime(service.createdAt)} />
        <Info label="Updated" value={formatDateTime(service.updatedAt)} />
      </div>

      {service.shortDescription && (
        <Section title="Short Description">
          <p className="text-slate-600 dark:text-slate-400">{service.shortDescription}</p>
        </Section>
      )}

      <Section title="Description">
        <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{service.description}</p>
      </Section>

      {service.features?.length > 0 && (
        <Section title="Features">
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
            {service.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </Section>
      )}

      {service.benefits?.length > 0 && (
        <Section title="Benefits">
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
            {service.benefits.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </Section>
      )}

      <Section title="Weekly Availability">
        <div className="flex flex-wrap gap-2">
          {WEEK_DAYS.map(({ key, label }) => (
            <span
              key={key}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                service.availability?.[key]
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </Section>

      {service.images?.length > 0 && (
        <Section title="Gallery">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {service.images.map((url) => (
              <img key={url} src={url} alt="" className="rounded-lg h-24 w-full object-cover border border-slate-200 dark:border-slate-700" />
            ))}
          </div>
        </Section>
      )}

      {service.caregivers?.length > 0 && (
        <Section title="Assigned Caregivers">
          <ul className="space-y-2">
            {service.caregivers.map((cg) => (
              <li key={cg._id} className="text-sm text-slate-700 dark:text-slate-300">
                {cg.fullName || cg.userId?.name || "Caregiver"} — {cg.rating ? `${cg.rating}★` : "New"}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
    <p className="text-xs font-semibold text-slate-500 uppercase">{label}</p>
    <p className="text-slate-900 dark:text-white font-medium mt-1">{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{title}</h2>
    {children}
  </div>
);

export default ServiceDetailPage;
