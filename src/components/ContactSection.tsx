import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Calendar,
  Clock,
  Loader2,
  Inbox,
  AlertCircle,
  X,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    company: '',
    roleType: 'Junior Full Stack Developer',
    message: '',
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoOpenGmail, setAutoOpenGmail] = useState(true);
  const [submissionResult, setSubmissionResult] = useState<{
    directMailtoUrl: string;
    gmailComposeUrl: string;
    emailSent?: boolean;
    needsActivation?: boolean;
    emailStatusMessage?: string;
  } | null>(null);

  // Inquiries Modal State for Priyadarshan
  const [showInboxModal, setShowInboxModal] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [inquiriesCount, setInquiriesCount] = useState(0);

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInquiries(json.data);
        setInquiriesCount(json.data.length);
      }
    } catch (e) {
      console.error('Failed to load inquiries', e);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const quickTemplates = [
    {
      label: 'Interview Invitation',
      text: `Hi Priyadarshan, we were impressed by your MERN stack portfolio and internship work. We'd love to invite you for an interview for a Junior Developer role.`,
    },
    {
      label: 'Role Opportunity',
      text: `Hello Priyadarshan, we have an immediate opening for a Full Stack Developer (React / Node / MongoDB) on our engineering team.`,
    },
    {
      label: 'Quick Connect',
      text: `Hi Priyadarshan, I came across your showcase and would like to connect regarding upcoming tech opportunities.`,
    },
  ];

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 3000);
  };

  const subjectText = `[Job Inquiry] ${formData.roleType} - ${formData.company || formData.senderName || 'Hiring Inquiry'}`;
  const bodyText = `Hello Priyadarshan,\n\n${formData.message || 'I would like to discuss an opportunity with you.'}\n\nCandidate / Recruiter Details:\n- Name: ${formData.senderName || 'Recruiter'}\n- Email: ${formData.senderEmail || 'recruiter@company.com'}\n- Company: ${formData.company || 'Not Specified'}\n- Proposed Role: ${formData.roleType}\n\nBest regards,\n${formData.senderName || 'Recruiter'}`;

  const mailtoLink = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
  const gmailComposeLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PERSONAL_INFO.email)}&su=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

  const whatsappLink = `https://wa.me/918984054385?text=${encodeURIComponent(
    `Hi Priyadarshan, I reviewed your developer portfolio (${formData.roleType}) and would like to connect regarding an opportunity at ${formData.company || 'our company'}.`
  )}`;

  // Direct 1-Click Send via Gmail Web
  const handleSendViaGmailDirect = async () => {
    // If fields are empty, still open Gmail with what's available
    const url = gmailComposeLink;
    window.open(url, '_blank', 'noopener,noreferrer');

    // Also record in background if sender name and email are provided
    if (formData.senderName || formData.senderEmail || formData.message) {
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            senderName: formData.senderName || 'Recruiter (Direct Gmail)',
            senderEmail: formData.senderEmail || 'recruiter@company.com',
            message: formData.message || 'Sent directly via Gmail Web button',
          }),
        });
        fetchInquiries();
      } catch (err) {
        // non-blocking
      }
    }
  };

  // Direct 1-Click Send via Mail App
  const handleSendViaMailApp = async () => {
    window.location.href = mailtoLink;
    if (formData.senderName || formData.senderEmail || formData.message) {
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            senderName: formData.senderName || 'Recruiter (Mail App)',
            senderEmail: formData.senderEmail || 'recruiter@company.com',
            message: formData.message || 'Sent directly via default Mail App',
          }),
        });
        fetchInquiries();
      } catch (err) {
        // non-blocking
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmissionResult({
          directMailtoUrl: data.directMailtoUrl || mailtoLink,
          gmailComposeUrl: data.gmailComposeUrl || gmailComposeLink,
          emailSent: data.emailSent,
          needsActivation: data.needsActivation,
          emailStatusMessage: data.emailStatusMessage,
        });
        setSubmitted(true);
        fetchInquiries();

        // If auto-open in Gmail is enabled, open Gmail pre-composed window
        if (autoOpenGmail) {
          window.open(data.gmailComposeUrl || gmailComposeLink, '_blank', 'noopener,noreferrer');
        }
      } else {
        throw new Error(data.error || 'Failed to submit inquiry');
      }
    } catch (err: any) {
      setSubmissionResult({
        directMailtoUrl: mailtoLink,
        gmailComposeUrl: gmailComposeLink,
        emailSent: false,
        emailStatusMessage: 'Inquiry saved in portfolio inbox. Ready for 1-click dispatch to Gmail.',
      });
      setSubmitted(true);
      fetchInquiries();
      if (autoOpenGmail) {
        window.open(gmailComposeLink, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-t border-neutral-800/60 bg-neutral-950/65 backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
              <Mail className="w-3.5 h-3.5" />
              Direct Contact & Inquiries
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
              Get in Touch Directly
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed max-w-2xl">
              Looking for a full-stack engineer? Connect with Priyadarshan directly at <span className="text-emerald-400 font-mono font-medium">{PERSONAL_INFO.email}</span> or submit a note below.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Priyadarshan's Saved Inquiries Viewer */}
            <button
              type="button"
              onClick={() => {
                fetchInquiries();
                setShowInboxModal(true);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer"
              title="View inquiries and messages received on portfolio"
            >
              <Inbox className="w-3.5 h-3.5 text-emerald-400" />
              <span>Received Inquiries</span>
              {inquiriesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  {inquiriesCount}
                </span>
              )}
            </button>

            {/* Availability Status Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs font-mono shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-neutral-200 font-semibold">Available for Opportunities</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact & Availability */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Contact Cards */}
            <div className="space-y-3">
              {/* Primary Email Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-neutral-900/90 to-neutral-900/80 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <span>Direct Inbox Contact</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[9px] font-bold">Direct to Priyadarshan</span>
                    </div>
                    <a
                      href={`mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent('Interview / Job Opportunity')}`}
                      className="text-xs sm:text-sm font-bold text-neutral-100 hover:text-emerald-300 truncate block transition-colors mt-0.5"
                    >
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PERSONAL_INFO.email)}&su=${encodeURIComponent('Interview / Job Opportunity')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
                    title="Open compose window directly in Gmail Web"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Gmail Web
                  </a>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent('Interview / Job Opportunity')}`}
                    className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-medium text-xs flex items-center gap-1 transition-all"
                    title="Open in default desktop/mobile email client"
                  >
                    <Mail className="w-3 h-3 text-emerald-400" />
                    Mail App
                  </a>
                  <button
                    onClick={() => handleCopy(PERSONAL_INFO.email, 'email')}
                    className="p-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 text-xs cursor-pointer"
                    title="Copy email address"
                  >
                    {copiedField === 'email' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-neutral-400">Phone & WhatsApp</div>
                    <a
                      href={`tel:${PERSONAL_INFO.phone}`}
                      className="text-xs sm:text-sm font-semibold text-neutral-200 hover:text-cyan-400 truncate block transition-colors"
                    >
                      {PERSONAL_INFO.phoneFormatted}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-medium transition-colors"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={() => handleCopy(PERSONAL_INFO.phone, 'phone')}
                    className="p-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 text-xs"
                    title="Copy phone number"
                  >
                    {copiedField === 'phone' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-neutral-400">Current Base</div>
                  <div className="text-xs sm:text-sm font-semibold text-neutral-200">
                    {PERSONAL_INFO.location}
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs flex items-center gap-2 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-cyan-400" />
                    LinkedIn
                  </a>
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs flex items-center gap-2 transition-colors"
                  >
                    <Github className="w-4 h-4 text-neutral-300" />
                    GitHub
                  </a>
                </div>

                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Immediate Joiner
                </span>
              </div>
            </div>

            {/* Availability & Response Commitment Card */}
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Quick Response Commitment</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Typically responds within 2-4 hours. Open to Full-time Junior / Associate Full Stack Developer positions (Remote, Hybrid, or On-site).
              </p>
            </div>
          </div>

          {/* Right Column: Recruiter Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    Send Inquiry to Priyadarshan
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Fill out the form below or reach out directly to <span className="text-emerald-400 font-mono">{PERSONAL_INFO.email}</span>.
                  </p>
                </div>
              </div>

              {/* Quick Template Buttons */}
              <div className="mb-4">
                <span className="text-[11px] font-mono text-neutral-400 block mb-2">
                  Quick message presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickTemplates.map((tmpl) => (
                    <button
                      key={tmpl.label}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, message: tmpl.text }))}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
                    >
                      + {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {submitted ? (
                <div className="p-6 sm:p-8 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-4 animate-scaleUp">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-300">Inquiry Captured for Priyadarshan!</h4>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 max-w-md mx-auto leading-relaxed">
                      Your note has been saved in the portfolio database for{' '}
                      <span className="text-emerald-400 font-mono font-semibold underline underline-offset-2">
                        {PERSONAL_INFO.email}
                      </span>
                      . Priyadarshan reviews inquiries within 2–4 hours.
                    </p>
                    {submissionResult?.emailStatusMessage && (
                      <p className="text-[11px] font-mono text-emerald-400/90 mt-1">
                        ✓ {submissionResult.emailStatusMessage}
                      </p>
                    )}
                  </div>

                  {/* If FormSubmit needs owner activation */}
                  {submissionResult?.needsActivation && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-200">Owner Activation Link Dispatched:</strong>
                        <span className="text-neutral-300 text-[11px] leading-relaxed">
                          FormSubmit has dispatched a verification email to <strong className="text-amber-300">{PERSONAL_INFO.email}</strong>. Please check your Gmail (including Spam/Updates) and click <strong>"Activate Form"</strong> once to enable background email forwarding.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 100% Guaranteed Direct Inbox Sending Action */}
                  <div className="p-4 rounded-xl bg-neutral-900/95 border border-emerald-500/40 text-left space-y-2.5 shadow-lg">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Direct Inbox Delivery Guarantee</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      To ensure your message lands directly in Priyadarshan's inbox with zero spam-folder delay, click below to send via your verified email:
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={submissionResult?.gmailComposeUrl || gmailComposeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                        title="Open composed message in Gmail Web"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Send via Gmail Web
                      </a>
                      <a
                        href={submissionResult?.directMailtoUrl || mailtoLink}
                        className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs flex items-center gap-1.5 transition-all font-medium"
                        title="Open in default desktop or mobile mail app"
                      >
                        <Mail className="w-4 h-4 text-emerald-400" />
                        Open Mail App
                      </a>
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Phone className="w-4 h-4 text-cyan-400" />
                        WhatsApp Direct
                      </a>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-neutral-800 text-left max-w-md mx-auto space-y-1 text-xs">
                    <div className="text-[11px] text-neutral-400 flex justify-between">
                      <span>Sender:</span>
                      <span className="text-neutral-200 font-medium">{formData.senderName} ({formData.senderEmail})</span>
                    </div>
                    {formData.company && (
                      <div className="text-[11px] text-neutral-400 flex justify-between">
                        <span>Organization:</span>
                        <span className="text-neutral-200">{formData.company}</span>
                      </div>
                    )}
                    <div className="text-[11px] text-neutral-400 flex justify-between">
                      <span>Role:</span>
                      <span className="text-emerald-300 font-mono">{formData.roleType}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(`${subjectText}\n\n${bodyText}`, 'message_copy')}
                      className="px-3 py-2 rounded-lg bg-neutral-950 hover:bg-neutral-900 text-neutral-300 border border-neutral-800 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedField === 'message_copy' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Note</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-3 py-2 rounded-lg text-neutral-400 hover:text-neutral-200 text-xs cursor-pointer ml-1"
                    >
                      Send Another Note
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Suman Senapati"
                        value={formData.senderName}
                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. recruiter@company.com"
                        value={formData.senderEmail}
                        onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">Organization / Company</label>
                      <input
                        type="text"
                        placeholder="e.g. Tech Corp / Startup"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">Opportunity Type</label>
                      <select
                        value={formData.roleType}
                        onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Junior Full Stack Developer">Junior Full Stack Developer</option>
                        <option value="MERN Stack Developer">MERN Stack Developer</option>
                        <option value="Frontend Developer (React)">Frontend Developer (React)</option>
                        <option value="Backend Developer (Node/Express)">Backend Developer (Node/Express)</option>
                        <option value="Internship / Trainee">Internship / Trainee</option>
                        <option value="Freelance / Contract Project">Freelance / Contract Project</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Message Details</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your note, job description details, or interview availability..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Auto-open in Gmail option for guaranteed instant delivery */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800 text-[11px] text-neutral-300">
                    <input
                      type="checkbox"
                      id="autoOpenGmail"
                      checked={autoOpenGmail}
                      onChange={(e) => setAutoOpenGmail(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-neutral-900 border-neutral-700 focus:ring-emerald-400 focus:ring-offset-neutral-950 accent-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="autoOpenGmail" className="cursor-pointer select-none">
                      <strong className="text-emerald-400 font-medium">Direct Delivery Guarantee:</strong> Also launch pre-filled Gmail compose window upon sending
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1.5 font-mono">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      Direct to: <strong className="text-emerald-300">{PERSONAL_INFO.email}</strong>
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Direct 1-Click Send via Gmail */}
                      <button
                        type="button"
                        onClick={handleSendViaGmailDirect}
                        className="px-3.5 py-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        title="Open pre-composed message directly in Gmail Web"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Send via Gmail Web</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Dispatching...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Priyadarshan's In-Portfolio Message Inbox Modal */}
      {showInboxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    Priyadarshan's Message Inbox
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono">
                      {inquiries.length} {inquiries.length === 1 ? 'Message' : 'Messages'}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    All inquiries submitted on portfolio are captured here in real time.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchInquiries}
                  disabled={loadingInquiries}
                  className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
                  title="Refresh inquiries"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingInquiries ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowInboxModal(false)}
                  className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content / Inquiries List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {loadingInquiries && inquiries.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mx-auto" />
                  <p className="text-xs text-neutral-400">Loading received inquiries...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Inbox className="w-10 h-10 text-neutral-600 mx-auto" />
                  <h4 className="text-sm font-semibold text-neutral-300">No Messages Yet</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    When recruiters or visitors submit an inquiry or connect with you, their messages will appear here immediately.
                  </p>
                </div>
              ) : (
                inquiries.map((inq, idx) => (
                  <div
                    key={inq._id || idx}
                    className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/90 space-y-3 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/60 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-neutral-100">{inq.senderName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {inq.roleType}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>{inq.senderEmail}</span>
                          {inq.company && <span>• {inq.company}</span>}
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-neutral-500">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : 'Recent'}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800/60 text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed">
                      {inq.message}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {inq.emailSent ? '✓ Email Dispatched' : '• Stored in Portfolio'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(inq.senderEmail, `email_${idx}`)}
                          className="px-2.5 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedField === `email_${idx}` ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Email</span>
                            </>
                          )}
                        </button>
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inq.senderEmail)}&su=${encodeURIComponent(`Re: ${inq.roleType} Opportunity`)}&body=${encodeURIComponent(`Hi ${inq.senderName},\n\nThank you for reaching out regarding the ${inq.roleType} position at ${inq.company || 'your team'}.\n\nBest regards,\nPriyadarshan Baral\n+91 89840 54385`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Reply in Gmail
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/70 flex items-center justify-between text-xs text-neutral-400">
              <span>Recipient address: <strong className="text-emerald-400 font-mono">{PERSONAL_INFO.email}</strong></span>
              <button
                type="button"
                onClick={() => setShowInboxModal(false)}
                className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
