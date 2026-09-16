"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  INVALID_SWEDISH_TAX_IDENTIFICATION_NUMBER,
  MAX_SIGNERS,
  type TaxIdentificationNumberErrorCode,
} from "./prepare-values";

type SignerRow = {
  id: string;
};

type SignerListProps = {
  taxIdentificationNumberErrors?: Readonly<
    Record<number, TaxIdentificationNumberErrorCode>
  >;
  onTaxIdentificationNumberChange?: (signerIndex: number) => void;
};

const taxIdentificationNumberMessages: Record<
  TaxIdentificationNumberErrorCode,
  string
> = {
  [INVALID_SWEDISH_TAX_IDENTIFICATION_NUMBER]:
    "Ange ett giltigt svenskt personnummer eller samordningsnummer.",
};

function createRow(): SignerRow {
  return { id: crypto.randomUUID() };
}

export default function SignerList({
  taxIdentificationNumberErrors = {},
  onTaxIdentificationNumberChange,
}: SignerListProps) {
  const listId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [rows, setRows] = useState<SignerRow[]>(() => [createRow()]);
  const focusedErrorKeyRef = useRef<string | null>(null);

  const canAdd = rows.length < MAX_SIGNERS;
  const canRemove = rows.length > 1;

  const errorFocusKey = Object.keys(taxIdentificationNumberErrors)
    .map(Number)
    .sort((a, b) => a - b)
    .join(",");

  useEffect(() => {
    if (!errorFocusKey) {
      focusedErrorKeyRef.current = null;
      return;
    }

    if (focusedErrorKeyRef.current === errorFocusKey) {
      return;
    }

    focusedErrorKeyRef.current = errorFocusKey;
    const firstIndex = Number(errorFocusKey.split(",")[0]);
    const input = sectionRef.current?.querySelector<HTMLInputElement>(
      `input[name="signers.${firstIndex}.taxIdentificationNumber"]`,
    );
    input?.focus();
  }, [errorFocusKey]);

  return (
    <section
      ref={sectionRef}
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
      </div>

      <ul className="flex flex-col gap-4">
        {rows.map((row, index) => {
          const nameId = `${listId}-${row.id}-name`;
          const taxIdentificationNumberId = `${listId}-${row.id}-taxIdentificationNumber`;
          const taxIdentificationNumberHintId = `${taxIdentificationNumberId}-hint`;
          const taxIdentificationNumberErrorId = `${taxIdentificationNumberId}-error`;
          const emailId = `${listId}-${row.id}-email`;
          const heading = `Undertecknare ${index + 1}`;
          const taxIdentificationNumberErrorCode =
            taxIdentificationNumberErrors[index];
          const taxIdentificationNumberError = taxIdentificationNumberErrorCode
            ? taxIdentificationNumberMessages[taxIdentificationNumberErrorCode]
            : undefined;
          const describedBy = taxIdentificationNumberError
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
                    setRows((current) =>
                      current.length <= 1
                        ? current
                        : current.filter((item) => item.id !== row.id),
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
                />
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
                  aria-describedby={describedBy}
                  placeholder="ÅÅÅÅMMDD-NNNN"
                  className={
                    taxIdentificationNumberError
                      ? "border-destructive focus-visible:ring-destructive"
                      : undefined
                  }
                  onChange={() => {
                    onTaxIdentificationNumberChange?.(index);
                  }}
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
                />
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
          setRows((current) =>
            current.length >= MAX_SIGNERS ? current : [...current, createRow()],
          );
        }}
      >
        Lägg till undertecknare
      </Button>
    </section>
  );
}
