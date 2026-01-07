import { useState } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import { useMutationHook } from "@/hooks/use-mutation-hook";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImagePicker, AVATARS } from "@/components/common/ImagePicker";
import { Textarea } from "@/components/ui/textarea";

// Extracted Form Component to handle state isolation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EditProfileForm({ user, onClose }: { user: any; onClose: () => void }) {
  const updateUserMutation = useMutation(api.users.updateUser);
  const { mutate: updateUser, isPending } = useMutationHook(updateUserMutation);

  // Initialize state directly from props.
  // Since this component is mounted when the Dialog (and its Content) opens, these values will be fresh.
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [selectedAvatar, setSelectedAvatar] = useState(user.imageUrl || AVATARS[0]);

  const handleSave = async () => {
    try {
      await updateUser({
        name,
        bio,
        imageUrl: selectedAvatar,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="flex flex-col gap-3">
          <Label>Avatar</Label>
          <ImagePicker selected={selectedAvatar} onSelect={setSelectedAvatar} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            className="min-h-25"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProfileContent({ user }: { user: any }) {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = async () => {
      await signOut();
      navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopHeader title="Profile" showBack={true} />

      {/* Hero Section (Read Only) */}
      <div className="flex flex-col items-center p-6 gap-4 mt-4">
        <div className="relative group">
           <div
             className="size-32 rounded-full border-4 border-background shadow-lg bg-cover bg-center ring-2 ring-border"
             style={{backgroundImage: `url(${user.imageUrl || AVATARS[0]})`}}
           ></div>
           {/* Edit Button Triggering Dialog */}
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
             <DialogTrigger asChild>
                <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full border-4 border-background shadow-sm hover:scale-105 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
             </DialogTrigger>
             {/* DialogContent unmounts its children when closed, ensuring EditProfileForm resets state on reopen */}
             <DialogContent className="sm:max-w-106.25 max-h-[90vh] overflow-y-auto">
               <EditProfileForm user={user} onClose={() => setIsDialogOpen(false)} />
             </DialogContent>
           </Dialog>
        </div>

        <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
            <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
              {user.bio || "No bio set yet. Click the edit icon to add one!"}
            </p>
        </div>
      </div>

      {/* Stats or Other Info (Placeholder for now) */}
      <div className="px-6 py-4">
         <div className="bg-card rounded-xl p-4 border border-border flex items-center justify-between shadow-sm">
            <div>
                <p className="text-sm text-muted-foreground font-medium">Email</p>
                <p className="text-foreground font-medium">{user.email}</p>
            </div>
            <span className="material-symbols-outlined text-muted-foreground">lock</span>
         </div>
      </div>

      <div className="px-6 mt-4">
          <Button
            variant="destructive"
            className="w-full h-12 text-base font-medium bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 border border-red-100 dark:border-red-900/50 shadow-none"
            onClick={handleLogout}
          >
            Log Out
          </Button>
      </div>

    </div>
  );
}

export default function ProfilePage() {
  const user = useQuery(api.users.viewer);

  if (user === undefined) {
      return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
  }

  if (user === null) {
      return <div className="p-10 text-center">Please log in.</div>;
  }

  return <ProfileContent user={user} />;
}
