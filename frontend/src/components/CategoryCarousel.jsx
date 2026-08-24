import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button.jsx";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "MERN Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "Software Engineer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Cybersecurity Engineer",
  "UI/UX Designer",
  "Product Designer",
  "Product Manager",
  "Business Analyst",
  "QA Engineer",
  "Software Tester",
  "System Administrator",
  "Blockchain Developer",
  "Digital Marketing Specialist",
  "HR Executive",
  "Sales Executive",
  "Business Development Executive",
  "Accountant",
];

const CategoryCarousel = () => {
  return (
    <div>
      <Carousel className="w-full max-w-xl mx-auto my-7">
        <CarouselContent>
          {category.map((cat, index) => (
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Button variant="outlier" clasName="rounded-full">
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
