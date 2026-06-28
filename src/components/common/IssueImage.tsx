import React from 'react';
import { PotholePlaceholder } from '../PotholePlaceholder';

interface IssueImageProps {
  src?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const IssueImage: React.FC<IssueImageProps> = ({
  src,
  alt = "Issue",
  className = "w-full h-full object-cover",
  onClick,
  title = ""
}) => {
  const isPothole = 
    !src ||
    src === "/concrete_spall.jpg" ||
    src.includes("Concrete_spall") ||
    src.includes("concrete_spall") ||
    title.toLowerCase().includes("pothole") ||
    title.toLowerCase().includes("rebar") ||
    alt.toLowerCase().includes("pothole") ||
    alt.toLowerCase().includes("rebar");

  if (isPothole) {
    return <PotholePlaceholder className={className} onClick={onClick} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onClick={onClick}
    />
  );
};
export default IssueImage;
