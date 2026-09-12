# Draft is created when prepare is submitted

A Signing in Draft is created on prepare submit (“Nästa”), not when a PDF is only picked for preview. That one `createSigning` call includes Document bytes, Document name, optional Message, and Signers. Create-on-pick or Document-only create were rejected so Signers are never a second write after a half-formed Draft.
