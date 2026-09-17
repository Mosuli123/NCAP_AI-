import type { AdviceContact, CareerEvent } from '@/types';

/**
 * Khetha Career Development Services advice directory and contact channels,
 * aligned to NCAP's "Careers Advice" area. The national call centre number is
 * the public Khetha helpline.
 */
export const adviceContacts: AdviceContact[] = [
  {
    id: 'adv-callcentre',
    name: 'Khetha National Career Advice Helpline',
    role: 'Toll-free career advice call centre',
    phone: '0860 111 673',
    email: 'careerhelp@dhet.gov.za',
    whatsapp: '+27 86 010 3673',
    channel: 'Call Centre',
  },
  {
    id: 'adv-online',
    name: 'NCAP Online Self-Help Portal',
    role: 'Career tools, directories and resources',
    email: 'careerhelp@dhet.gov.za',
    channel: 'Online',
  },
  {
    id: 'adv-prac-gp',
    name: 'Gauteng Career Practitioner Desk',
    role: 'One-on-one career counselling',
    province: 'Gauteng',
    phone: '+27 12 312 5911',
    email: 'gauteng.career@dhet.gov.za',
    channel: 'Practitioner',
  },
  {
    id: 'adv-prac-kzn',
    name: 'KwaZulu-Natal Career Practitioner Desk',
    role: 'One-on-one career counselling',
    province: 'KwaZulu-Natal',
    phone: '+27 31 350 4400',
    email: 'kzn.career@dhet.gov.za',
    channel: 'Practitioner',
  },
  {
    id: 'adv-walkin-ec',
    name: 'Eastern Cape Walk-in Career Centre',
    role: 'Drop-in career guidance',
    province: 'Eastern Cape',
    phone: '+27 43 604 4000',
    channel: 'Walk-in Centre',
  },
];

export const careerEvents: CareerEvent[] = [
  {
    id: 'evt-careerexpo-2026',
    title: 'National Career Guidance Expo',
    date: '2026-05-15',
    location: 'Nasrec Expo Centre, Johannesburg',
    province: 'Gauteng',
    description:
      'Meet universities, TVET colleges, SETAs and employers under one roof. Free entry with career practitioners on site.',
    virtual: false,
  },
  {
    id: 'evt-tvet-open-day',
    title: 'TVET College Open Day (Virtual)',
    date: '2026-04-10',
    location: 'Online — join from any device',
    province: 'Limpopo',
    description: 'Explore TVET programmes, bursaries and application steps in a low-data virtual session.',
    virtual: true,
  },
  {
    id: 'evt-jobfit-webinar',
    title: 'Understanding Your Job Fit Results',
    date: '2026-06-02',
    location: 'Online webinar',
    province: 'Western Cape',
    description: 'A Khetha practitioner explains how to turn your Job Fit results into a study and career plan.',
    virtual: true,
  },
];
