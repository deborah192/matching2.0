const BASE_URL = 'https://delivery-api-production-4951.up.railway.app/api';

// Find Matches for a Parcel
const findMatchesForParcel = async (from, to, weight) => {
  const response = await fetch(`${BASE_URL}/travellers`);
  const travellers = await response.json();

  // Filter travellers based on matching criteria
  return travellers.filter(
    (traveller) =>
      traveller.from.toLowerCase() === from.toLowerCase() &&
      traveller.to.toLowerCase() === to.toLowerCase() &&
      traveller.availableSpace >= weight
  );
};

// Update Traveller List
const updateTravellerList = async () => {
  const response = await fetch(`${BASE_URL}/travellers`);
  const travellers = await response.json();

  const travellerList = document.getElementById('traveller-list');
  travellerList.innerHTML = '';

  travellers.forEach((traveller) => {
    const li = document.createElement('li');
    li.textContent = `From: ${traveller.from}, To: ${traveller.to}, Space: ${traveller.availableSpace}kg, Date: ${new Date(
      traveller.travelDate
    ).toLocaleDateString()}`;
    li.addEventListener('click', () => alert(`Traveller Details: ${JSON.stringify(traveller)}`));
    travellerList.appendChild(li);
  });
};

// Update Parcel List
const updateParcelList = async () => {
  const response = await fetch(`${BASE_URL}/parcels`);
  const parcels = await response.json();

  const parcelList = document.getElementById('parcel-list');
  parcelList.innerHTML = '';

  parcels.forEach((parcel) => {
    const li = document.createElement('li');
    li.textContent = `From: ${parcel.from}, To: ${parcel.to}, Weight: ${parcel.weight}kg`;
    li.addEventListener('click', () => alert(`Parcel Details: ${JSON.stringify(parcel)}`));
    parcelList.appendChild(li);
  });
};

// Create Parcel
document.getElementById('parcel-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const from = document.getElementById('parcel-from').value;
  const to = document.getElementById('parcel-to').value;
  const description = document.getElementById('parcel-description').value;
  const weight = parseInt(document.getElementById('parcel-weight').value, 10);

  // Step 1: Find Matches
  const matches = await findMatchesForParcel(from, to, weight);
  const matchSection = document.getElementById('match-section');
  const matchTitle = document.getElementById('match-title');
  const matchList = document.getElementById('match-list');

  if (matches.length > 0) {
    // Display Matches
    matchTitle.style.display = 'block';
    matchList.innerHTML = '';
    matches.forEach((match) => {
      const li = document.createElement('li');
      li.textContent = `From: ${match.from}, To: ${match.to}, Space: ${match.availableSpace}kg, Date: ${new Date(
        match.travelDate
      ).toLocaleDateString()}`;
      li.addEventListener('click', () => alert(`Traveller Match Details: ${JSON.stringify(match)}`));
      matchList.appendChild(li);
    });
  } else {
    // No Matches Found, Create Parcel
    alert('No match found. A new parcel has been created and added to the list.');

    await fetch(`${BASE_URL}/parcels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, description, weight }),
    });

    // Update Parcel List
    updateParcelList();
  }
});

// Initialize Lists on Load
document.addEventListener('DOMContentLoaded', () => {
  updateTravellerList();
  updateParcelList();
});
