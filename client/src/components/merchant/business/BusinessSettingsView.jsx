import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import mpesaLogo from "../../../assets/mpesaLogo.png";

const BusinessSettingsView = () => {
  const { businessId, business } = useOutletContext();
  const [settings, setSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
  fetch(`http://localhost:5000/business_settings?business_id=${businessId}`)
        .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setSettings(data[0]);
      });
  }, [businessId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await fetch(`http://localhost:5000/business_settings/${settings.id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(settings),
});
    setIsSaving(false);
    alert("Settings saved!");
  };

  if (!settings) {
    return <p className="p-6 text-[#5e574d]">Loading settings...</p>;
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6 space-y-10">
      <h1 className="text-2xl font-bold text-[#011638] mb-4">Business Settings</h1>

      {/* Contact & Branding */}
      <section className="space-y-4">
  <h2 className="text-lg font-semibold text-[#011638]">Contact & Branding</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="business_email" className="block text-sm text-[#5e574d] mb-1">Business Email</label>
      <input
        id="business_email"
        name="business_email"
        value={settings.business_email || ""}
        onChange={handleChange}
        className="border border-[#d7d0c8] p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="business_phone" className="block text-sm text-[#5e574d] mb-1">Business Phone</label>
      <input
        id="business_phone"
        name="business_phone"
        value={settings.business_phone || ""}
        onChange={handleChange}
        className="border border-[#d7d0c8] p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="branding_logo_url" className="block text-sm text-[#5e574d] mb-1">Logo URL</label>
      <input
        id="branding_logo_url"
        name="branding_logo_url"
        value={settings.branding_logo_url || ""}
        onChange={handleChange}
        className="border border-[#d7d0c8] p-2 rounded w-full"
      />
    </div>

    <div>
      <label htmlFor="brand_color" className="block text-sm text-[#5e574d] mb-1">Brand Color</label>
      <input
        id="brand_color"
        name="brand_color"
        type="color"
        value={settings.brand_color || "#2D9CDB"}
        onChange={handleChange}
        className="w-10 h-10 border rounded"
      />
    </div>
  </div>
</section>

      {/* Daraja Integration */}
      <hr/>
      <section className="space-y-4">
  <img src={mpesaLogo} alt="M-Pesa Logo" className="w-24 mb-2" />
  <h2 className="text-lg font-semibold text-[#011638]">Daraja Integration</h2>
  <label className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      name="use_daraja"
      checked={settings.use_daraja}
      onChange={handleChange}
    />
    Enable Daraja (M-Pesa)
  </label>

  {settings.use_daraja && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="daraja_short_code" className="block text-sm text-[#5e574d] mb-1">Short Code</label>
        <input
          id="daraja_short_code"
          name="daraja_short_code"
          value={settings.daraja_short_code || ""}
          onChange={handleChange}
          className="border border-[#d7d0c8] p-2 rounded w-full"
        />
      </div>

      <div>
        <label htmlFor="daraja_consumer_key" className="block text-sm text-[#5e574d] mb-1">Consumer Key</label>
        <input
          id="daraja_consumer_key"
          name="daraja_consumer_key"
          value={settings.daraja_consumer_key || ""}
          onChange={handleChange}
          className="border border-[#d7d0c8] p-2 rounded w-full"
        />
      </div>

      <div>
        <label htmlFor="daraja_consumer_secret" className="block text-sm text-[#5e574d] mb-1">Consumer Secret</label>
        <input
          id="daraja_consumer_secret"
          name="daraja_consumer_secret"
          value={settings.daraja_consumer_secret || ""}
          onChange={handleChange}
          className="border border-[#d7d0c8] p-2 rounded w-full"
        />
      </div>

      <div>
        <label htmlFor="daraja_passkey" className="block text-sm text-[#5e574d] mb-1">Daraja Passkey</label>
        <input
          id="daraja_passkey"
          name="daraja_passkey"
          value={settings.daraja_passkey || ""}
          onChange={handleChange}
          className="border border-[#d7d0c8] p-2 rounded w-full"
        />
      </div>

      <div>
        <label htmlFor="daraja_environment" className="block text-sm text-[#5e574d] mb-1">Environment</label>
        <select
          id="daraja_environment"
          name="daraja_environment"
          value={settings.daraja_environment || ""}
          onChange={handleChange}
          className="border border-[#d7d0c8] p-2 rounded w-full"
        >
          <option value="">Select Environment</option>
          <option value="sandbox">Sandbox</option>
          <option value="production">Production</option>
        </select>
      </div>
    </div>
  )}
</section>


      {/* Save */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#011638] text-white px-6 py-2 rounded hover:bg-[#000f2a] transition"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default BusinessSettingsView;
