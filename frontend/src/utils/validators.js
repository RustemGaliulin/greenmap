import {Filter} from "bad-words";
import DOMPurify from "dompurify";
import validator from "validator";

const filter = new Filter();


filter.removeWords("hell");


export function validateLocationInput({ name, description, latitude, longitude }) {

  const cleanName = DOMPurify.sanitize(name || "");
  const cleanDescription = DOMPurify.sanitize(description || "");


  if (filter.isProfane(cleanName) || filter.isProfane(cleanDescription))
    return "❌ Please remove inappropriate language.";


  const suspicious = /(eval\s*\(|rm\s+-rf|system\s*\(|exec\s*\(|<script>|<\/script>)/i;
  if (suspicious.test(cleanName) || suspicious.test(cleanDescription))
    return "❌ Suspicious or unsafe content detected.";


  if (!validator.isFloat(latitude + "") || !validator.isFloat(longitude + ""))
    return "❌ Latitude and longitude must be numbers.";

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (lat < -90 || lat > 90) return "❌ Latitude must be between -90 and 90.";
  if (lon < -180 || lon > 180) return "❌ Longitude must be between -180 and 180.";

  return null;
}
