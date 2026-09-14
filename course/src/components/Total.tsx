import type { CoursePart } from '../types';
interface TotalProps {
  courseParts: CoursePart[];
}

const Total = ({ courseParts }: TotalProps) => {
  const total = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
  return <p>Number of exercises {total}</p>;
};

export default Total;