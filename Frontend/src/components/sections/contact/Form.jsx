import React from "react";
import { cities, services } from "../../data/contactPage";
import Button from "../common/Button";

const Form = () => {
  const labelStyle = "font-semibold text-slate-800 dark:text-slate-200";
  const inputStyle =
    "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
      <form
        action="#"
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
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              id="name"
              className={inputStyle}
            />
          </div>

          <div className="flex w-full flex-col items-start justify-start space-y-2">
            <label htmlFor="email" className={labelStyle}>
              Email
            </label>
            <input
              type="email"
              placeholder="e.g. rahulsharma123@gmail.com"
              id="email"
              className={inputStyle}
            />
          </div>
        </div>

        {/* Phone and Services */}
        <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row">
          <div className="flex w-full flex-col items-start justify-start space-y-2">
            <label htmlFor="phone" className={labelStyle}>
              Phone
            </label>
            <input
              type="tel"
              placeholder="e.g. +91 98765 43210"
              id="phone"
              className={inputStyle}
            />
          </div>

          <div className="flex w-full flex-col items-start justify-start space-y-2">
            <label htmlFor="service" className={labelStyle}>
              Services Required
            </label>
            <select name="service" id="service" className={inputStyle}>
              <option>Select Care Service</option>
              {services?.map((service) => (
                <option value={service?.value || "-"} key={service?.value}>
                  {service?.name || "-"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* City */}
        <div className="flex w-full flex-col items-start justify-start space-y-2">
          <label htmlFor="city" className={labelStyle}>
            City / Location
          </label>
          <select name="city" id="city" className={inputStyle}>
            <option>Select Your City / Location</option>
            {cities?.map((city) => (
              <option value={city} key={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="flex w-full flex-col items-start justify-start space-y-2">
          <label htmlFor="message" className={labelStyle}>
            Message or Special Requirements
          </label>
          <textarea
            name="message"
            id="message"
            rows="5"
            placeholder="Write your message here..."
            className={`${inputStyle} resize-none`}
          ></textarea>
        </div>

        {/* Submit Btn */}
        <Button className="w-full py-3 md:py-5">Submit Request</Button>

        {/* Message */}
        <p className="text-slate-500 text-center w-full">
          Your information is secure and confidential.
        </p>
      </form>
    </div>
  );
};

export default Form;
