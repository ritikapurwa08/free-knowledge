import { useState } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDZ1Pp270umxhXhfUP9BXjMC272BUVux7nZOdgb1dklGnqJeXbiMvPOanv4RNtK_WlILLHBgxv3RYHjFj-B2emQD361KdoA4GyvhLYfJHLUiWgB0GLO-YQZCrqtMPxllZVYJE-omuO4U1ID8wkt09Unk1KkXCwVwXQQUoSZPqsfVEDxwWYlBowmDJIpzQtwqJ3YFBTc-C3xepLe22_3q_OaYnRojgB4rR064bMxrioUG08c_3aPYrY0pC5nXJb9akZonxUj9qGzg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB2slCiPQBiWCVxs-5z1rOkZf9h8VVXOuKpb2wp-9rszAyemfy_KXZPmK3q5tls6lXODXXU7gP6HAB9Y3nFziyBa8-AHnTR7oIztercmnTFzD7aAP8Exl-ZlTrEM21g0TzkUFlGQGHE5xZY8D_aOWW4zdWZsVE47qCJmtPeodJR3y9hXmrRj6uaw7DfQ-iaOhmDFpNWhos8z18Iqp56G-GgHdlFz--upzrmnGO5dPxf6RQQw_Dmb3YTVmTc-F_n5K3WfA6jcm4aOA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAqb8pph8hVlpRG5Fb-EtFOmfLMHIXbDi7a6GlVq-eb8sC_Bf8KRDVXLVXFwbCF-4NXPyUBOlUji4z1ukEe3OuAqnZ2Za9YnZF1CxwXJO5JA439XjBcQWSpyJUosBuANVeQ9zN2J124odkUFr5kf224IBg_-_PoGAEVnkvOmdhCQZcq6NEGuQcNB8wP2ziwJiNDA5NLpgsikixADhfqdXlUloyb5OOeStemjxFi4vn1vKROcaacATCkaZxp8yQ0UTQTVvptLNyW3A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuASQx5uCkzrv4jTr849ZrHq9oCOnqPT0FKfpGCG0PU-gFGImYqLZ15TYzxv1hWvPEU_SPxMr914Qc1Ztm-uKd-fg37MtAJFLRUGLbCrVEUz8AvW8y9I9-hDBV-eea91680EHIsffIE21tI8rhC-1aQEd94t7ZnP96RMLUQ1phqIIJCgV5eBuxh9hhEOWE3-rOpG9shseHS0FY9akQ9_O74WEwTfJYNGDcFdXtR1kK2MGLjg1hbfIGRLLxyeRSJ70LASKGdyBmNVcA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1fFcNAyCcjv2AfvGDeOjLh9QEJuqay2dO6YUfZ_-E0L0rzGjgHeG4UjOHTI8TkEVxs1XCH4BlHg4v3RF7m-9eA6EOIPogix_5wzFZMcaB6-CHPvoT0Av1eURj6TtiEYORywCIqUJwasVUDznr6uZEG9_si3NTfdNcoFqfmobxLUku_ryU36kwOiCPUm6O0LbbpL87NSF0QJaaTYUBWPBHOJMosj0u6pCgD2jW5ifoi5EA9mEUAJJvQ_dJabw7GhMygDLZ1cWLdw",
];

export default function Profile() {
  const [name, setName] = useState("Amit Kumar");
  const [bio, setBio] = useState("Student • Level 4");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
      <TopHeader title="Profile"
        rightAction={<button className="text-primary font-bold text-sm">Save</button>}
      />

      {/* Hero Section */}
      <div className="flex flex-col items-center p-6 gap-4">
        <div className="relative group">
           <div className="size-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-cover bg-center" style={{backgroundImage: `url(${selectedAvatar})`}}></div>
           <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-4 border-background-light dark:border-background-dark shadow-sm">
             <span className="material-symbols-outlined text-[18px]">edit</span>
           </button>
        </div>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-[#111318] dark:text-white">{name}</h2>
            <p className="text-gray-500">{bio}</p>
        </div>
      </div>

      {/* Avatar Selection */}
      <div className="px-4 pb-2">
        <h3 className="font-bold text-base mb-3 px-1">Choose Avatar</h3>
        <div className="bg-white dark:bg-[#1a2230] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="grid grid-cols-5 gap-3 justify-items-center">
                {AVATARS.map((avatar, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative size-12 rounded-full overflow-hidden transition-transform hover:scale-105 ${selectedAvatar === avatar ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900' : ''}`}
                    >
                        <img src={avatar} className="size-full object-cover" />
                        {selectedAvatar === avatar && (
                            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-sm font-bold">check</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="h-12 text-base" />
        </div>

        <div className="space-y-2">
            <Label>Email (Read-only)</Label>
            <div className="relative">
                <Input value="amit.kumar@example.com" readOnly className="h-12 text-base bg-gray-50 dark:bg-gray-800 text-gray-500" />
                <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400">lock</span>
            </div>
        </div>

        <div className="space-y-2">
            <Label>Bio</Label>
            <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-25"
                value={bio}
                onChange={e => setBio(e.target.value)}
            />
        </div>

        <div className="pt-4">
            <Button className="w-full h-12 text-lg shadow-lg shadow-primary/20">Save Changes</Button>
            <p className="text-center text-red-500 text-sm font-medium mt-4 cursor-pointer">Log Out</p>
        </div>
      </div>
    </div>
  );
}
