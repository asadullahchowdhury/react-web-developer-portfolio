import emailjs from '@emailjs/browser';
import { EMAILJS } from '../../data/contact';

export interface ContactRequest {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

/**
 * Sends the contact request with EmailJS (same logic and keys as the previous
 * form). The project type is added to the payload; `subject` is kept for the
 * existing template and filled from the project type.
 *
 * Dev only: `?mockSend=ok` or `?mockSend=fail` simulates the result without
 * sending an email.
 */
export async function sendRequest(request: ContactRequest): Promise<void> {
  const mock = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('mockSend') : null;
  if (mock) {
    await new Promise((r) => setTimeout(r, 700));
    if (mock === 'fail') throw new Error('Mocked send failure');
    return;
  }

  await emailjs.send(
    EMAILJS.serviceId,
    EMAILJS.templateId,
    {
      name: request.name,
      email: request.email,
      subject: request.projectType ? `New request: ${request.projectType}` : 'New request',
      project_type: request.projectType || 'Not specified',
      message: request.message,
    },
    EMAILJS.publicKey,
  );
}
