import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { validateLocationInput } from "../utils/validators";
import ConfirmModal from "../components/ConfirmModal";
import LocationFormModal from "../components/LocationFormModal";

export default function UserPage() {
  const [locations, setLocations] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const token = localStorage.getItem("access_token");

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/locations/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load locations");

      setLocations(await res.json());
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setForm({ name: "", description: "", latitude: "", longitude: "" });
    setFormOpen(true);
  };

  const openEditModal = (loc) => {
    setEditing(loc);
    setForm({
      name: loc.name,
      description: loc.description || "",
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    const error = validateLocationInput(form);
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
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save location");

      await fetchLocations();

      setMessage(editing ? "✅ Location updated" : "✅ Location added");
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (loc) => {
    setDeleteTarget(loc);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/locations/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete location");

      await fetchLocations();
      setMessage("🗑️ Location deleted");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">🌿 My Locations</h2>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" /> Add Location
        </button>
      </div>

      {/* Inline Notification */}
      <div
        className={`h-5 text-sm mb-4 transition-opacity ${message ? "opacity-100" : "opacity-0"
          } ${message.startsWith("❌")
            ? "text-red-500"
            : "text-green-600"
          }`}
      >
        {message || "placeholder"}
      </div>

      {/* List */}
      <div className="grid md:grid-cols-2 gap-4">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-blue-700">{loc.name}</h3>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditModal(loc)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Pencil className="w-5 h-5" />
                </button>

                <button
                  onClick={() => confirmDelete(loc)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-2">{loc.description}</p>

            <p className="text-xs text-gray-400 mt-3">
              {loc.latitude && loc.longitude
                ? `📍 ${loc.latitude}, ${loc.longitude}`
                : "No coordinates"}
            </p>
          </div>
        ))}

        {locations.length === 0 && (
          <div className="col-span-full text-center text-gray-400 italic">
            No locations yet. Add your first one!
          </div>
        )}
      </div>

      {/* Modals */}
      <LocationFormModal
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        onSubmit={handleSave}
        form={form}
        setForm={setForm}
        loading={loading}
        editing={editing}
      />

      <ConfirmModal
        open={deleteOpen}
        title="Delete Location?"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
