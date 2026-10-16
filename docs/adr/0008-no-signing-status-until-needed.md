# No Signing status until we need one

A Signing has no status column. Persist-on-prepare-submit is also the moment Signers are asked; there is no “unsent” intermediate. A placeholder Draft status (and `signing_status` enum) was removed so the schema does not invent a lifecycle the product does not use yet. Add a status only when a real second state exists in the glossary.
