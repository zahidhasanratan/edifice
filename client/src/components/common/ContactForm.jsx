import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus({ success: true, message: 'Message sent successfully!' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white dark:bg-black max-w-4xl mx-auto py-16 px-6 transition-colors duration-300">
      <h2 className="text-center text-2xl font-semibold text-[#c20e35] mb-10 tracking-wide uppercase">
        Stay In Touch
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full bg-transparent border-b border-gray-500 dark:border-gray-200 focus:outline-none py-3 px-1 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-200 focus:border-[#c20e35] transition-colors duration-300"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email Address"
              className="w-full bg-transparent border-b border-gray-500 dark:border-gray-200 focus:outline-none py-3 px-1 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-200 focus:border-[#c20e35] transition-colors duration-300"
              required
            />
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your Phone"
              className="w-full bg-transparent border-b border-gray-500 dark:border-gray-200 focus:outline-none py-3 px-1 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-200 focus:border-[#c20e35] transition-colors duration-300"
            />
          </div>

          <div>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full bg-transparent border-b border-gray-500 dark:border-gray-200 focus:outline-none py-3 px-1 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-200 focus:border-[#c20e35] transition-colors duration-300"
              required
            />
          </div>
        </div>

        <div>
          <textarea
            rows="5"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            className="w-full bg-transparent border-b border-gray-500 dark:border-gray-200 focus:outline-none py-3 px-1 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-200 focus:border-[#c20e35] transition-colors duration-300 resize-none"
            required
          ></textarea>
        </div>

        <div className="text-center">
          {submitStatus && (
            <p className={`mb-4 ${submitStatus.success ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              {submitStatus.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#c20e35] text-white px-8 py-3 rounded transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a00d2c] hover:shadow-lg'}`}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactForm;