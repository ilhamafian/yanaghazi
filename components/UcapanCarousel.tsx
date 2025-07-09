import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface UcapanCarouselProps {
  ucapanList: Array<{ ucapan: string; nama: string; dates: string }>;
  plugin: React.MutableRefObject<any>;
}

const UcapanCarousel: React.FC<UcapanCarouselProps> = ({
  ucapanList,
  plugin,
}) => (
  <Carousel
    opts={{ align: "start" }}
    orientation="vertical"
    className="w-full max-w-xs"
    plugins={[plugin.current]}
    onMouseEnter={plugin.current.stop}
    onMouseLeave={plugin.current.reset}
  >
    <CarouselContent className="-mt-1 h-[200px]">
      {ucapanList.slice().map((item, idx) => (
        <CarouselItem key={idx} className="pt-1 md:basis-1/2">
          <div className="p-1">
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-lg font-serif italic text-center mb-2">
                  "{item.ucapan}"
                </p>
                <p className="text-sm font-serif text-center">~ {item.nama}</p>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
);

export default UcapanCarousel;
