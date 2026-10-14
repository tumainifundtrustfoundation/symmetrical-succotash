import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { language } = useLanguage();
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
    <section id="contact" className="py-12 sm:py-16 bg-[#FFFFF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-2 uppercase">
            {language === 'sw' ? 'Wasiliana Nasi' : 'Get In Touch'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
            {language === 'sw' ? 'Wasiliana na Shule ya Sekondari Uomboni' : 'Contact Uomboni Secondary School'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
            {language === 'sw'
              ? 'Tunakaribisha maswali na maoni kutoka kwa wazazi watarajiwa, wanachuo, na wadau wa elimu. Wasiliana na timu yetu ya utawala au tembelea ofisi zetu zilizopo Marangu.'
              : 'We welcome inquiries from prospective parents, alumni, and educational partners. Reach out to our administrative team or visit our school offices in Marangu.'}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details (5 cols) - Interactive Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-bold text-[#102A43] tracking-tight">
                {language === 'sw' ? 'Mawasiliano Rasmi ya Shule' : 'Official School Contacts'}
              </h3>
              <span className="text-[11px] font-mono text-[#C9A227] font-bold uppercase tracking-wider">
                {language === 'sw' ? 'Ofisi za Shule' : 'School Office'}
              </span>
            </div>

            {/* Card 1: Physical Location */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#102A43]/15 shadow-xs transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#102A43]/10 hover:border-[#C9A227]/70 group cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43] shrink-0 mt-0.5 transition-all duration-300 group-hover:bg-[#102A43] group-hover:text-amber-300 group-hover:scale-105 group-hover:border-[#102A43] shadow-2xs">
                  <MapPin className="w-5 h-5 transition-colors duration-300" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#102A43] block uppercase tracking-wide">
                    {language === 'sw' ? 'Mahali Ilipo Shule (Anwani)' : 'Physical Address'}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Marangu West, Moshi Rural District<br />
                    Mount Kilimanjaro Slopes, Kilimanjaro Region<br />
                    P.O. Box 361, Marangu - Moshi, Tanzania
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Telephone Hotlines */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#102A43]/15 shadow-xs transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#102A43]/10 hover:border-[#C9A227]/70 group cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43] shrink-0 mt-0.5 transition-all duration-300 group-hover:bg-[#102A43] group-hover:text-amber-300 group-hover:scale-105 group-hover:border-[#102A43] shadow-2xs">
                  <Phone className="w-5 h-5 transition-colors duration-300" />
                </div>
                <div className="w-full">
                  <span className="text-xs font-bold text-[#102A43] block uppercase tracking-wide">
                    {language === 'sw' ? 'Namba za Simu za Moja kwa Moja' : 'Telephone Hotlines'}
                  </span>
                  <div className="mt-2 space-y-1.5 font-mono text-xs sm:text-sm">
                    <a
                      href="tel:+255752000939"
                      className="flex items-center justify-between py-0.5 text-slate-700 hover:text-[#102A43] font-semibold transition-colors group/item"
                    >
                      <span className="group-hover/item:underline">+255 752 000 939</span>
                      <span className="text-[10px] text-amber-800 font-sans font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {language === 'sw' ? 'Udahili' : 'Admissions'}
                      </span>
                    </a>
                    <a
                      href="tel:+255782558127"
                      className="flex items-center justify-between py-0.5 text-slate-600 hover:text-[#102A43] transition-colors group/item"
                    >
                      <span className="group-hover/item:underline">+255 782 558 127</span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        {language === 'sw' ? 'Mkuu wa Shule' : 'Headmaster'}
                      </span>
                    </a>
                    <a
                      href="tel:+255754532949"
                      className="flex items-center justify-between py-0.5 text-slate-600 hover:text-[#102A43] transition-colors group/item"
                    >
                      <span className="group-hover/item:underline">+255 754 532 949</span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        {language === 'sw' ? 'Makamu Mkuu' : 'Second Master'}
                      </span>
                    </a>
                    <a
                      href="tel:+255745548225"
                      className="flex items-center justify-between py-0.5 text-slate-600 hover:text-[#102A43] transition-colors group/item"
                    >
                      <span className="group-hover/item:underline">+255 745 548 225</span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        {language === 'sw' ? 'Mtaaluma' : 'Academic Master'}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Email & Web */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#102A43]/15 shadow-xs transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#102A43]/10 hover:border-[#C9A227]/70 group cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43] shrink-0 mt-0.5 transition-all duration-300 group-hover:bg-[#102A43] group-hover:text-amber-300 group-hover:scale-105 group-hover:border-[#102A43] shadow-2xs">
                  <Mail className="w-5 h-5 transition-colors duration-300" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#102A43] block uppercase tracking-wide">
                    {language === 'sw' ? 'Barua Pepe Rasmi na Tovuti' : 'Official Email & Web'}
                  </span>
                  <div className="mt-1.5 space-y-1 text-xs sm:text-sm text-slate-600">
                    <a
                      href="mailto:info@uomboniss.ac.tz"
                      className="block font-mono text-slate-700 hover:text-[#102A43] hover:underline"
                    >
                      info@uomboniss.ac.tz
                    </a>
                    <a
                      href="mailto:uombonisec@gmail.com"
                      className="block font-mono text-slate-700 hover:text-[#102A43] hover:underline"
                    >
                      uombonisec@gmail.com
                    </a>
                    <span className="font-mono text-xs text-[#102A43] font-bold block pt-1">
                      www.uomboniss.ac.tz
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Office Hours */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#102A43]/15 shadow-xs transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#102A43]/10 hover:border-[#C9A227]/70 group cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#FFFFF0] border border-[#C9A227]/40 flex items-center justify-center text-[#102A43] shrink-0 mt-0.5 transition-all duration-300 group-hover:bg-[#102A43] group-hover:text-amber-300 group-hover:scale-105 group-hover:border-[#102A43] shadow-2xs">
                  <Clock className="w-5 h-5 transition-colors duration-300" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#102A43] block uppercase tracking-wide">
                    {language === 'sw' ? 'Muda wa Kazi za Ofisi' : 'Administrative Office Hours'}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {language === 'sw' ? 'Jumatatu – Ijumaa: Saa 2:00 Asubuhi – Saa 10:30 Jioni' : 'Monday – Friday: 8:00 AM – 4:30 PM'}<br />
                    {language === 'sw' ? 'Jumamosi: Saa 3:00 Asubuhi – Saa 7:00 Mchana (Kwa Miadi)' : 'Saturday: 9:00 AM – 1:00 PM (By Appointment)'}<br />
                    <span className="text-slate-500 font-medium">
                      {language === 'sw' ? 'Jumapili: Imefungwa kwa Ajili ya Ibada & Pumziko' : 'Sunday: Closed for Worship & Rest'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#102A43]/15 shadow-xs transition-all duration-300 hover:shadow-md">
              <h3 className="text-base font-bold text-[#102A43] uppercase tracking-wider mb-2">
                {language === 'sw' ? 'Tuma Ujumbe au Swali' : 'Send an Inquiry'}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {language === 'sw'
                  ? 'Timu yetu ya udahili na utawala hujibu maswali kwa kawaida ndani ya siku moja ya kazi.'
                  : 'Our admissions and academic registry team typically responds within one business day.'}
              </p>

              {formSubmitted ? (
                <div className="p-6 bg-[#FFFFF0] border border-[#C9A227]/40 rounded-lg text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#102A43] mx-auto" />
                  <h4 className="text-sm font-bold text-[#102A43]">
                    {language === 'sw' ? 'Ujumbe Umepokelewa Kikamilifu' : 'Inquiry Received Successfully'}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    {language === 'sw'
                      ? 'Asante kwa kuwasiliana na Shule ya Sekondari Uomboni. Afisa wa utawala atapitia ujumbe wako na kuwasiliana nawe hivi karibuni.'
                      : 'Thank you for contacting Uomboni Secondary School. An administrative officer will review your message and reach out shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#102A43] mb-1">
                        {language === 'sw' ? 'Jina Kamili *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === 'sw' ? 'mf. John K. Mushi' : 'e.g. John K. Mushi'}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#102A43] bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#102A43] mb-1">
                        {language === 'sw' ? 'Namba ya Simu *' : 'Phone Number *'}
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
                        {language === 'sw' ? 'Barua Pepe' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jina@mfano.com"
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#102A43] bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#102A43] mb-1">
                        {language === 'sw' ? 'Mada ya Ujumbe *' : 'Subject of Inquiry *'}
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#102A43] bg-white text-slate-900"
                      >
                        <option value="">{language === 'sw' ? 'Chagua mada...' : 'Select a topic...'}</option>
                        <option value="Form One Admissions">{language === 'sw' ? 'Udahili wa Kidato cha Kwanza' : 'Form One Admissions'}</option>
                        <option value="Transfer Request">{language === 'sw' ? 'Uhamisho (Kidato 2 au 3)' : 'Form 2 / Form 3 Transfer'}</option>
                        <option value="Academic Report Inquiries">{language === 'sw' ? 'Ripoti & Matokeo ya Masomo' : 'Academic Results & Reports'}</option>
                        <option value="School Fees & Bursar">{language === 'sw' ? 'Ada & Malipo ya Shule' : 'School Fees & Accounts'}</option>
                        <option value="Boarding Facilities">{language === 'sw' ? 'Hosteli & Ustawi wa Wanafunzi' : 'Boarding & Student Welfare'}</option>
                        <option value="General Information">{language === 'sw' ? 'Uchunguzi wa Jumla' : 'General Inquiry'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      {language === 'sw' ? 'Ujumbe Wako *' : 'Your Message *'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === 'sw' ? 'Tafadhali andika maelezo ya ujumbe wako hapa...' : 'Please write your inquiry or request details here...'}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#102A43] bg-white text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-semibold rounded-md transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>{language === 'sw' ? 'Tuma Ujumbe' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
