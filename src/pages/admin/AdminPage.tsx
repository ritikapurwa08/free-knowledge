// src/pages/admin/AdminPage.tsx
import { useState } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { BulkImportForm } from "@/components/features/admin/BulkImportForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function AdminPage() {
  // --- User Management State ---
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const adminEmails = useQuery(api.admin.getAllAdmins);
  const addAdmin = useMutation(api.admin.addAdminEmail);

  // --- USER HANDLERS ---
  const handleAddAdmin = async () => {
    if (!newAdminEmail) return;
    try {
        await addAdmin({ email: newAdminEmail });
        toast.success("Admin added successfully!");
        setNewAdminEmail("");
    } catch (e) {
        toast.error("Failed to add admin: " + e);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopHeader title="Admin Panel" showBack={true} />

      <main className="p-4 max-w-300 mx-auto space-y-6">

        <Tabs defaultValue="bulk-quiz" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="bulk-quiz">📝 Bulk Quiz Import</TabsTrigger>
                <TabsTrigger value="users">👥 Manage Users</TabsTrigger>
            </TabsList>

            {/* --- BULK QUIZ TAB --- */}
            <TabsContent value="bulk-quiz">
                 <Card>
                    <CardHeader>
                        <CardTitle>Bulk Quiz Import</CardTitle>
                        <CardDescription>Upload JSON files containing quiz questions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BulkImportForm />
                    </CardContent>
                </Card>
            </TabsContent>

            {/* --- USERS TAB --- */}
            <TabsContent value="users">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Admin Access</CardTitle>
                        <CardDescription>Grant admin privileges to other users.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-2">
                             <div className="flex-1">
                                <Input
                                    placeholder="Enter email address"
                                    value={newAdminEmail}
                                    onChange={(e) => setNewAdminEmail(e.target.value)}
                                />
                             </div>
                            <Button onClick={handleAddAdmin}>Add Admin</Button>
                        </div>

                        <div className="rounded-md border">
                            <div className="p-4 bg-muted/50 font-medium text-sm grid grid-cols-3">
                                <span>Email</span>
                                <span>Added By</span>
                                <span>Date</span>
                            </div>
                            <div className="divide-y">
                                {adminEmails?.map((admin) => (
                                    <div key={admin._id} className="p-4 text-sm grid grid-cols-3 items-center">
                                        <div className="font-medium">{admin.email}</div>
                                        <div className="text-muted-foreground truncate">{admin.addedBy}</div>
                                        <div className="text-muted-foreground">
                                            {new Date(admin.addedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                                {(!adminEmails || adminEmails.length === 0) && (
                                    <div className="p-8 text-center text-muted-foreground">
                                        No admins configured yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
