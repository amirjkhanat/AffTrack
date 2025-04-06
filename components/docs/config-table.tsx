import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ConfigTableProps {
  items: {
    key: string;
    value: string;
    description: string;
  }[];
}

export function ConfigTable({ items }: ConfigTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Key</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.key}>
            <TableCell className="font-mono">{item.key}</TableCell>
            <TableCell className="font-mono text-muted-foreground">{item.value}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}