import { useState } from "react";

export const useRandomId = (min: number = 100, max: number = 10000000) => {
  const [id] = useState<string>(() => String(Math.floor(Math.random() * (max - min + 1)) + min))
  
  return id;
};
