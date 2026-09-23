"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_SIGNERS, type PrepareFieldError } from "./prepare-values";

type SignerRow = {
  id: string;
};

type SignerListProps = {
  fieldErrors?: readonly PrepareFieldError[];
  onDismissFieldError?: (path: string) => void;
};

type SignerField = "name" | "taxIdentificationNumber" | "email";

const SIGNER_FIELD_MESSAGES: Record<SignerField, string> = {
  name: "Ange ett namn.",
  taxIdentificationNumber:
    "Ange ett giltigt svenskt personnummer eller samordningsnummer.",
  email: "Ange en giltig e-postadress.",
};

const invalidFieldClassName =
  "border-destructive focus-visible:ring-destructive";

function createRow(): SignerRow {
  return { id: crypto.randomUUID() };
}

function signerFieldMessage(
  fieldErrors: readonly PrepareFieldError[],
  index: number,
  field: SignerField,
): string | undefined {
  const path = `signers.${index}.${field}`;
  return fieldErrors.some((error) => error.path === path)
    ? SIGNER_FIELD_MESSAGES[field]
    : undefined;
}

export default function SignerList({
  fieldErrors = [],
  onDismissFieldError,
}: SignerListProps) {
  const listId = useId();
  const [rows, setRows] = useState<SignerRow[]>(() => [createRow()]);

  const canAdd = rows.length < MAX_SIGNERS;
  const canRemove = rows.length > 1;
  const signersError = fieldErrors.some((error) => error.path === "signers")
    ? `Ange mellan 1 och ${MAX_SIGNERS} undertecknare.`
    : undefined;
  const signersErrorId = `${listId}-signers-error`;

  const changeRows = (next: SignerRow[]) => {
    setRows(next);
    onDismissFieldError?.("signers");
  };

  return (
    <section
      className="flex flex-col gap-4"
      aria-labelledby={`${listId}-heading`}
    >
      <div className="flex flex-col gap-1">
        <h2
          id={`${listId}-heading`}
          className="text-sm font-medium text-foreground"
        >
          Undertecknare
        </h2>
        <p className="text-sm text-muted-foreground">
          Lägg till dig själv om du också ska signera. Högst {MAX_SIGNERS}{" "}
          undertecknare.
        </p>
        {signersError ? (
          <p
            id={signersErrorId}
            data-prepare-field="signers"
            tabIndex={-1}
            role="alert"
            className="text-sm text-destructive"
          >
            {signersError}
          </p>
        ) : null}
      </div>

      <ul className="flex flex-col gap-4">
        {rows.map((row, index) => {
          const nameId = `${listId}-${row.id}-name`;
          const nameErrorId = `${nameId}-error`;
          const taxIdentificationNumberId = `${listId}-${row.id}-taxIdentificationNumber`;
          const taxIdentificationNumberHintId = `${taxIdentificationNumberId}-hint`;
          const taxIdentificationNumberErrorId = `${taxIdentificationNumberId}-error`;
          const emailId = `${listId}-${row.id}-email`;
          const emailErrorId = `${emailId}-error`;
          const heading = `Undertecknare ${index + 1}`;
          const nameError = signerFieldMessage(fieldErrors, index, "name");
          const taxIdentificationNumberError = signerFieldMessage(
            fieldErrors,
            index,
            "taxIdentificationNumber",
          );
          const emailError = signerFieldMessage(fieldErrors, index, "email");
          const taxIdentificationNumberDescribedBy =
            taxIdentificationNumberError
              ? `${taxIdentificationNumberHintId} ${taxIdentificationNumberErrorId}`
              : taxIdentificationNumberHintId;

          return (
            <li
              key={row.id}
              className="flex flex-col gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-foreground">
                  {heading}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!canRemove}
                  aria-label={`Ta bort ${heading}`}
                  onClick={() => {
                    changeRows(
                      rows.length <= 1
                        ? rows
                        : rows.filter((item) => item.id !== row.id),
                    );
                  }}
                >
                  Ta bort
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={nameId}>Namn</Label>
                <Input
                  id={nameId}
                  name={`signers.${index}.name`}
                  required
                  autoComplete="name"
                  aria-invalid={nameError ? true : undefined}
                  aria-describedby={nameError ? nameErrorId : undefined}
                  className={nameError ? invalidFieldClassName : undefined}
                  onChange={
                    nameError
                      ? () => onDismissFieldError?.(`signers.${index}.name`)
                      : undefined
                  }
                />
                {nameError ? (
                  <p
                    id={nameErrorId}
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {nameError}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={taxIdentificationNumberId}>Personnummer</Label>
                <Input
                  id={taxIdentificationNumberId}
                  name={`signers.${index}.taxIdentificationNumber`}
                  required
                  autoComplete="off"
                  inputMode="numeric"
                  spellCheck={false}
                  autoCorrect="off"
                  aria-invalid={taxIdentificationNumberError ? true : undefined}
                  aria-describedby={taxIdentificationNumberDescribedBy}
                  placeholder="ÅÅÅÅMMDD-NNNN"
                  className={
                    taxIdentificationNumberError
                      ? invalidFieldClassName
                      : undefined
                  }
                  onChange={
                    taxIdentificationNumberError
                      ? () =>
                          onDismissFieldError?.(
                            `signers.${index}.taxIdentificationNumber`,
                          )
                      : undefined
                  }
                />
                <p
                  id={taxIdentificationNumberHintId}
                  className="text-sm text-muted-foreground"
                >
                  Svenskt personnummer eller samordningsnummer.
                </p>
                {taxIdentificationNumberError ? (
                  <p
                    id={taxIdentificationNumberErrorId}
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {taxIdentificationNumberError}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={emailId}>E-post</Label>
                <Input
                  id={emailId}
                  name={`signers.${index}.email`}
                  type="email"
                  required
                  autoComplete="email"
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? emailErrorId : undefined}
                  className={emailError ? invalidFieldClassName : undefined}
                  onChange={
                    emailError
                      ? () => onDismissFieldError?.(`signers.${index}.email`)
                      : undefined
                  }
                />
                {emailError ? (
                  <p
                    id={emailErrorId}
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {emailError}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={!canAdd}
        onClick={() => {
          changeRows(
            rows.length >= MAX_SIGNERS ? rows : [...rows, createRow()],
          );
        }}
      >
        Lägg till undertecknare
      </Button>
    </section>
  );
}
