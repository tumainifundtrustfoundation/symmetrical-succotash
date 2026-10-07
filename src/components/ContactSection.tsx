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
  Compass
} from 'lucide-react';
import { UOMBONI_MAP_CONFIG } from '../config/schoolMapConfig';

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
                  <span className="text-xs font-bold text-[#102A43] block">Physical Address</span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                    Marangu West, Moshi Rural District<br />
                    Mount Kilimanjaro Slopes, Kilimanjaro Region<br />
                    P.O. Box 273, Moshi, Tanzania
                  </p>
                </div>
              </div>

              {/* Telephone */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-md bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43] shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-[#102A43]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#102A43] block">Telephone Lines</span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 space-y-1">
                    <span className="block">+255 782 558 127 (Headmaster)</span>
                    <span className="block">+255 754 532 949 (Second Master)</span>
                    <span className="block">+255 745 548 225 (Academic Master)</span>
                  </p>
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
                    uombonisec@gmail.com<br />
                    info@uombonisec.ac.tz
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

        {/* ========================================================= */}
        {/* GOOGLE MAPS LOCATION SECTION — FIND UOMBONI SECONDARY SCHOOL */}
        {/* ========================================================= */}
        <div id="school-location-map" className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-[#102A43]/15">
          {/* Section Header */}
          <div className="max-w-3xl mb-8 sm:mb-10">
            <span className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-2 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Campus Map &amp; Navigation</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
              Find Uomboni Secondary School
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
              Visit us at our school campus in Marangu, Moshi.
            </p>
          </div>

          {/* Interactive Map & Campus Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Google Map Frame (8 cols on Desktop, full width on Mobile & Tablet) */}
            <div className="lg:col-span-8 bg-white p-2.5 sm:p-3 rounded-lg border border-[#102A43]/15 shadow-xs">
              {/* Location Marker Header Bar */}
              <div className="px-3 py-2.5 mb-2.5 bg-[#FFFFF0] rounded-md border border-[#C9A227]/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#102A43] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#102A43] block">
                      {UOMBONI_MAP_CONFIG.campusLabel}
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      {UOMBONI_MAP_CONFIG.locationLine2} &bull; Coordinates: {UOMBONI_MAP_CONFIG.coordinates.lat}, {UOMBONI_MAP_CONFIG.coordinates.lng}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={UOMBONI_MAP_CONFIG.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#102A43] hover:bg-[#0A1C2E] text-white text-[11px] font-semibold rounded-md transition-colors shadow-xs cursor-pointer"
                  >
                    <Navigation className="w-3 h-3 text-[#C9A227]" />
                    <span>Get Directions</span>
                  </a>
                  <a
                    href={UOMBONI_MAP_CONFIG.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFF0] hover:bg-white text-[#102A43] border border-[#C9A227] text-[11px] font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3 text-[#102A43]" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Responsive Google Maps Embed Container */}
              <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <iframe
                  title="Google Map of Uomboni Secondary School Location, Marangu, Moshi"
                  src={UOMBONI_MAP_CONFIG.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Bottom Caption & Coordinates Info */}
              <div className="mt-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500">
                <span>Interactive map view &bull; Slopes of Mount Kilimanjaro, Marangu Magharibi</span>
                <span className="font-mono text-slate-400">Plus Code: {UOMBONI_MAP_CONFIG.openLocationCode}</span>
              </div>
            </div>

            {/* Campus Address & Contact Details Sidebar (4 cols on Desktop) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white p-6 rounded-lg border border-[#102A43]/15 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-[#102A43] uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Compass className="w-4 h-4 text-[#C9A227]" />
                  <span>Campus Details &amp; Contacts</span>
                </h3>

                {/* School Address */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider block">
                    School Address
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#102A43] leading-snug">
                    {UOMBONI_MAP_CONFIG.locationLine1}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {UOMBONI_MAP_CONFIG.districtRegion}
                  </p>
                  <p className="text-xs text-slate-500">
                    {UOMBONI_MAP_CONFIG.poBox}
                  </p>
                </div>

                {/* Contact Phone */}
                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider block">
                    Contact Phone
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <a
                      href={`tel:${UOMBONI_MAP_CONFIG.primaryPhone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-2 text-[#102A43] hover:text-[#C9A227] font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                      <span>{UOMBONI_MAP_CONFIG.primaryPhone} (Headmaster)</span>
                    </a>
                    <a
                      href={`tel:${UOMBONI_MAP_CONFIG.secondaryPhone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-2 text-[#102A43] hover:text-[#C9A227] font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                      <span>{UOMBONI_MAP_CONFIG.secondaryPhone} (Administration)</span>
                    </a>
                    <a
                      href={`tel:${UOMBONI_MAP_CONFIG.academicPhone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-2 text-slate-600 hover:text-[#102A43] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                      <span>{UOMBONI_MAP_CONFIG.academicPhone} (Academic Office)</span>
                    </a>
                  </div>
                </div>

                {/* School Email */}
                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider block">
                    School Email
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <a
                      href={`mailto:${UOMBONI_MAP_CONFIG.email}`}
                      className="flex items-center gap-2 text-[#102A43] hover:text-[#C9A227] font-semibold transition-colors break-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                      <span>{UOMBONI_MAP_CONFIG.email}</span>
                    </a>
                    <a
                      href={`mailto:${UOMBONI_MAP_CONFIG.secondaryEmail}`}
                      className="flex items-center gap-2 text-slate-600 hover:text-[#102A43] transition-colors break-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                      <span>{UOMBONI_MAP_CONFIG.secondaryEmail}</span>
                    </a>
                  </div>
                </div>

                {/* Action Buttons Stack */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <a
                    href={UOMBONI_MAP_CONFIG.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2.5 bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-[#C9A227]" />
                    <span>Get Directions</span>
                  </a>

                  <a
                    href={UOMBONI_MAP_CONFIG.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2.5 bg-[#FFFFF0] hover:bg-white text-[#102A43] border border-[#C9A227] text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-[#102A43]" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
