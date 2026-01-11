import React from 'react';
import Image from 'next/image';

interface VisualizationCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export function VisualizationCard({ title, description, imageSrc, imageAlt }: VisualizationCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex-shrink-0">
        <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="relative w-full h-64 bg-gray-50 flex-grow">
        {/* Using standard img for now to avoid dealing with next/image width/height strictness if assets vary, 
            but for production next/image is better. I'll use next/image with fill. */}
        <div className="relative w-full h-full p-4">
           <Image 
             src={imageSrc} 
             alt={imageAlt} 
             fill
             className="object-contain"
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
           />
        </div>
      </div>
    </div>
  );
}
