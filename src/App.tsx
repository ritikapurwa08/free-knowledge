// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import Home from "@/pages/dashboard/Home";
import QuizAttempt from "@/pages/quiz/QuizAttempt";
import AdminPage from "@/pages/admin/AdminPage"; // Import Admin Page
import ResourcesPage from "./pages/learn/ResourcesPage";
import VocabularyPage from "./pages/learn/VocabularyPage";
import Learn from "./pages/learn/Learn";
import Leaderboard from "./pages/dashboard/Leaderboard";
import Profile from "./pages/profile/ProfilePage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Statistics from "./pages/dashboard/Statistics";
import QuizReview from "./pages/quiz/QuizReview";
import QuizHistory from "./pages/quiz/QuizHistory";

// Placeholder Pages


const NotFound = () => <div className="p-4 pt-20">404: Page Not Found</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes that use the bottom nav */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/resources" element={<ResourcesPage />} />
<Route path="/learn/vocabulary" element={<VocabularyPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz/attempt" element={<QuizAttempt />} />
          <Route path="/quiz/quick-start" element={<QuizAttempt />} />
          <Route path="*" element={<NotFound />} />
            <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/quiz/review" element={<QuizReview />} />
<Route path="/quiz/history" element={<QuizHistory />} />
        </Route>

        {/* Admin Route - Does NOT use RootLayout (no bottom nav) */}
        <Route path="/admin" element={<AdminPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
