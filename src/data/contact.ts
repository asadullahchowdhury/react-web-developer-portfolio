/** Contact section copy and options (spec §21). */

export const CONTACT = {
  hud: 'Contact',
  title: { lead: "Let's build", trail: 'the next one.' },
  lead: "Have a product to build or a platform that needs a steady hand? Tell me what you're working on.",
  formHeader: { left: 'POST /contact', right: 'new_request' },
  projectTypesLegend: 'What are you building?',
  projectTypes: ['SaaS product', 'Dashboard / admin', 'Business platform', 'Website', 'Something else'],
  repliesNote: 'Replies by email',
  submit: 'Send request',
  sending: 'Sending…',
  success: { header: '200 OK · message delivered', line: 'Message sent successfully.' },
  error: { header: "Couldn't send — try email instead" },
} as const;

/** EmailJS — same service, template and public key as the previous Contact form. */
export const EMAILJS = {
  serviceId: 'service_zui7pgm',
  templateId: 'template_ah2bhde',
  publicKey: 'H7g6CDvV_PhcE5Yzk',
} as const;
