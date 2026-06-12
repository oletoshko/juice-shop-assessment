# Test Plan: Striive-4xxx – Add Cover Letter to Profile Page

## Scope

Add a new **Cover Letter** section in the **Edit Profile** page, allowing users to either:

1. Upload a cover letter file: **PDF, DOCX, or HTML**, max **5 MB**
2. Enter a cover letter as free text

The saved cover letter should be displayed:

* As a file when uploaded as a file
* As non-editable text when saved as text

The cover letter may later be used during job application, depending on application rules.

---

# Functional Testing

## 1. Cover Letter Section

| Test Case                                                                                                     | Expected Result                                        |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Open **My Resume & Skills** page                                                                              | Cover Letter section is visible                        |
| Check main component visibility                                                                               | Cover letter component is displayed correctly                 |
| User has no cover letter saved                                                                                | Empty/default state is displayed                       |
| User already has uploaded file                                                                                | Uploaded file title is displayed and can be downloaded |
| User already has text cover letter                                                                            | Text is displayed as non-editable content              |
| Verify file storage permissions                                                                               | Only owner/authorized user can access file             |

### Open Question

* The design of the My resume & skills view page shows a language indicator, but there does not seem to be a way to select language while uploading a letter.

---

## 2. File Upload – Positive Tests

| Test Case                                                               | Expected Result                                                                               |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Upload valid PDF files at boundary values: >0 KB, 2.5 MB, exactly 5 MB  | File is accepted and can be saved                                                             |
| Upload valid DOCX files at boundary values: >0 KB, 2.5 MB, exactly 5 MB | File is accepted and can be saved                                                             |
| Upload valid HTML files at boundary values: >0 KB, 2.5 MB, exactly 5 MB | File is accepted and can be saved                                                             |
| Save uploaded file and reload the page                                  | File remains visible after page refresh                                                           |
| Replace existing uploaded file with another valid file                  | New file replaces old file                                                              |
| Upload file, log out, then log in again                                 | Saved file is still displayed                                                         |
| Save section without uploading any file                                 | No validation error; other sections on My Resume & Skills page are saved (to clarify during design phase if cover letter is mandatory)                 |
| Upload a file and click "Cancel Editing" button                         | Uploaded file is discarded and is not saved                                                                     |

### Open Questions

* File deletion – clarify during refinement whether users can delete uploaded files.
* .doc format for word 97 - 2003. Ask if this format should be supported.
* Should the user see a confirmation dialog when clicking Cancel Editing with unsaved changes? (e.g., "You have unsaved changes. Are you sure you want to leave?")
---

## 3. File Upload – Negative Tests

| Test Case                                            | Expected Result                                    |
| ---------------------------------------------------- | -------------------------------------------------- |
| Upload unsupported file type (PNG, TXT, EXE)         | File is rejected with clear error message          |
| Upload file larger than 5 MB                         | File is rejected with clear size validation error  |
| Upload empty/corrupted file                          | File is rejected and clear error is shown          |
| Upload file without clicking Save                    | File should not be persisted                       |
| Upload file with long file name or special characters| Validation rules to be clarified during refinement |

### Open Questions

* What is the expected behavior if a user navigates away from the page without clicking Save?
* Is there a limit on the file name length? Are special characters allowed in file names?
---

## 4. Free Text Cover Letter – Positive Tests

| Test Case                                       | Expected Result                                |
| ----------------------------------------------- | ---------------------------------------------- |
| Enter valid cover letter text ≤ 3000 characters | Text can be saved, no validation message shown |
| Save text cover letter                          | Text is displayed as non-editable text on My Resume & Skills page        |
| Refresh page after saving text                  | Text remains visible (if saving of draft text is supported)                          |
| Edit existing text cover letter                 | Updated text is saved and displayed            |
| Use multiline text                              | Line breaks are preserved                      |
| Use special characters/emojis                   | Text is saved and displayed correctly          |
| Enter cover letter text, click "Cancel Editing" | Entered text is not saved                      |
| Apply each type of text mark-up (bold, italic, etc) | Entered text is saved including mark-up and styled on display                     |

