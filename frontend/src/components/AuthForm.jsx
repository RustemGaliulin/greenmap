import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Plus } from "lucide-react";
import { validateLocationInput } from "../utils/validators";

export default function UserPage() {
  const [locations, setLocations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", description: "", latitude: "", longitude: "" },
  });

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/locations/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load locations");
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const onSubmit = async (data) => {
    setMessage("");

    const error = validateLocationInput(data);
    if (error) {
      setMessage(error);
      return;
    }

    setLoading(true);
    const endpoint = editing ? `/api/locations/${editing.id}` : "/api/locations/";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save location");

      await fetchLocations();
      reset();
      setEditing(null);
      setMessage(editing ? "✅ Location updated" : "✅ Location added");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (loc) => {
    setEditing(loc);
    setValue("name", loc.name);
    setValue("description", loc.description || "");
    setValue("latitude", loc.latitude || "");
    setValue("longitude", loc.longitude || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">🌿 My Locations</h2>
        <button
          onClick={() => {
            setEditing(null);
            reset();
          }}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <div
        className={`h-5 mb-4 text-sm text-left transition-opacity duration-200 ${
          message
            ? message.startsWith("✅")
              ? "text-green-600 opacity-100"
              : "text-red-500 opacity-100"
            : "opacity-0"
        }`}
      >
        {message || "placeholder"}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-xl p-6 mb-8 flex flex-col gap-3"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {editing ? "✏️ Edit Location" : "➕ Add Location"}
        </h3>

        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Name"
          className={`p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
            errors.name ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}

        <textarea
          {...register("description")}
          placeholder="Description"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex gap-2">
          <input
            {...register("latitude", {
              required: "Latitude is required",
              validate: (v) => !isNaN(v) || "Latitude must be a number",
            })}
            placeholder="Latitude"
            className={`p-3 border rounded-lg w-1/2 focus:ring-2 focus:ring-blue-400 ${
              errors.latitude ? "border-red-400" : "border-gray-300"
            }`}
          />
          <input
            {...register("longitude", {
              required: "Longitude is required",
              validate: (v) => !isNaN(v) || "Longitude must be a number",
            })}
            placeholder="Longitude"
            className={`p-3 border rounded-lg w-1/2 focus:ring-2 focus:ring-blue-400 ${
              errors.longitude ? "border-red-400" : "border-gray-300"
            }`}
          />
        </div>
        {(errors.latitude || errors.longitude) && (
          <span className="text-sm text-red-500">
            {errors.latitude?.message || errors.longitude?.message}
          </span>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition ${
            loading ? "opacity-70 cursor-wait" : ""
          }`}
        >
          {loading ? "Saving..." : editing ? "Update" : "Add"}
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-blue-700">{loc.name}</h3>
                <button
                  onClick={() => startEdit(loc)}
                  className="text-gray-500 hover:text-blue-600"
                  title="Edit"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">{loc.description}</p>
            </div>
            <div className="text-xs text-gray-400 mt-3">
              {loc.latitude && loc.longitude
                ? `📍 ${loc.latitude}, ${loc.longitude}`
                : "No coordinates"}
            </div>
          </div>
        ))}
        {locations.length === 0 && (
          <div className="col-span-full text-center text-gray-400 italic">
            No locations yet. Add your first one!
          </div>
        )}
      </div>
    </div>
  );
}
