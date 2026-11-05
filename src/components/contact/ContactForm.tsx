import { type FormEvent, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CONTACT } from '../../data/contact';
import { sendRequest } from './sendRequest';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Field = 'name' | 'email' | 'message';

interface ContactFormProps {
  /** Plays the "request transmitted" animation from the button; resolves when done. */
  onTransmit: (from: HTMLElement) => Promise<void>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'h-12 w-full rounded-[10px] border border-white/[0.12] bg-white/[0.02] px-4 text-[15px] text-ink-primary placeholder:text-ink-tertiary transition-[border-color,box-shadow] duration-200 focus:border-signal focus:shadow-[0_0_0_3px_rgb(156_201_255/0.25)] focus-visible:outline-none aria-[invalid=true]:border-ember';

/**
 * Glass contact form (spec §21). Real labels, 48 px inputs, single-select
 * project-type pills (aria-pressed) in a fieldset, inline validation.
 * States: sending → (transmit animation) → `200 OK · message delivered`;
 * on error the header says so in ember and the form keeps its values.
 */
const ContactForm = ({ onTransmit }: ContactFormProps) => {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [projectType, setProjectType] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const submit = useRef<HTMLButtonElement>(null);
  const fields = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>>({});

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = 'Please enter your name.';
    if (!EMAIL_PATTERN.test(values.email.trim())) next.email = 'Please enter a valid email address.';
    if (!values.message.trim()) next.message = 'Please add a short message.';
    return next;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    const found = validate();
    setErrors(found);
    const firstInvalid = (['name', 'email', 'message'] as const).find((f) => found[f]);
    if (firstInvalid) {
      fields.current[firstInvalid]?.focus();
      return;
    }

    setStatus('sending');
    try {
      await sendRequest({ ...values, projectType });
      if (submit.current) await onTransmit(submit.current);
      setStatus('success');
    } catch (error) {
      if (import.meta.env.DEV) console.warn('[contact] send failed:', error);
      setStatus('error');
    }
  };

  const update = (field: Field) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const header =
    status === 'success' ? (
      <span className="text-signal">{CONTACT.success.header}</span>
    ) : status === 'error' ? (
      <span className="text-ember">{CONTACT.error.header}</span>
    ) : (
      <>
        <span>{CONTACT.formHeader.left}</span>
        <span>{CONTACT.formHeader.right}</span>
      </>
    );

  return (
    <div className="relative rounded-[20px] border border-white/[0.09] bg-glass p-5 shadow-[0_30px_80px_rgb(0_0_0/0.45)] backdrop-blur-[14px] md:p-8">
      <p
        role="status"
        aria-live="polite"
        className="mb-6 flex justify-between gap-4 border-b border-white/[0.08] pb-4 font-mono text-[12px] text-ink-tertiary"
      >
        {header}
      </p>

      {status === 'success' ? (
        <p className="py-10 text-[18px] text-ink-primary">{CONTACT.success.line}</p>
      ) : (
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {(['name', 'email'] as const).map((field) => (
              <div key={field} className="flex flex-col gap-2">
                <label htmlFor={`contact-${field}`} className="text-[14px] font-medium text-ink-primary">
                  {field === 'name' ? 'Name' : 'Email'}
                </label>
                <input
                  ref={(el) => {
                    fields.current[field] = el;
                  }}
                  id={`contact-${field}`}
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  autoComplete={field === 'email' ? 'email' : 'name'}
                  value={values[field]}
                  onChange={update(field)}
                  aria-invalid={errors[field] ? true : undefined}
                  aria-describedby={errors[field] ? `contact-${field}-error` : undefined}
                  className={inputClass}
                />
                {errors[field] && (
                  <p id={`contact-${field}-error`} className="text-[13px] text-ember">
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-[14px] font-medium text-ink-primary">{CONTACT.projectTypesLegend}</legend>
            <div className="flex flex-wrap gap-2">
              {CONTACT.projectTypes.map((type) => {
                const selected = projectType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setProjectType(selected ? '' : type)}
                    className={`min-h-11 rounded-full border px-4 text-[14px] transition-colors duration-200 ${
                      selected
                        ? 'border-ink-primary bg-ink-primary text-void'
                        : 'border-white/[0.12] text-ink-secondary hover:border-white/[0.24] hover:text-ink-primary'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor="contact-message" className="text-[14px] font-medium text-ink-primary">
              Message
            </label>
            <textarea
              ref={(el) => {
                fields.current.message = el;
              }}
              id="contact-message"
              name="message"
              rows={5}
              value={values.message}
              onChange={update('message')}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              className={`${inputClass} h-auto min-h-[132px] resize-y py-3`}
            />
            {errors.message && (
              <p id="contact-message-error" className="text-[13px] text-ember">
                {errors.message}
              </p>
            )}
          </div>

          <div className="mt-1 flex flex-col-reverse items-stretch gap-4 md:flex-row md:items-center md:justify-between">
            <span className="text-center font-mono text-[12px] text-ink-tertiary md:text-left">{CONTACT.repliesNote}</span>
            <button
              ref={submit}
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-ink-primary px-6 text-button text-void transition-colors hover:bg-white disabled:cursor-progress disabled:opacity-80 md:h-12"
            >
              {status === 'sending' ? CONTACT.sending : CONTACT.submit}
              {status !== 'sending' && <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
