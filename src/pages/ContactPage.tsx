import { useState, type FormEvent } from 'react';
import { CheckCircle2, Clock, MapPin, MessageCircle, Phone } from 'lucide-react';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please enter your name, email address, and message.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        received?: boolean;
        referenceId?: string;
        error?: string;
      };
      if (response.ok && data.received) {
        setReferenceId(data.referenceId || 'BD-INQ');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setError(data.error || 'Could not submit your message. Please try again.');
      }
    } catch {
      setError('Network error submitting inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-ivory-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
            Get In Touch
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-brown-900">
            Contact Bharath Delights
          </h1>
          <p className="mt-2 text-base text-brown-700 leading-relaxed">
            Reach out for catering inquiries, family meal pre-orders, or dining questions. Replace
            the contact placeholders below with your actual restaurant branch details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Info Cards + Map Placeholder */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-cream-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="font-serif text-2xl font-bold text-brown-900 pb-3 border-b border-cream-200">
                Bharath Delights
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-maroon-800 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-brown-900">Restaurant Address</p>
                    <p className="text-brown-700">
                      [Restaurant Street Address Placeholder, City, Tamil Nadu - PIN Code]
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-maroon-800 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-brown-900">Phone Number</p>
                    <p className="text-brown-700">[Restaurant Phone Number Placeholder]</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-maroon-800 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-brown-900">WhatsApp Contact</p>
                    <p className="text-brown-700">[Restaurant WhatsApp Number Placeholder]</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-maroon-800 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-brown-900">Opening Hours</p>
                    <p className="text-brown-700">Monday – Sunday: 7:00 AM – 10:30 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Location Placeholder */}
            <div className="bg-cream-100 border border-cream-200 rounded-2xl p-8 text-center space-y-2">
              <MapPin className="w-8 h-8 text-maroon-800 mx-auto" aria-hidden="true" />
              <h3 className="font-serif text-lg font-bold text-brown-900">
                Google Maps Location Placeholder
              </h3>
              <p className="text-xs text-brown-700 max-w-xs mx-auto leading-relaxed">
                Embed your verified Google Maps pin here once your official Bharath Delights street
                address is finalized.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-cream-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-brown-900 pb-3 border-b border-cream-200">
              Send Us a Message
            </h2>

            {referenceId && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-sm text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Message Received ({referenceId})</p>
                  <p className="text-xs mt-0.5">
                    Thank you for contacting Bharath Delights. We will get back to you shortly.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-semibold text-brown-900 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-semibold text-brown-900 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-semibold text-brown-900 mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 font-mono focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
              </div>

              <div>
                <label htmlFor="contactMessage" className="block text-sm font-semibold text-brown-900 mb-1.5">
                  Message *
                </label>
                <textarea
                  id="contactMessage"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
              </div>

              {error && <p className="text-xs font-medium text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 disabled:opacity-60 rounded-lg transition-colors min-h-[44px]"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
