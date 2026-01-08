import { useLocation, useNavigate } from "react-router-dom";
import { TopHeader } from "@/components/layout/TopHeader";

export default function PDFViewerPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { pdfUrl, title } = location.state || {};

    if (!pdfUrl) {
        return <div className="p-10 text-center">No PDF selected</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
            <TopHeader
                title={title || "Document Viewer"}
                showBack={true}
                onBack={() => navigate(-1)}
                rightAction={
                    <a
                        href={pdfUrl}
                        download
                        className="flex items-center gap-2 text-primary hover:underline text-sm font-bold"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className="material-symbols-outlined">download</span>
                        Download
                    </a>
                }
            />
            <div className="flex-1 w-full h-full bg-gray-100 dark:bg-gray-900 relative">
                <iframe
                    src={`${pdfUrl}#toolbar=0`}
                    className="w-full h-full border-none"
                    title={title}
                />
            </div>
        </div>
    );
}
