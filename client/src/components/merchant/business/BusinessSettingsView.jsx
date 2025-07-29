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
    <label htmlFor="daraja_short_code" className="block text-sm text-[#5e574d] mb-1">Shortcode (Paybill)</label>
    <input
      id="daraja_short_code"
      name="daraja_short_code"
      value={settings.daraja_short_code || ""}
      onChange={handleChange}
      className="border border-[#d7d0c8] p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="daraja_passkey" className="block text-sm text-[#5e574d] mb-1">STK Passkey</label>
    <input
      id="daraja_passkey"
      name="daraja_passkey"
      value={settings.daraja_passkey || ""}
      onChange={handleChange}
      className="border border-[#d7d0c8] p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="initiator_name" className="block text-sm text-[#5e574d] mb-1">Initiator Name</label>
    <input
      id="initiator_name"
      name="initiator_name"
      value={settings.initiator_name || ""}
      onChange={handleChange}
      className="border border-[#d7d0c8] p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="security_credential" className="block text-sm text-[#5e574d] mb-1">Security Credential</label>
    <input
      id="security_credential"
      name="security_credential"
      value={settings.security_credential || ""}
      onChange={handleChange}
      className="border border-[#d7d0c8] p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="base_url" className="block text-sm text-[#5e574d] mb-1">Base URL</label>
    <input
      id="base_url"
      name="base_url"
      value={settings.base_url || ""}
      onChange={handleChange}
      placeholder="https://sandbox.safaricom.co.ke"
      className="border border-[#d7d0c8] p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="callback_url" className="block text-sm text-[#5e574d] mb-1">STK Callback URL</label>
    <input
      id="callback_url"
      name="callback_url"
      value={settings.callback_url || ""}
      onChange={handleChange}
      className="border border-[#d7d0c8] p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="result_url" className="block text-sm text-[#5e574d] mb-1">B2B Result URL</label>
    <input
      id="result_url"
      name="result_url"
      value={settings.result_url || ""}
      onChange={handleChange}
      className="border border-[#d7d0c8] p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="timeout_url" className="block text-sm text-[#5e574d] mb-1">B2B Timeout URL</label>
    <input
      id="timeout_url"
      name="timeout_url"
      value={settings.timeout_url || ""}
      onChange={handleChange}
      className="border border-[#d7d0c8] p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="c2b_confirm_url" className="block text-sm text-[#5e574d] mb-1">C2B Confirm URL</label>
    <input
      id="c2b_confirm_url"
      name="c2b_confirm_url"
      value={settings.c2b_confirm_url || ""}
      onChange={handleChange}
      className="border border-[#d7d0c8] p-2 rounded w-full"
    />
  </div>

  <div>
    <label htmlFor="c2b_validate_url" className="block text-sm text-[#5e574d] mb-1">C2B Validate URL</label>
    <input
      id="c2b_validate_url"
      name="c2b_validate_url"
      value={settings.c2b_validate_url || ""}
      onChange={handleChange}
      className="border border-[#d7d0c8] p-2 rounded w-full"
    />
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
