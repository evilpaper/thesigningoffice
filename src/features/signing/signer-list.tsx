"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_SIGNERS } from "./prepare-values";

type SignerRow = {
  id: string;
};

function createRow(): SignerRow {
  return { id: crypto.randomUUID() };
}

export default function SignerList() {
  const listId = useId();
  const [rows, setRows] = useState<SignerRow[]>(() => [createRow()]);

  const canAdd = rows.length < MAX_SIGNERS;
  const canRemove = rows.length > 1;

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
      </div>

      <ul className="flex flex-col gap-4">
        {rows.map((row, index) => {
          const nameId = `${listId}-${row.id}-name`;
          const taxId = `${listId}-${row.id}-tax`;
          const emailId = `${listId}-${row.id}-email`;
          const heading = `Undertecknare ${index + 1}`;

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
                <Label htmlFor={taxId}>Personnummer</Label>
                <Input
                  id={taxId}
                  name={`signers.${index}.taxIdentificationNumber`}
                  required
                  autoComplete="off"
                  inputMode="numeric"
                />
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
