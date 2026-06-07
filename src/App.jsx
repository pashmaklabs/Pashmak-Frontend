import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./routes/AppRouter";
import Sidebar from "./components/Sidebar";

function App() {
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
        // toastClassName="custom-toast"
        // bodyClassName="custom-toast-body"
      />
    </div>
  );
}

export default App;
