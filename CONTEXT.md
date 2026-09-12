# The Signing Office

Core language for user-facing concepts in The Signing Office product.

**Story**: A preparer chooses a Document, enters Document name, optional Message, and Signers, then submits prepare. That creates a Signing in Draft that owns the Document and those Signers.

## Language

**Theme**:
The visual color mode used by the interface, either light or dark.
_Avoid_: Appearance mode, color scheme

**Theme preference**:
The user's stored choice for how Theme is decided: system, light, or dark. System follows the OS; light and dark lock the Theme. Reused on later visits.
_Avoid_: Theme setting, mode preference; do not call system a Theme

**Document**:
The file being signed. It exists only as part of a Signing, not as a standalone library item.
_Avoid_: File, PDF, attachment

**Document name**:
The human-facing name of the Document.
_Avoid_: Document title, filename, title

**Signing**:
A case of collecting signatures on one Document. It exists from the moment the Document is submitted — when the preparer confirms the Document together with its Signers (prepare complete), not merely when a file is picked for preview — including before anyone has been asked to sign.
_Avoid_: Upload, job, session, signing request

**Draft**:
The status of a Signing that exists but has not yet been sent to anyone to sign.
_Avoid_: Draft Signing, pending, unpublished

**Field**:
A place on the Document where someone is asked to sign or enter information.
_Avoid_: Annotation, widget, form control

**Message**:
Optional text included when the Signing is sent to the Signers.
_Avoid_: Note, comment, email body

**Signer**:
A person asked to sign the Document in a Signing.
_Avoid_: Recipient, participant, invitee

**Tax identification number**:
The Signer's national tax ID used to identify them for signing (for example a Swedish personnummer). Swedish UI label: Personnummer.
_Avoid_: SSN, personal number, ID number
