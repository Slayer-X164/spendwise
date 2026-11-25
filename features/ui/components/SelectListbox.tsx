"use client";

import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export type SelectListboxProps<Value extends string | number> = {
  label: string;
  options: readonly { label: string; value: Value }[];
  value?: Value;
  defaultValue?: Value;
  onChange?: (value: Value) => void;
  name?: string;
  invalid?: boolean;
  buttonClassName?: string;
  labelClassName?: string;
  inlineOptions?: boolean;
};

export default function SelectListbox<Value extends string | number>({
  label,
  options,
  value,
  defaultValue,
  onChange,
  name,
  invalid,
  buttonClassName = "w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2",
  labelClassName = "sr-only",
  inlineOptions = false,
}: SelectListboxProps<Value>) {
  return (
    <Field className="min-w-0">
      <Label className={labelClassName}>{label}</Label>
      <Listbox name={name} value={value} defaultValue={defaultValue} onChange={onChange} invalid={invalid}>
        <ListboxButton
          type="button"
          aria-invalid={invalid || undefined}
          className={`flex cursor-pointer items-center justify-between gap-2 text-left whitespace-nowrap outline-offset-2 data-focus:outline-2 data-focus:outline-blue-600 data-invalid:border-red-500 ${buttonClassName}`}
        >
          {({ value: selectedValue }) => (
            <>
              <span>{options.find(({ value }) => value === selectedValue)?.label ?? `Select ${label.toLowerCase()}`}</span>
              <HugeiconsIcon icon={ArrowDown01Icon} className="size-3.5 shrink-0 text-slate-500" aria-hidden="true" />
            </>
          )}
        </ListboxButton>
        <ListboxOptions
          anchor={inlineOptions ? undefined : { to: "bottom start", gap: 4, padding: 12 }}
          modal={false}
          transition
          className={`z-40 max-h-48 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1 text-sm text-neutral-900 shadow-lg outline-none transition duration-100 data-leave:data-closed:opacity-0
            ${inlineOptions ? "mt-1 w-full" : "w-max min-w-(--button-width) max-w-[calc(100vw-1.5rem)]"}`}
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="group flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 select-none data-focus:bg-blue-50 data-selected:font-medium"
            >
              <HugeiconsIcon icon={Tick02Icon} className="invisible size-4 shrink-0 text-blue-600 group-data-selected:visible" aria-hidden="true" />
              <span>{option.label}</span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  );
}
