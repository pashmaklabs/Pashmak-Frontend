import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import routes from "../routes/Routes";
import { useEmail } from "../stores/login";

const ResetPassword = ({ 
  handleChangePassword, 
  isLoading, 
  handleCloseLoginFlow 
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isTouched, setIsTouched] = useState(false);
  const { email } = useEmail();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = {
      minLength: {
        message: "رمز عبور باید حداقل ۸ کاراکتر باشد",
        isError: password.length < 8,
      },
      hasUpperCase: {
        message: "حداقل یک حرف بزرگ لازم است",
        isError: !/[A-Z]/.test(password),
      },
      hasNumber: {
        message: "حداقل یک عدد لازم است",
        isError: !/[0-9]/.test(password),
      },
      hasSpecialChar: {
        message: "حداقل یک کاراکتر خاص لازم است",
        isError: !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password),
      },
    };
    setPasswordErrors(errors);
  };

  const hasPasswordError = Object.values(passwordErrors).some((e) => e.isError);
  const passwordsMatch = password === confirmPassword;

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsTouched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasPasswordError && passwordsMatch && password && confirmPassword) {
      handleChangePassword(password);
    }
  };

  const isFormValid = password && confirmPassword && !hasPasswordError && passwordsMatch;

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="relative rounded-[24px] bg-white shadow-2xl border border-gray-100 w-full max-w-[420px] overflow-hidden h-auto sm:w-[370px] lg:h-[584px] lg:w-[474px] lg:right-[calc(10vw)]">
        {/* Close Button */}
        <button
          onClick={handleCloseLoginFlow}
          className="bg-transparent border-none absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <img
            src="/Close_round.svg"
            alt="close"
            className="w-5 h-5"
          />
        </button>

        {/* Exit Button */}
        <button
          onClick={() => navigate(routes.map)}
          disabled={isLoading}
          className="bg-white absolute left-4 top-4 z-10 px-3 py-1 text-sm text-gray-600 hover:text-primary transition-colors duration-200 disabled:opacity-50"
        >
          خروج
        </button>

        {/* Header Section */}
        <div className="pt-8 pb-4 px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <img
                src="/logo.svg"
                alt="Logo"
                className="w-20 h-20 mx-auto"
              />
              <p className="mt-0 text-[#89A4E1] font-Vazir text-lg font-medium">
                پشمک
              </p>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-800">
                تنظیم رمز عبور جدید
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                رمز عبور جدید برای حساب کاربری خود تعیین کنید
              </p>
              <div 
                className="inline-block px-3 py-1 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium"
                style={{ direction: "ltr", unicodeBidi: "bidi-override" }}
              >
                {email}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="px-8 pb-8 max-h-[calc(100%-240px)] lg:max-h-[calc(100%-280px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 text-right">
                رمز عبور جدید
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="رمز عبور جدید را وارد کنید"
                  className={`w-full px-3 py-3 pr-3 pl-10 text-right border-2 rounded-lg bg-gray-50 
                            placeholder:text-gray-400 text-sm transition-all duration-200
                            focus:outline-none focus:ring-2 focus:bg-white hover:bg-white
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${password === "" ? "border-gray-200 focus:ring-primary/20 focus:border-primary" :
                              hasPasswordError ? "border-red-400 focus:ring-red-400/20 focus:border-red-400" :
                              "border-green-400 focus:ring-green-400/20 focus:border-green-400"}`}
                  disabled={isLoading}
                  required
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeIcon className="w-4 h-4 text-gray-500" />
                  ) : (
                    <EyeOffIcon className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              <div className="mt-2">
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        !isTouched ? 'w-0 bg-gray-300' :
                        hasPasswordError ? 'w-1/3 bg-red-400' : 'w-full bg-green-400'
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    !isTouched ? 'text-gray-400' :
                    hasPasswordError ? 'text-red-500' : 'text-green-600'
                  }`}>
                    {!isTouched ? 'رمز عبور' : hasPasswordError ? 'ضعیف' : 'قوی'}
                  </span>
                </div>

                {/* Compact Rules Grid */}
                {isTouched && (
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(passwordErrors).map(([key, error], idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                          error.isError ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          error.isError ? "bg-red-400" : "bg-green-400"
                        }`} />
                        <span className="truncate">{
                          key === 'minLength' ? '۸+ کاراکتر' :
                          key === 'hasUpperCase' ? 'حرف بزرگ' :
                          key === 'hasNumber' ? 'عدد' :
                          'کاراکتر خاص'
                        }</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 text-right">
                تکرار رمز عبور جدید
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="دوباره وارد کنید"
                  className={`w-full px-3 py-3 pr-3 pl-10 text-right border-2 rounded-lg bg-gray-50 
                            placeholder:text-gray-400 text-sm transition-all duration-200
                            focus:outline-none focus:ring-2 focus:bg-white hover:bg-white
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${confirmPassword === "" ? "border-gray-200 focus:ring-primary/20 focus:border-primary" :
                              passwordsMatch ? "border-green-400 focus:ring-green-400/20 focus:border-green-400" :
                              "border-red-400 focus:ring-red-400/20 focus:border-red-400"}`}
                  disabled={isLoading}
                  required
                />
                
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="w-4 h-4 text-gray-500" />
                  ) : (
                    <EyeIcon className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${
                    passwordsMatch ? "bg-green-400" : "bg-red-400"
                  }`} />
                  <span className={`text-xs ${
                    passwordsMatch ? "text-green-600" : "text-red-500"
                  }`}>
                    {passwordsMatch ? "رمز عبور مطابقت دارد" : "رمز عبور مطابقت ندارد"}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-3 px-6 rounded-xl font-medium text-white text-sm
                          transition-all duration-200 transform
                          ${isFormValid 
                            ? 'bg-primary hover:bg-primary/90 hover:scale-[0.99] active:scale-[0.98] shadow-lg hover:shadow-xl' 
                            : 'bg-gray-300 cursor-not-allowed'
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال تنظیم رمز عبور...</span>
                  </div>
                ) : (
                  "تنظیم رمز عبور"
                )}
              </button>
            </div>

            {/* Security Note */}
            <div className="text-center text-xs text-gray-500 pt-2">
              <p>رمز عبور جدید شما به صورت امن ذخیره خواهد شد</p>
            </div>
          </form>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[24px]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">در حال تنظیم رمز عبور...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;