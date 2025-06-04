"use client";

import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { ResumeTemplateProps } from "./types";
import useDimensions from "@/hooks/useDimensions";
import "./Template4.css";

export default function Template4({
  resumeData,
  contentRef,
  className,
}: ResumeTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const { photo, firstName, lastName, jobTitle } = resumeData;
  
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [photo]);

  return (
    <div
      className={cn(
        "print-resume aspect-[210/297] h-fit w-full bg-white text-black template4-container",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("h-full", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          colorAdjust: "exact",
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        {/* Header - Thông tin cá nhân */}
        <div className="flex flex-col p-6 pb-2 template4-header" style={{ backgroundColor: resumeData.colorHex || '#1e7b77' }}>
          <div className="flex">
            {/* Thông tin bên trái */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-1">
                {firstName} {lastName}
              </h1>
              <h2 className="text-xl text-white opacity-90 mb-3">
                {jobTitle}
              </h2>
              <p className="text-sm text-white opacity-95 max-w-lg">
                {resumeData.summary}
              </p>
            </div>
            
            {/* Ảnh và thông tin liên hệ */}
            <div className="flex flex-col items-end gap-3 ml-4">
            {photoSrc && (
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={photoSrc}
                  alt={`${firstName} ${lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
              <div className="flex flex-col items-end mt-2">
                {resumeData.phone && (
                  <p className="text-sm text-white flex items-center gap-1">
                    <span>{resumeData.phone}</span>
                    <span className="text-xs">📱</span>
                  </p>
              )}
              {resumeData.email && (
                  <p className="text-sm text-white flex items-center gap-1">
                    <span>{resumeData.email}</span>
                    <span className="text-xs">✉️</span>
                  </p>
              )}
              {resumeData.city && (
                  <p className="text-sm text-white flex items-center gap-1">
                    <span>
                    {resumeData.city}
                    {resumeData.country && `, ${resumeData.country}`}
                  </span>
                    <span className="text-xs">📍</span>
                  </p>
                )}
              </div>
          </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex p-6 pt-4">
          {/* Main Content - 2/3 */}
          <div className="w-2/3 pr-6">
            {/* Work Experience */}
            <div className="mb-4">
              <h2 className="text-lg font-bold uppercase mb-3 border-b-2 pb-1 template4-section-title" style={{ borderColor: resumeData.colorHex || '#1e7b77', color: resumeData.colorHex || '#1e7b77' }}>
                Kinh nghiệm làm việc
            </h2>
            {resumeData.workExperiences?.map((experience, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-gray-800 text-base">
                      {experience.position}
                  </h3>
                    <p className="text-xs text-gray-600">
                      {experience.startDate && formatDate(new Date(experience.startDate), "MM/yyyy")} - {experience.endDate ? formatDate(new Date(experience.endDate), "MM/yyyy") : "Hiện tại"}
                    </p>
                </div>
                  <p className="text-sm text-gray-700 italic mb-1">{experience.company}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {experience.description}
                </p>
              </div>
            ))}
          </div>

            {/* Education */}
            <div className="mb-4">
              <h2 className="text-lg font-bold uppercase mb-3 border-b-2 pb-1 template4-section-title" style={{ borderColor: resumeData.colorHex || '#1e7b77', color: resumeData.colorHex || '#1e7b77' }}>
                Học vấn
              </h2>
              {resumeData.educations?.map((education, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-base">
                      {education.degree}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {education.startDate && formatDate(new Date(education.startDate), "yyyy")} - {education.endDate ? formatDate(new Date(education.endDate), "yyyy") : "Hiện tại"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">{education.school}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar - 1/3 */}
          <div className="w-1/3 pl-4 border-l border-gray-200">
            {/* Skills */}
          <div className="mb-6">
              <h2 className="text-lg font-bold uppercase mb-3 border-b-2 pb-1 template4-section-title" style={{ borderColor: resumeData.colorHex || '#1e7b77', color: resumeData.colorHex || '#1e7b77' }}>
                Kỹ năng
            </h2>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills?.map((skill, index) => (
                  <span 
                    key={index} 
                    className="template4-skill-tag"
                    style={{ backgroundColor: resumeData.colorHex || '#1e7b77' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Short Term Goals */}
            {resumeData.shortTermGoals && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase mb-3 border-b-2 pb-1 template4-section-title" style={{ borderColor: resumeData.colorHex || '#1e7b77', color: resumeData.colorHex || '#1e7b77' }}>
                  Mục tiêu ngắn hạn
                </h2>
                <p className="text-sm text-gray-600">{resumeData.shortTermGoals}</p>
              </div>
            )}
            
            {/* Long Term Goals */}
            {resumeData.longTermGoals && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase mb-3 border-b-2 pb-1 template4-section-title" style={{ borderColor: resumeData.colorHex || '#1e7b77', color: resumeData.colorHex || '#1e7b77' }}>
                  Mục tiêu dài hạn
                </h2>
                <p className="text-sm text-gray-600">{resumeData.longTermGoals}</p>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 