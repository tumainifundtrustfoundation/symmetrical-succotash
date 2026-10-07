import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Navigation,
  ExternalLink,
  Compass,
  Building,
} from 'lucide-react';
import {
  UOMBONI_LOCATION_CONFIG,
  getSchoolMapUrl,
  getSchoolDirectionsUrl,
  getSchoolMapEmbedUrl,
} from '../config/mapConfig';

export const ContactSection: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setFormSubmitted(false);
    }, 6000);
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-[#FFFFF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-2 uppercase">
            Get In Touch
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
            Contact Uomboni Secondary School
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
            We welcome inquiries from prospective parents, alumni, and educational partners. Reach out to our administrative team or visit our school offices in Marangu.
          </p>
        </div>

        {/* Contact Info & Inquiry Form Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-lg border border-[#102A43]/15 shadow-xs space-y-6">
              <h3 className="text-base font-semibold text-[#102A43]">
                Official School Contacts
              </h3>

              {/* Physical Location */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-md bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#102A43]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#102A43] block">Physical Address &amp; Postal Box</span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                    {UOMBONI_LOCATION_CONFIG.schoolName}<br />
                    Marangu-Moshi, Kilimanjaro Region, Tanzania<br />
                    {UOMBONI_LOCATION_CONFIG.postalAddress}
                  </p>
                </div>
              </div>

              {/* Telephone */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-md bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43] shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-[#102A43]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#102A43] block">SIMU Na / Telephone Lines</span>
                  <div className="text-xs sm:text-sm text-slate-600 mt-0.5 space-y-1">
                    <a
                      href={`tel:${UOMBONI_LOCATION_CONFIG.contactPhones.primary.replace(/\s+/g, '')}`}
                      className="block font-semibold text-[#102A43] hover:text-[#C9A227] transition-colors"
                    >
                      {UOMBONI_LOCATION_CONFIG.contactPhones.primary} (Simu Kuu ya Shule)
                    </a>
                    <a
                      href={`tel:${UOMBONI_LOCATION_CONFIG.contactPhones.headmaster.replace(/\s+/g, '')}`}
                      className="block hover:text-[#102A43] transition-colors"
                    >
                      {UOMBONI_LOCATION_CONFIG.contactPhones.headmaster} (Mkuu wa Shule)
                    </a>
                    <a
                      href={`tel:${UOMBONI_LOCATION_CONFIG.contactPhones.secondMaster.replace(/\s+/g, '')}`}
                      className="block hover:text-[#102A43] transition-colors"
                    >
                      {UOMBONI_LOCATION_CONFIG.contactPhones.secondMaster} (Makamu Mkuu wa Shule)
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-md bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43] shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-[#102A43]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#102A43] block">Official Email</span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    <a
                      href={`mailto:${UOMBONI_LOCATION_CONFIG.email}`}
                      className="font-semibold text-[#102A43] hover:text-[#C9A227] transition-colors"
                    >
                      {UOMBONI_LOCATION_CONFIG.email}
                    </a>
                  </p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-md bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43] shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-[#102A43]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#102A43] block">Administrative Office Hours</span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Monday – Friday: 8:00 AM – 4:30 PM<br />
                    Saturday: 9:00 AM – 1:00 PM (By Appointment)<br />
                    Sunday: Closed for Worship &amp; Rest
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#102A43]/15 shadow-xs">
              <h3 className="text-base font-bold text-[#102A43] uppercase tracking-wider mb-2">
                Send an Inquiry
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Our admissions and academic registry team typically responds within one business day.
              </p>

              {formSubmitted ? (
                <div className="p-6 bg-[#FFFFF0] border border-[#C9A227]/40 rounded-lg text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#102A43] mx-auto" />
                  <h4 className="text-sm font-bold text-[#102A43]">
                    Inquiry Received Successfully
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you for contacting Uomboni Secondary School. An administrative officer will review your message and reach out shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#102A43] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John K. Mushi"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#102A43] bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#102A43] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+255 7XX XXX XXX"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#102A43] bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#102A43] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#102A43] bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#102A43] mb-1">
                        Subject of Inquiry *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#102A43] bg-white text-slate-900"
                      >
                        <option value="">Select a topic...</option>
                        <option value="Form One Admissions">Form One Admissions</option>
                        <option value="Transfer Request">Form 2 / Form 3 Transfer</option>
                        <option value="Academic Report Inquiries">Academic Results &amp; Reports</option>
                        <option value="School Fees & Bursar">School Fees &amp; Accounts</option>
                        <option value="Boarding Facilities">Boarding &amp; Student Welfare</option>
                        <option value="General Information">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please write your inquiry or request details here..."
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#102A43] bg-white text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-semibold rounded-md transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DEDICATED GOOGLE MAPS LOCATION SECTION                                   */}
        {/* ========================================================================= */}
        <div id="find-uomboni" className="mt-20 pt-16 border-t border-[#102A43]/15">
          {/* Section Heading & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-1 uppercase">
                Location &amp; Directions
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#102A43] tracking-tight">
                Find Uomboni Secondary School
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-700">
                Visit us at our school campus in Marangu, Moshi.
              </p>
            </div>

            {/* Top Interactive Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={getSchoolDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Get Directions</span>
              </a>

              <a
                href={getSchoolMapUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#FFFFF0] text-[#102A43] border border-[#102A43]/20 text-xs font-semibold rounded-md transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Wrapper */}
          <div className="bg-white rounded-lg border border-[#102A43]/15 overflow-hidden shadow-xs">
            {/* School Location Marker Bar */}
            <div className="px-4 py-3.5 bg-[#102A43] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-[#FFFFF0]/15 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                </div>
                <div>
                  <span className="font-bold tracking-tight text-[#FFFFF0]">
                    {UOMBONI_LOCATION_CONFIG.schoolName}
                  </span>
                  <span className="text-[#FFFFF0]/70 ml-2">
                    • Marangu, Moshi, Tanzania ({UOMBONI_LOCATION_CONFIG.coordinates.dms})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#FFFFF0]/80">
                <span className="inline-block w-2 h-2 rounded-full bg-[#C9A227]"></span>
                <span>NECTA Center: S0486 • Catholic Diocese of Moshi</span>
              </div>
            </div>

            {/* Interactive Google Map Responsive Iframe */}
            <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] bg-slate-100">
              <iframe
                title="Interactive Google Map showing Uomboni Secondary School in Marangu, Moshi"
                src={getSchoolMapEmbedUrl()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Location Details & Contacts Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. School Address & Location Details */}
            <div className="bg-white p-6 rounded-lg border border-[#102A43]/15 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43]">
                  <Building className="w-4 h-4 text-[#102A43]" />
                </div>
                <h4 className="text-sm font-bold text-[#102A43]">
                  School Address &amp; Location
                </h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                <strong className="block text-[#102A43] font-semibold">
                  {UOMBONI_LOCATION_CONFIG.schoolName}
                </strong>
                {UOMBONI_LOCATION_CONFIG.wardAndDistrict}<br />
                {UOMBONI_LOCATION_CONFIG.regionAndCountry}<br />
                {UOMBONI_LOCATION_CONFIG.postalAddress}
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>GPS: {UOMBONI_LOCATION_CONFIG.coordinates.latitude}, {UOMBONI_LOCATION_CONFIG.coordinates.longitude}</span>
              </div>
            </div>

            {/* 2. Contact Phone */}
            <div className="bg-white p-6 rounded-lg border border-[#102A43]/15 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43]">
                  <Phone className="w-4 h-4 text-[#102A43]" />
                </div>
                <h4 className="text-sm font-bold text-[#102A43]">
                  Contact Phone
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For administrative assistance, admissions, or directions while traveling:
              </p>
              <div className="text-xs space-y-1.5 pt-1">
                <a
                  href={`tel:${UOMBONI_LOCATION_CONFIG.contactPhones.primary.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between text-[#102A43] font-semibold hover:text-[#C9A227] transition-colors"
                >
                  <span>Simu Kuu ya Shule:</span>
                  <span>{UOMBONI_LOCATION_CONFIG.contactPhones.primary}</span>
                </a>
                <a
                  href={`tel:${UOMBONI_LOCATION_CONFIG.contactPhones.headmaster.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between text-slate-700 hover:text-[#102A43] transition-colors"
                >
                  <span>Mkuu wa Shule:</span>
                  <span>{UOMBONI_LOCATION_CONFIG.contactPhones.headmaster}</span>
                </a>
                <a
                  href={`tel:${UOMBONI_LOCATION_CONFIG.contactPhones.secondMaster.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between text-slate-700 hover:text-[#102A43] transition-colors"
                >
                  <span>Makamu Mkuu:</span>
                  <span>{UOMBONI_LOCATION_CONFIG.contactPhones.secondMaster}</span>
                </a>
              </div>
            </div>

            {/* 3. School Email & Visitor Hours */}
            <div className="bg-white p-6 rounded-lg border border-[#102A43]/15 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43]">
                  <Mail className="w-4 h-4 text-[#102A43]" />
                </div>
                <h4 className="text-sm font-bold text-[#102A43]">
                  School Email &amp; Visiting
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official inquiries and admissions documents:
              </p>
              <div className="text-xs">
                <a
                  href={`mailto:${UOMBONI_LOCATION_CONFIG.email}`}
                  className="font-semibold text-[#102A43] hover:text-[#C9A227] transition-colors block"
                >
                  {UOMBONI_LOCATION_CONFIG.email}
                </a>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                <span className="font-semibold text-[#102A43] block">Campus Visiting Hours:</span>
                Mon – Fri: 8:00 AM – 4:30 PM (Reception Gate)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
