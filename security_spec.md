# Gyansai Maths IIT Center — Firestore Security Specification

## 1. Data Invariants
1. **Public Catalog Integrity**: Public visitors may read `settings/site` and published records (`is_published == true`) from `courses`, `exams`, `results`, `lectures`, `faculty`, `testimonials`, `gallery_media`, and `blogs`. Unpublished drafts are strictly visible only to verified administrators.
2. **Admin Verification**: Administrator status requires `request.auth != null && request.auth.token.email_verified == true` AND either the bootstrapped owner email (`gyansaimathsiitcentertech@gmail.com`) or an existing document in `/admins/{uid}` with `role == 'admin'`.
3. **PII Isolation**: `enquiries` and `admissions` contain sensitive phone numbers, email addresses, and home addresses. Public users may ONLY `create` validated submissions with initial status (`new` / `pending`) and `createdAt == request.time`. Reads (`get`, `list`), updates, and deletes are strictly restricted to verified admins.
4. **Strict Key Allowlists & Size Bounds**: Every write validates exact required and allowed fields (`hasAll` / `hasOnly`), string length bounds, ID regex (`^[a-zA-Z0-9_-]+$`, `<= 128`), and server timestamps (`request.time`).
5. **Immutability**: `createdAt` and `reference_code` cannot be mutated after creation.

## 2. The Dirty Dozen Adversarial Payloads
1. **Shadow Field Injection on Enquiry**: Creating an enquiry with an extra `isAdmin: true` ghost field -> MUST FAIL (`hasOnly`).
2. **Email Spoofing Attack**: Request with `email: 'gyansaimathsiitcentertech@gmail.com'` and `email_verified: false` -> MUST FAIL (`email_verified == true`).
3. **PII Read Leak (Enquiry Get)**: Unauthenticated or non-admin authenticated user reading `/enquiries/{id}` -> MUST FAIL (`isAdmin()`).
4. **PII List Scraping (Admissions List)**: Non-admin user listing `/admissions` -> MUST FAIL (`isAdmin()`).
5. **Status Shortcutting on Admission Create**: Public visitor creating an admission with `status: 'confirmed'` instead of `'pending'` -> MUST FAIL.
6. **Client Timestamp Forgery**: Creating an admission with a backdated client timestamp instead of `request.time` -> MUST FAIL.
7. **ID Poisoning**: Writing to `/enquiries/..$bad_id_with_1500_chars` -> MUST FAIL (`isValidId`).
8. **Value Poisoning (1MB String)**: Creating an enquiry with a 50KB `message` field -> MUST FAIL (`.size() <= 1000`).
9. **Unauthorized Course Mutation**: Non-admin authenticated user updating `/courses/iit-jee-integrated` -> MUST FAIL (`isAdmin()`).
10. **Draft Leakage**: Public visitor listing `/courses` without filtering `is_published == true` or reading an unpublished course -> MUST FAIL (`resource.data.is_published == true`).
11. **Self-Assigned Admin Escalation**: Regular user creating `/admins/{ownUid}` with `role: 'admin'` -> MUST FAIL (`isAdmin()`).
12. **Immutable Field Tampering**: Admin or user attempting to alter `reference_code` or `createdAt` on an existing admission -> MUST FAIL (`incoming().reference_code == existing().reference_code && incoming().createdAt == existing().createdAt`).
