import { useForm } from "react-hook-form";

export default function Register({ onRegister }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    const isValid = await trigger();
    if (!isValid) return;

    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || "Registration failed");

      alert("✅ Registration successful! You can log in now.");
      onRegister();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create an Account
        </h2>

        {/* Email field */}
        <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-green-400"
          }`}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        {/* Fixed-height error container (prevents layout shift) */}
        <div className="h-5 mb-2">
          <span
            className={`text-sm text-red-500 block text-left transition-opacity duration-200 ${
              errors.email ? "opacity-100" : "opacity-0"
            }`}
          >
            {errors.email?.message || "placeholder"}
          </span>
        </div>

        {/* Password field */}
        <label
          className="block text-gray-700 font-medium mb-1"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
            errors.password
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-green-400"
          }`}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {/* Fixed-height error container */}
        <div className="h-5 mb-4">
          <span
            className={`text-sm text-red-500 block text-left transition-opacity duration-200 ${
              errors.password ? "opacity-100" : "opacity-0"
            }`}
          >
            {errors.password?.message || "placeholder"}
          </span>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={`w-full font-semibold p-3 rounded transition ${
            isSubmitting
              ? "bg-green-400 cursor-wait text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isSubmitting ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
