/**
 * Security Rules Verification Specification for Gyansai Maths IIT Center
 * Verifies all 12 adversarial payloads from security_spec.md return PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expected: 'ALLOW' | 'PERMISSION_DENIED';
}

export const dirtyDozenCases: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on Enquiry',
    collection: 'enquiries',
    operation: 'create',
    auth: null,
    payload: { student_name: 'Aarav', phone: '9970603939', status: 'new', isAdmin: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Email Spoofing Attack (unverified admin email)',
    collection: 'courses',
    operation: 'create',
    auth: { uid: 'spoof-1', email: 'gyansaimathsiitcentertech@gmail.com', email_verified: false },
    payload: { slug: 'fake', name: 'Fake', category: 'IIT-JEE', admission_status: 'open', is_published: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'PII Read Leak on Enquiries',
    collection: 'enquiries',
    operation: 'get',
    auth: { uid: 'student-1', email: 'student@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'PII List Scraping on Admissions',
    collection: 'admissions',
    operation: 'list',
    auth: { uid: 'student-1', email: 'student@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Status Shortcutting on Admission Create',
    collection: 'admissions',
    operation: 'create',
    auth: null,
    payload: {
      reference_code: 'GSM-AB12CD',
      student_name: 'Rohan Kulkarni',
      parent_name: 'Sanjay Kulkarni',
      phone: '9822012345',
      class_level: 'Class 11 (Science)',
      status: 'confirmed',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Client Timestamp Forgery on Enquiry',
    collection: 'enquiries',
    operation: 'create',
    auth: null,
    payload: {
      student_name: 'Rohan',
      phone: '9822012345',
      status: 'new',
      createdAt: '2020-01-01T00:00:00Z',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'ID Poisoning with Oversized Document ID',
    collection: 'enquiries',
    operation: 'create',
    auth: null,
    payload: { id: 'a'.repeat(300) },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Value Poisoning with Oversized Message',
    collection: 'enquiries',
    operation: 'create',
    auth: null,
    payload: {
      student_name: 'Rohan',
      phone: '9822012345',
      message: 'x'.repeat(2000),
      status: 'new',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Unauthorized Course Update by Non-Admin',
    collection: 'courses',
    operation: 'update',
    auth: { uid: 'user-2', email: 'visitor@example.com', email_verified: true },
    payload: { name: 'Hacked Course' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Draft Course Read Leakage',
    collection: 'courses',
    operation: 'get',
    auth: null,
    payload: { is_published: false },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Self-Assigned Admin Escalation',
    collection: 'admins',
    operation: 'create',
    auth: { uid: 'attacker', email: 'attacker@example.com', email_verified: true },
    payload: { email: 'attacker@example.com', role: 'admin' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Immutable Reference Code Tampering',
    collection: 'admissions',
    operation: 'update',
    auth: { uid: 'admin-1', email: 'gyansaimathsiitcentertech@gmail.com', email_verified: true },
    payload: { reference_code: 'GSM-TAMPER' },
    expected: 'PERMISSION_DENIED',
  },
];
