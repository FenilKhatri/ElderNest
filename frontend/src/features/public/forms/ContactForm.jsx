import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import { submitContact } from "../../contact/api/contact.api";
import Textarea from "../../../components/ui/Textarea";
import Input from "../../../components/ui/Input";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await submitContact(formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = "font-semibold text-slate-800 dark:text-slate-200";
  const inputStyle =
    "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
      <form
        onSubmit={handleSubmit}
        className="md:min-w-3xl flex flex-col items-start justify-center space-y-6 p-5 md:p-7"
      >
        <div className="flex flex-col items-start space-y-2">
          <p className="text-2xl font-bold leading-tight text-slate-800 dark:text-slate-100">
            Send Us a Message
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Fill out the form below and our care team will get back to you
            within 2 hours.
          </p>
        </div>

        {/* Name and Email */}
        <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row">
          <div className="flex w-full flex-col items-start justify-start space-y-2">
            <label htmlFor="name" className={labelStyle}>
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              id="name"
              required
              className={inputStyle}
            />
          </div>

          <div className="flex w-full flex-col items-start justify-start space-y-2">
            <label htmlFor="email" className={labelStyle}>
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. rahulsharma123@gmail.com"
              id="email"
              required
              className={inputStyle}
            />
          </div>
        </div>

        {/* Phone and Subject */}
        <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row">
          <div className="flex w-full flex-col items-start justify-start space-y-2">
            <label htmlFor="phone" className={labelStyle}>
              Phone
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              id="phone"
              className={inputStyle}
            />
          </div>

          <div className="flex w-full flex-col items-start justify-start space-y-2">
            <label htmlFor="subject" className={labelStyle}>
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Inquiry about elderly care"
              id="subject"
              required
              className={inputStyle}
            />
          </div>
        </div>

        {/* Message */}
        <div className="flex w-full flex-col items-start justify-start space-y-2">
          <label htmlFor="message" className={labelStyle}>
            Message <span className="text-red-500">*</span>
          </label>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            id="message"
            rows="5"
            placeholder="Write your message here..."
            required
            className={`${inputStyle} resize-none`}
          ></Textarea>
        </div>

        {/* Submit Btn */}
        <Button type="submit" disabled={loading} className="w-full py-3 md:py-5">
          {loading ? "Sending..." : "Submit Request"}
        </Button>

        {/* Message */}
        <p className="text-slate-500 text-center w-full">
          Your information is secure and confidential.
        </p>
      </form>
    </div>
  );
};

export default Form;
