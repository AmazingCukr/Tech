const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export const convertToJSON = (data) => {
  const countryMapping = {
    "+420": "CZ",
    "+421": "SK"
  };

  const countryCode = countryMapping[data.countryCode] || "CZ"; // Výchozí CZ

  return {
    identity: {
      companyCountryCode: countryCode,
      companyRegistrationNumber: data.ico,
    },
    countryCode: countryCode,
    registrationNumber: data.ico,
    name: data.companyName,
    hqAddress: {
      addressLine1: data.street,
      addressLine2: null,
      zipCode: data.zip,
      city: data.city,
      state: null,
      countryCode: countryCode,
    },
    vatPayer: true,
    taxIdsByCountry: {
      [countryCode]: {
        tin: data.dic,
        vatNo: data.dic,
      },
    },
    ownerId: 0, 
    legalPerson: true,
  };
};


export const submitJSONData = async (jsonData) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`, 
      },
      body: JSON.stringify(jsonData),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorMsg = await response.text();
      return { success: false, message: `Chyba: ${errorMsg}` };
    }
  } catch (error) {
    console.error('Chyba při odesílání dat:', error);
    return { success: false, message: 'Nepodařilo se připojit k serveru.' };
  }
};

