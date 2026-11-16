import React, { useState } from 'react';
import { 
  Mail, 
  Instagram, 
  Youtube, 
  Facebook, 
  HelpCircle, 
  Send, 
  CheckCircle2 
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '', topic: 'General Inquiry' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', message: '', topic: 'General Inquiry' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] uppercase tracking-widest text-nexora-muted font-bold block">
          Connect With Nexora
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-nexora-charcoal">
          Get in Touch
        </h1>
        <p className="text-xs md:text-sm text-nexora-muted leading-relaxed">
          Questions about our curated collections or interested in creator brand partnerships? Reach out to our editorial desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Contact Information & Channels */}
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-nexora-border/80 shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-lg text-nexora-charcoal">
              Official Channels
            </h3>

            <div className="space-y-4 text-xs text-nexora-charcoal">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-nexora-warmWhite border border-nexora-border text-nexora-charcoal shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-nexora-charcoal">Editorial &amp; Inquiries</span>
                  <span className="text-nexora-muted">contact@nexoracollection.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-pink-50 border border-pink-200 text-pink-600 shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-nexora-charcoal">Instagram Reels</span>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:underline"
                  >
                    @nexoracollection
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 shrink-0">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-nexora-charcoal">YouTube Shorts</span>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline"
                  >
                    youtube.com/@nexoracollection
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 shrink-0">
                  <Facebook className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-nexora-charcoal">Facebook Page</span>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    facebook.com/nexoracollection
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ note on orders */}
          <div className="p-6 bg-nexora-cream rounded-2xl border border-nexora-border/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-nexora-charcoal">
              <HelpCircle className="w-4 h-4 text-nexora-charcoal" />
              <span>Questions regarding Meesho orders?</span>
            </div>
            <p className="text-xs text-nexora-muted leading-relaxed">
              Because Nexora Collection is an affiliate discovery hub, order fulfillment, shipping, tracking, and returns are handled directly through your Meesho app account. For order assistance, visit the Help section in your Meesho application.
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-nexora-border/80 shadow-xs">
          <h3 className="font-serif font-bold text-lg text-nexora-charcoal mb-4">
            Send an Inquiry
          </h3>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-semibold text-sm text-emerald-900">
                Message Received
              </h4>
              <p className="text-xs text-emerald-700">
                Thank you for reaching out. Our team will review your note shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-xs focus:outline-none focus:border-nexora-primary focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="priya@example.com"
                  className="w-full px-3.5 py-2.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-xs focus:outline-none focus:border-nexora-primary focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider mb-1.5">
                  Topic
                </label>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-xs focus:outline-none focus:border-nexora-primary focus:bg-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Creator Collaboration">Creator / Influencer Collaboration</option>
                  <option value="Style Recommendation">Style Recommendation</option>
                  <option value="Affiliate Partnership">Affiliate Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share details or your social channel handle..."
                  className="w-full px-3.5 py-2.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-xs focus:outline-none focus:border-nexora-primary focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-nexora-primary hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
