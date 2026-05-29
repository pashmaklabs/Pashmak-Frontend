import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-[url('/notfound.png')] bg-cover bg-center bg-no-repeat z-[40]">
      <Helmet>
        <title>صفحه یافت نشد</title>
      </Helmet>

      <div className="absolute inset-0 bg-black/10"></div>

      <button
        onClick={() => navigate("/map")}
        className="z-[50] rounded-lg bg-white px-8 py-3 text-lg font-semibold text-black shadow-lg transition-all hover:scale-105 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
      >
        برگرد به نقشه
      </button>
    </div>
  );
}
