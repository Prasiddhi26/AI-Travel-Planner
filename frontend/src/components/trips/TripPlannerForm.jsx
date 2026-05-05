import { useState } from "react";
import axios from "../utils/axios";
import LoadingSpinner from "./LoadingSpinner";

const TripForm = ({ onTripGenerated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    source: "",
    destination: "",
    startDate: "",
    endDate: "",
    numberOfDays: "",
    budget: "",
    currency: "INR",
    numberOfTravelers:"",
    travelType: "",
    preferences: "",
    interests: [],
    accommodation: "",
  });

  const tripTypes = [
  "Adventure", "Relaxing", "Cultural",
  "Romantic", "Family", "Solo", "Budget",
];

  const interestOptions = [
    "Museums",
    "Food & Cuisine",
    "Nature",
    "Shopping",
    "Nightlife",
    "History",
    "Architecture",
    "Sports",
    "Photography",
    "Wellness",
  ];

  const accommodationTypes = [
    "Budget Hostel",
    "Boutique Hotel",
    "Luxury Resort",
    "Airbnb",
    "Guesthouse",
    "Camping",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays > 0 ? diffDays : 0;
  };

  const handleSubmit = async () => {
    if (
      !formData.destination ||
      !formData.source ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.budget ||
      !formData.travelType
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const totalDays = calculateDays();

    if (totalDays <= 0) {
      setError("Please select valid travel dates.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        title: `${formData.travelType} Trip to ${formData.destination}`,
        source: formData.source,
        destination: formData.destination,
        numberOfDays: totalDays,
        budget: Number(formData.budget),
        currency: formData.currency,
        startDate: formData.startDate,
        travelType: formData.travelType.toLowerCase(),
        numberOfTravelers: formData.numberOfTravelers,
        preferences:
          formData.preferences ||
          `${formData.interests.join(", ")} | ${formData.accommodation}`,
      };

      const res = await axios.post("/trips", payload);

      onTripGenerated(res.data.trip || res.data.itinerary);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner message="Crafting your perfect itinerary..." />
    );
  }

  return (
    <div className="trip-form-wrapper">
      <h2>Plan Your Journey</h2>

      {error && <p>{error}</p>}

      {step === 1 && (
        <div>
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
          />

          <input
            type="text"
            name="source"
            placeholder="Traveling From"
            value={formData.source}
            onChange={handleChange}
          />

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />

          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <h3>Select Trip Type</h3>
          {tripTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  travelType: type,
                }))
              }
            >
              {type}
            </button>
          ))}

          <h3>Select Interests</h3>
          {interestOptions.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div>
          <textarea
            name="preferences"
            placeholder="Special requests or notes"
            value={formData.preferences}
            onChange={handleChange}
          />

          <h3>Accommodation Preference</h3>
          {accommodationTypes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  accommodation: item,
                }))
              }
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <div>
        {step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}

        {step < 3 ? (
          <button type="button" onClick={() => setStep(step + 1)}>
            Continue
          </button>
        ) : (
          <button type="button" onClick={handleSubmit}>
            Generate Itinerary
          </button>
        )}
      </div>
    </div>
  );
};

export default TripForm;
