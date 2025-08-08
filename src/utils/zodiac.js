export const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  export function longitudeToZodiac(longitude) {
    const signIndex = Math.floor((longitude % 360) / 30);
    const sign = zodiacSigns[signIndex];
    const degreeInSign = (longitude % 30).toFixed(2);
    return `${degreeInSign}° ${sign}`;
  }