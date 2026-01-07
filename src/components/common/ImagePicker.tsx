import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDZ1Pp270umxhXhfUP9BXjMC272BUVux7nZOdgb1dklGnqJeXbiMvPOanv4RNtK_WlILLHBgxv3RYHjFj-B2emQD361KdoA4GyvhLYfJHLUiWgB0GLO-YQZCrqtMPxllZVYJE-omuO4U1ID8wkt09Unk1KkXCwVwXQQUoSZPqsfVEDxwWYlBowmDJIpzQtwqJ3YFBTc-C3xepLe22_3q_OaYnRojgB4rR064bMxrioUG08c_3aPYrY0pC5nXJb9akZonxUj9qGzg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB2slCiPQBiWCVxs-5z1rOkZf9h8VVXOuKpb2wp-9rszAyemfy_KXZPmK3q5tls6lXODXXU7gP6HAB9Y3nFziyBa8-AHnTR7oIztercmnTFzD7aAP8Exl-ZlTrEM21g0TzkUFlGQGHE5xZY8D_aOWW4zdWZsVE47qCJmtPeodJR3y9hXmrRj6uaw7DfQ-iaOhmDFpNWhos8z18Iqp56G-GgHdlFz--upzrmnGO5dPxf6RQQw_Dmb3YTVmTc-F_n5K3WfA6jcm4aOA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAqb8pph8hVlpRG5Fb-EtFOmfLMHIXbDi7a6GlVq-eb8sC_Bf8KRDVXLVXFwbCF-4NXPyUBOlUji4z1ukEe3OuAqnZ2Za9YnZF1CxwXJO5JA439XjBcQWSpyJUosBuANVeQ9zN2J124odkUFr5kf224IBg_-_PoGAEVnkvOmdhCQZcq6NEGuQcNB8wP2ziwJiNDA5NLpgsikixADhfqdXlUloyb5OOeStemjxFi4vn1vKROcaacATCkaZxp8yQ0UTQTVvptLNyW3A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuASQx5uCkzrv4jTr849ZrHq9oCOnqPT0FKfpGCG0PU-gFGImYqLZ15TYzxv1hWvPEU_SPxMr914Qc1Ztm-uKd-fg37MtAJFLRUGLbCrVEUz8AvW8y9I9-hDBV-eea91680EHIsffIE21tI8rhC-1aQEd94t7ZnP96RMLUQ1phqIIJCgV5eBuxh9hhEOWE3-rOpG9shseHS0FY9akQ9_O74WEwTfJYNGDcFdXtR1kK2MGLjg1hbfIGRLLxyeRSJ70LASKGdyBmNVcA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1fFcNAyCcjv2AfvGDeOjLh9QEJuqay2dO6YUfZ_-E0L0rzGjgHeG4UjOHTI8TkEVxs1XCH4BlHg4v3RF7m-9eA6EOIPogix_5wzFZMcaB6-CHPvoT0Av1eURj6TtiEYORywCIqUJwasVUDznr6uZEG9_si3NTfdNcoFqfmobxLUku_ryU36kwOiCPUm6O0LbbpL87NSF0QJaaTYUBWPBHOJMosj0u6pCgD2jW5ifoi5EA9mEUAJJvQ_dJabw7GhMygDLZ1cWLdw",
];

interface ImagePickerProps {
  selected: string;
  onSelect: (url: string) => void;
  className?: string;
}

export function ImagePicker({ selected, onSelect, className }: ImagePickerProps) {
  return (
    <div className={cn("bg-card p-4 rounded-xl border border-border shadow-sm", className)}>
      <div className="grid grid-cols-5 gap-3 justify-items-center">
        {AVATARS.map((avatar, i) => (
          <button
            key={i}
            onClick={() => onSelect(avatar)}
            type="button"
            className={cn(
              "relative size-12 rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95",
              selected === avatar ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
            )}
          >
            <img src={avatar} className="size-full object-cover" alt={`Avatar ${i + 1}`} />
            {selected === avatar && (
              <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm font-bold">check</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
