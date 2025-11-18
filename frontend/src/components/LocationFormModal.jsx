import { useState } from "react";
import MapPicker from "./MapPicker";
import { X } from "lucide-react";

export default function LocationModal({
  open,
  initialData,
  onCancel,
  onSubmit,
  loading,
}) {
  if (!open) return null;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    position: initialData
      ? { lat: initialData.latitude, lng: initialData.longitude }
      : null,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () => {
    if (!form.position) {
      alert("Please select a point on the map");
      return;
    }

    onSubmit({
      ...form,
      latitude: form.position.lat,
      longitude: form.position.lng,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl relative">

        {/* Close button must be type=button or form will submit */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-50"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {initialData ? "Edit Location" : "Add New Location"}
        </h2>

        <div className="space-y-3">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <MapPicker
            value={form.position}
            onChange={(pos) => setForm({ ...form, position: pos })}
          />

          {/* Centered button, not full width */}
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 mx-auto block"
          >
            {loading ? "Saving..." : initialData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
