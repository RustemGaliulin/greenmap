import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";

export default function UserPage() {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", latitude: "", longitude: "" });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = editing
      ? `/api/locations/${editing.id}`
      : "/api/locations/";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save location");
      await fetchLocations();
      setForm({ name: "", description: "", latitude: "", longitude: "" });
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
    setForm({
      name: loc.name,
      description: loc.description || "",
      latitude: loc.latitude || "",
      longitude: loc.longitude || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">🌿 My Locations</h2>
        <button
          onClick={() => setEditing(null)}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {message && <div className="text-gray-600 text-sm mb-4">{message}</div>}


      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-8 flex flex-col gap-3"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {editing ? "✏️ Edit Location" : "➕ Add Location"}
        </h3>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2">
          <input
            name="latitude"
            placeholder="Latitude"
            value={form.latitude}
            onChange={handleChange}
            className="p-3 border rounded-lg w-1/2 focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="longitude"
            placeholder="Longitude"
            value={form.longitude}
            onChange={handleChange}
            className="p-3 border rounded-lg w-1/2 focus:ring-2 focus:ring-blue-400"
          />
        </div>
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

      {/* List of locations */}
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
