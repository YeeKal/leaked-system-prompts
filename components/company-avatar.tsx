"use client"; // If using hashing for color generation that runs client-side
import { Avatar } from "@/components/ui/avatar";

// Simple hash function to get a number from a string
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate a gradient based on the hash
const getGradient = (companyName: string): string => {
  const hash = simpleHash(companyName);
  const h1 = hash % 360;
  const h2 = (hash * 7) % 360; // Get a different hue
  const s = 70 + (hash % 30); // Saturation 70-100%
  const l1 = 50 + (hash % 10); // Lightness 50-60%
  const l2 = 60 + (hash % 10); // Lightness 60-70%
  return `linear-gradient(135deg, hsl(${h1}, ${s}%, ${l1}%), hsl(${h2}, ${s}%, ${l2}%))`;
};

interface CompanyAvatarProps {
  companyName: string;
  className?: string;
}

export default function CompanyAvatar({ companyName, className }: CompanyAvatarProps) {
  const initial = companyName ? companyName.charAt(0).toUpperCase() : "?";
  const gradientStyle = {
    background: getGradient(companyName),
  };

  return (
    <Avatar className={className}>
      <div
        className="w-full h-full flex items-center justify-center text-white font-semibold"
        style={gradientStyle}
      >
        {initial}
      </div>
      {/* <AvatarFallback >{initial}</AvatarFallback> */}
    </Avatar>
  );
}