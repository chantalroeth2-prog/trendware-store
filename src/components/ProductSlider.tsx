"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import ProductCard from "./ProductCard";
import { Product } from "@/data/products";

interface Props {
  products: Product[];
  title: string;
  subtitle?: string;
}

export default function ProductSlider({ products, title, subtitle }: Props) {
  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        navigation
        freeMode={{ enabled: true, sticky: true }}
        breakpoints={{
          0: { slidesPerView: 1.5 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