---

## 5. Free Text Cover Letter – Negative Tests

| Test Case                                                         | Expected Result                                                                          |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Save empty text                                                   | Either allowed as "no cover letter" or validation shown (to clarify during design phase) |
| Enter text longer than 3000 characters                            | Validation is shown or input is cut off                                                  |
| Enter malicious XSS input such as `<script>alert('XSS')</script>` | Script is not executed; content is sanitized                                             |
| Enter only spaces/new lines                                       | Treated as empty or validation shown                                                     |

---

## 6. Switching Between File and Text

### Open Question

Clarify during refinement whether it is possible to save both a file and text.

If only one option is allowed:

| Test Case                      | Expected Result                                          |
| ------------------------------ | -------------------------------------------------------- |
| Save file, then switch to text | Text replaces file or confirmation is required           |
| Save text, then upload file    | File replaces text or confirmation is required           |
| Try to save both file and text | Application enforces only one active cover letter option |

---

# Non-Functional Testing

## 1. Performance

| Test Case                                  | Expected Result                          |
| ------------------------------------------ | ---------------------------------------- |
| Upload file close to 5 MB                  | Upload completes within acceptable time  |
| Save text cover letter                     | Save action completes quickly            |
| Load profile with saved file/text          | Page loads without noticeable delay      |
| Multiple users upload files simultaneously | System remains stable                    |
| Upload file/save text with slow connection | File uploads and text saves successfully |

### Open Question
* To define: what are acceptable times?

---

## 2. Security

| Test Case                                                 | Expected Result                                  |
| --------------------------------------------------------- | ------------------------------------------------ |
| Upload malicious file disguised as PDF/DOCX/HTML          | File is rejected                                 |
| Enter script in text field                                | All script tags are stripped                     |
| Upload HTML containing script                             | All script tags are stripped                     |
| User tries to access another user's cover letter file URL | Access is denied                                 |

---

## 3. Usability

| Test Case                                   | Expected Result                             |
| ------------------------------------------- | ------------------------------------------- |
| Validation errors are shown                 | Messages are clear and helpful              |
| File type and size restrictions are visible | User understands allowed formats            |
| Save success message is shown               | User knows cover letter was saved           |
| Remove/replace action is clear              | User understands how to update cover letter |

---

## 4. Compatibility

| Test Case                               | Expected Result             |
| --------------------------------------- | --------------------------- |
| Test in all supported browsers          | Feature works correctly     |
| Test on mobile/tablet layout            | UI works correctly          |
| Upload from different operating systems | File upload works correctly |

---

## 5. Accessibility

| Test Case                                          | Expected Result                         |
| -------------------------------------------------- | --------------------------------------- |
| Navigate section using keyboard only               | All controls are reachable              |
| Screen reader reads upload/text controls correctly | Labels and errors are accessible        |
| Error messages are announced                       | User can understand validation failures |

---

# Suggested Automation Strategy

Apply the testing pyramid: most tests should be Unit Tests, followed by API Tests, while E2E tests should cover only the most critical user journeys.

Functional tests can and should be automated, the non-functional tests (e.g. usability) will require manual testing.

## Regression Testing

Run regression tests to ensure existing functionality continues to work correctly after introducing the new section.

---

# Collaboration Approach

I would collaborate closely with the PO, BA, Designer, and developers throughout the sprint. During the initial refinement and design discussions, I would review requirements, ask questions, and identify risks or gaps early.

During development, I would provide feedback, clarify expected behavior, and discuss test scenarios with developers when needed.

I would apply **risk-based testing**, prioritizing the areas with the highest business impact and likelihood of failure.

Throughout the sprint, I would communicate testing progress, raise issues early, and ensure the feature meets both business requirements and quality standards while staying on track for delivery.
