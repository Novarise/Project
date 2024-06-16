import { Input } from "@/components/ui/input";

export function Search({
  products,
  onChange,
}: {
  products: any;
  onChange: any;
}) {
  return (
    <div>
      <Input type="search" placeholder="Search..." onChange={onChange} />
    </div>
  );
}
