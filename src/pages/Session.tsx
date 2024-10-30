// components/Session.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const sessions = [
  { id: 1, client: "Alice Johnson", service: "Web Development", date: "2023-06-01" },
  { id: 2, client: "Bob Smith", service: "Mobile App Development", date: "2023-06-05" },
  { id: 3, client: "Charlie Brown", service: "UI/UX Design", date: "2023-06-10" },
];

export const Session: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-background rounded-md border">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Sessions</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Session</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Session</DialogTitle>
                <DialogDescription>
                  Schedule a new session.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client" className="text-right">
                    Client
                  </Label>
                  <Input id="client" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="service" className="text-right">
                    Service
                  </Label>
                  <Input id="service" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input  id="date" type="date" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.client}</TableCell>
                <TableCell>{session.service}</TableCell>
                <TableCell>{session.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};