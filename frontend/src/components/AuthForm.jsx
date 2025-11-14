import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm({ mode = "login", onSuccess }) {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const isLogin = mode === "login";

  const onSubmit = async (data) => {
    setMessage({ type: "", text: "" });
    const isValid = await trigger();
    if (!isValid) return;

    const endpoint = isLogin ? "login" : "register";
    try {
      const res = await fetch(`http://localhost:8000/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || `${mode} failed`);

      // ✅ Handle success messages
      setMessage({
        type: "success",
        text: isLogin
          ? "✅ Logged in successfully!"
          : "✅ Registration successful! Logging you in...",
      });

      // Auto-login on register
      if (!isLogin) {
        // Immediately log the user in using the same credentials
        const loginRes = await fetch(`http://localhost:8000/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.detail || "Auto-login failed");
        onSuccess(loginData.access_token);
      } else {
        onSuccess(result.access_token);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: `❌ ${err.message}` });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Sign In" : "Create an Account"}
        </h2>

        {/* Compact message area (no layout shift) */}
        <div
          className={`h-5 mb-4 text-sm text-center transition-opacity duration-200 ${message.text
              ? message.type === "success"
                ? "text-green-600 opacity-100"
                : "text-red-500 opacity-100"
              : "opacity-0"
            }`}
        >
          {message.text || "placeholder"}
        </div>

        {/* Email */}
        <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${errors.email
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
            }`}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        <div className="h-5 mb-2">
          <span
            className={`text-sm text-red-500 block text-left transition-opacity duration-200 ${errors.email ? "opacity-100" : "opacity-0"
              }`}
          >
            {errors.email?.message || "placeholder"}
          </span>
        </div>

        {/* Password */}
        <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={isLogin ? "Enter your password" : "Create a password"}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 pr-10 ${errors.password
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-400"
              }`}
            {...register("password", {
              required: "Password is required",
              minLength: !isLogin
                ? { value: 6, message: "Password must be at least 6 characters" }
                : undefined,
            })}
            onChange={(e) => {
              register("password").onChange(e);
              trigger("password");
            }}
          />

          {/* Eye icon */}
          <button
            type="button"
            title={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="h-5 mb-4">
          <span
            className={`text-sm text-red-500 block text-left transition-opacity duration-200 ${errors.password ? "opacity-100" : "opacity-0"
              }`}
          >
            {errors.password?.message || "placeholder"}
          </span>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full font-semibold p-3 rounded transition ${isSubmitting
              ? "bg-blue-400 cursor-wait text-white"
              : isLogin
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
        >
          {isSubmitting
            ? isLogin
              ? "Signing in..."
              : "Creating..."
            : isLogin
              ? "Sign In"
              : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
