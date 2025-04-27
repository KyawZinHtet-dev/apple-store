import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { VariantsWithImagesTags } from "@/lib/infer-types";
import { type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";

type ImagesSliderProps = { images: VariantsWithImagesTags["variantImages"] };
const ImagesSlider = ({ images }: ImagesSliderProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeImage, setActiveImage] = useState<number[]>([0]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("slidesInView", (e) => {
      setActiveImage(e.slidesInView());
    });
  }, [api]);

  return (
    <div className=" flex flex-col gap-4 justify-center items-center w-full">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className=" flex justify-center">
              <Image
                className="rounded-md cursor-pointer"
                src={image.imageUrl}
                alt={image.name}
                width={500}
                height={500}
                priority
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className=" flex gap-2">
        {images.map((image, index) => (
          <Card
            key={index}
            className={cn(
              "rounded-md cursor-pointer",
              index === activeImage[0] && "ring-2 ring-primary"
            )}
          >
            <CardContent className="flex aspect-square items-center justify-center p-1">
              <Image
                onClick={() => api?.scrollTo(index)}
                src={image.imageUrl}
                alt={image.name}
                width={100}
                height={100}
                priority
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImagesSlider;
