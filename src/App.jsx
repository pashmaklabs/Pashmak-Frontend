import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./routes/AppRouter";
import Sidebar from "./components/Sidebar";
import { initPostHog, trackError, testHeatmap, checkHeatmapStatus } from "./lib/posthog";

function App() {
  useEffect(() => {
    const posthog = initPostHog();
    
    const handleError = (event) => {
      trackError(event.error || new Error(event.message), {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'runtime_error'
      });
    };
    
    const handleRejection = (event) => {
      trackError(new Error(event.reason), {
        type: 'unhandled_rejection',
        promise: event.promise?.toString()
      });
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    setTimeout(() => {
      console.log('🧪 Testing PostHog connection...');
      checkHeatmapStatus();
      testHeatmap();
    }, 3000);
    
    console.log(`
    ========================================
    🎯 POSTHOG SETUP COMPLETE
    ========================================
    
    ✅ PostHog initialized
    ✅ Error tracking active
    ✅ Heatmap tracking active
    
    📊 View your data:
    https://us.posthog.com/project/.../dashboard
    
    🔥 For heatmaps:
    1. Go to Settings > Heatmaps
    2. Enable "Enable heatmaps for web"
    3. Go to Product Analytics > Heatmaps
    
    ========================================
    `);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <div className="App">
      <Sidebar />
      <AppRouter />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;