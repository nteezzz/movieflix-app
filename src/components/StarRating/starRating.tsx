import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStarHalfAlt as halfStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";


interface StarRatingProps {
  rating: number;
  count: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, count }) => {
  const maxRating = 5;
  const starElements = [];

  // Calculate the number of full stars
  const fullStars = Math.floor(rating / 2);

  // Check if there's a half star
  const hasHalfStar = rating % 2 !== 0;

  // Check if the rating is a whole number
  const isWholeNumber = rating % 1 === 0;

  for (let i = 0; i < maxRating; i++) {
    if (i < fullStars) {
      starElements.push(
        <FontAwesomeIcon key={i} icon={solidStar} className="text-red-800" />
      );
    } else if (hasHalfStar && !isWholeNumber && i === fullStars) {
      starElements.push(
        <FontAwesomeIcon key={i} icon={halfStar} className="text-red-800" />
      );
    } else {
      starElements.push(
        <FontAwesomeIcon key={i} icon={regularStar} className="text-red-800" />
      );
    }
  }

  return <div className="flex ">{starElements}{`(${count})`}</div>;
};

export default StarRating;
