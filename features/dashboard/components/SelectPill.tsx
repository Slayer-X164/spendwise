import SelectListbox, { type SelectListboxProps } from "@/features/ui/components/SelectListbox";

export default function SelectPill<Value extends string | number>(
  props: SelectListboxProps<Value>,
) {
  return (
    <SelectListbox
      {...props}
      buttonClassName="rounded-xl border border-neutral-200 bg-white/80 py-1.5 pr-2.5 pl-3 font-medium hover:bg-neutral-100"
    />
  );
}
