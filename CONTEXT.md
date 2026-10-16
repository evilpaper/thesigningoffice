# The Signing Office

Core language for user-facing concepts in The Signing Office product.

**Story**: A preparer chooses a Document for preview, enters Document name, optional Message, and Signers, then submits prepare. That creates a Signing that owns the Document and those Signers, and asks the Signers to sign.

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

**Preview**:
The preparer's view of a chosen Document before prepare is submitted. No Signing exists yet.
_Avoid_: Draft, unsaved Signing

**Signing**:
A case of collecting signatures on one Document. It exists from the moment prepare is submitted — when the preparer confirms the Document together with its Signers — and that same moment asks those Signers to sign. Picking a file for Preview alone does not create a Signing.
_Avoid_: Upload, job, session, signing request, Draft

**Field**:
A place on the Document where someone is asked to sign or enter information.
_Avoid_: Annotation, widget, form control

**Message**:
Optional text included when the Signers are asked to sign.
_Avoid_: Note, comment, email body

**Signer**:
A person asked to sign the Document in a Signing.
_Avoid_: Recipient, participant, invitee

**Tax identification number**:
The Signer's national tax ID used to identify them for signing (for example a Swedish personnummer). Swedish UI label: Personnummer.
_Avoid_: SSN, personal number, ID number, tin, taxId
