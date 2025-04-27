"use client";

import { useNode } from "@craftjs/core";
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { useState, useRef, useEffect } from 'react';
import BlockContainer from '../editor/BlockContainer';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// Add custom styles to ensure draggability in editor
const editorStyles = `
  .craftjs-node-root.craftjs-node-hover.slider-root::after {
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
  .slider-container .swiper-wrapper {
    pointer-events: none !important;
  }
  .slider-container .swiper-pagination,
  .slider-container .swiper-button-next,
  .slider-container .swiper-button-prev {
    pointer-events: none !important;
  }
`;

export const SliderBlock = ({ 
  slides,
  effect = 'slide',
  autoplay = true,
  delay = 3000,
  isEditor = true
}: { 
  slides: string[],
  effect?: 'slide' | 'fade',
  autoplay?: boolean,
  delay?: number,
  isEditor?: boolean
}) => {
  const { connectors: { connect, drag }, id } = useNode((node) => ({
    id: node.id
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);

  // For debugging - log when component renders with what slides
  useEffect(() => {
    console.log('SliderBlock rendering with slides:', slides, 'ID:', id);
  }, [slides, id]);

  useEffect(() => {
    if (ref.current) {
      console.log('Connecting drag ref for slider', id);
      connect(drag(ref.current));
    }
  }, [connect, drag, id]);

  // Listen for device change events to update the slider
  useEffect(() => {
    const handleDeviceChange = () => {
      console.log('Device changed, updating slider');
      // Force re-render of the slider
      setForceUpdate(prev => prev + 1);
      
      // If we have a reference to the swiper, update it
      if (swiperRef.current) {
        setTimeout(() => {
          swiperRef.current.update();
          swiperRef.current.updateSize();
          console.log('Swiper updated after device change');
        }, 300); // Wait for the device transition to complete
      }
    };

    document.addEventListener('device-change', handleDeviceChange as EventListener);
    
    return () => {
      document.removeEventListener('device-change', handleDeviceChange as EventListener);
    };
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    console.log('Drag start on slider');
    // Stop event propagation so Swiper doesn't interfere
    e.stopPropagation();
  };

  return (
    <>
      {isEditor && (
        <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
      )}
      <BlockContainer>
        <div
          ref={ref}
          className="slider-container w-full rounded-lg overflow-hidden relative slider-root"
          data-type="slider"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          key={`slider-container-${forceUpdate}`}
        >
          {isEditor && (
            <div 
              className="absolute inset-0 z-50 cursor-move bg-transparent" 
              style={{ pointerEvents: 'all' }}
              onMouseDown={(e) => e.stopPropagation()}
            ></div>
          )}
          <Swiper
            modules={[Pagination, Navigation, Autoplay, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            effect={effect === 'fade' ? 'fade' : undefined}
            pagination={{ clickable: true }}
            navigation
            autoplay={autoplay ? { delay, disableOnInteraction: false } : false}
            className="w-full"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsLoading(false);
            }}
            simulateTouch={!isEditor}
            allowTouchMove={!isEditor}
            key={`swiper-${forceUpdate}`}
          >
            {slides && slides.length > 0 ? (
              slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-[300px]">
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    <Image 
                      src={slide} 
                      alt={`Slide ${index}`} 
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onLoad={() => setIsLoading(false)}
                      className="transition-opacity duration-300"
                    />
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="relative w-full h-[300px] bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No slides available</p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </BlockContainer>
    </>
  );
};

SliderBlock.craft = {
  props: {
    slides: [
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000&auto=format&fit=crop"
    ],
    effect: 'slide',
    autoplay: true,
    delay: 3000,
    isEditor: true
  },
  displayName: "Slider",
};
