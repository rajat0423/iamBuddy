
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

import Dashboard from "@/pages/Dashboard";
import MoodCheckIn from "@/pages/MoodCheckIn";
import Community from "@/pages/Community";
import ChatRoom from "@/pages/ChatRoom";
import MusicLounge from "@/pages/MusicLounge";
import Games from "@/pages/Games";
import MemoryGrid from "@/pages/games/MemoryGrid";
import FocusFlow from "@/pages/games/FocusFlow";
import EmotionalBalance from "@/pages/games/EmotionalBalance";
import BubblePop from "@/pages/games/BubblePop";
import ShapeMatch from "@/pages/games/ShapeMatch";
import MoodAssessment from "@/pages/MoodAssessment";
import Journal from "@/pages/Journal";
import Therapy from "@/pages/Therapy";
import Prompts from "@/pages/Prompts";
import Profile from "@/pages/Profile";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <MoodAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mood"
            element={
              <ProtectedRoute>
                <MoodAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/check-in-legacy"
            element={
              <ProtectedRoute>
                <MoodCheckIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:chatId"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/music"
            element={
              <ProtectedRoute>
                <MusicLounge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <Games />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/memory"
            element={
              <ProtectedRoute>
                <MemoryGrid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/focus"
            element={
              <ProtectedRoute>
                <FocusFlow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/emotion"
            element={
              <ProtectedRoute>
                <EmotionalBalance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/bubble"
            element={
              <ProtectedRoute>
                <BubblePop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/shape-match"
            element={
              <ProtectedRoute>
                <ShapeMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mood-assessment"
            element={
              <ProtectedRoute>
                <MoodAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/therapy"
            element={
              <ProtectedRoute>
                <Therapy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stories"
            element={
              <ProtectedRoute>
                <Prompts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
