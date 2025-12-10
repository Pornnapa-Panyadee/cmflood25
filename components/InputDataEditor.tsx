import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit3 } from 'lucide-react';

interface InputDataEditorProps {
  columns: string[];
  data: Record<string, number>;
  onChange: (key: string, value: number) => void;
}

export function InputDataEditor({ columns, data, onChange }: InputDataEditorProps) {
  const chunkSize = 6;
  const chunks: string[][] = [];

  // แบ่ง columns เป็นกลุ่มละ 6
  for (let i = 0; i < columns.length; i += chunkSize) {
    chunks.push(columns.slice(i, i + chunkSize));
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Edit3 className="w-4 h-4 text-primary" />
          ข้อมูล Input (แก้ไขได้)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableBody>
              {chunks.map((chunk, index) => (
                <React.Fragment key={index}>
                  
                  {/* แถวหัวตาราง */}
                  <TableRow>
                    {chunk.map((col) => (
                      <TableHead
                        key={col}
                        className="text-xs font-medium whitespace-nowrap px-2 text-center"
                      >
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>

                  {/* แถวข้อมูล */}
                  <TableRow>
                    {chunk.map((col) => (
                      <TableCell key={col} className="px-1 py-2 text-center">
                        <Input
                          type="number"
                          step="0.01"
                          value={data[col] ?? ""}
                          onChange={(e) =>
                            onChange(col, parseFloat(e.target.value) || 0)
                          }
                          className="h-8 text-xs font-mono text-center w-20 min-w-[5rem]"
                        />
                      </TableCell>
                    ))}
                  </TableRow>

                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
