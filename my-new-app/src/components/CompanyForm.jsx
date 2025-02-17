import React, { useState } from 'react';
import { convertToJSON, submitJSONData } from '../Services/apiService';

export default function CompanyForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    ico: '',
    dic: '',
    street: '',
    city: '',
    zip: '',
    contactName: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    countryCode: '+420',
  });

  const [errors, setErrors] = useState({});

  // Načtení dat z ARES
  const fetchCompanyData = async (ico) => {
    try {
      const response = await fetch(`http://localhost:5000/api/ares/${ico}`);
      if (!response.ok) {
        throw new Error('Chyba při načítání dat z ARES');
      }
      const data = await response.json();

      if (data) {
        console.log('Data z ARES:', data);
        setFormData((prevData) => ({
          ...prevData,
          companyName: data.obchodniJmeno || '',
          dic: data.dic || '',
          street: `${data.sidlo.nazevUlice} ${data.sidlo.cisloDomovni}/${data.sidlo.cisloOrientacni}` || '',
          city: data.sidlo.nazevObce || '',
          zip: data.sidlo.psc || '',
        }));
      } else {
        alert('Žádná data pro zadané IČO nebyla nalezena.');
      }
    } catch (error) {
      console.error('Chyba při načítání dat z proxy serveru:', error);
      alert('Chyba při načítání dat z ARES.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'firstName' || name === 'lastName' || name === 'contactName') && /\d/.test(value)) {
      return;
    }

    if (name === 'phone' && value.length > 12) return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Jméno je povinné.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Příjmení je povinné.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email je povinný.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Neplatný formát emailu.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefonní číslo je povinné.';
    } else if (!/^\d{3} \d{3} \d{3}$/.test(formData.phone)) {
      newErrors.phone = 'Telefonní číslo musí mít formát 123 456 789.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIcoBlur = () => {
    if (formData.ico) {
      fetchCompanyData(formData.ico);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const jsonData = convertToJSON(formData);
      console.log('Vygenerované JSON:', jsonData);

      const result = await submitJSONData(jsonData);
      if (result.success) {
        alert('Data byla úspěšně odeslána.');
      } else {
        alert(result.message);
      }
    } else {
      alert('Opravte chyby ve formuláři.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-blue-50 min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-700 mb-8">Zadejte údaje o společnosti</h2>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-600 font-medium">Název společnosti</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="Název společnosti"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">IČO</label>
            <input
              type="text"
              name="ico"
              value={formData.ico}
              onChange={handleChange}
              onBlur={handleIcoBlur}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="12345678"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">DIČ</label>
            <input
              type="text"
              name="dic"
              value={formData.dic}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="CZ12345678"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Ulice</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="Ulice a číslo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-medium">Město</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                placeholder="Město"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium">PSČ</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                placeholder="123 45"
              />
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-700 mt-6">Osobní údaje</h3>

          <div>
            <label className="block text-gray-600 font-medium">Jméno</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="Jméno"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Příjmení</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="Příjmení"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="email@firma.cz"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Telefon</label>
            <div className="flex">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="+420">+420 (Česko)</option>
                <option value="+421">+421 (Slovensko)</option>
              </select>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-t border-b border-r border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="123 456 789"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300">
            Odeslat
          </button>
        </div>
      </form>
    </div>
  );
}
