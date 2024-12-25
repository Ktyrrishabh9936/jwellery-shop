"use client"
import React, { useState, useEffect } from "react";
import "./catlogPriceFilter.css";

const CatlogPriceFilter = ({sliderMinValue=0, sliderMaxValue=1000,setMinVal,setMaxVal,minVal,maxVal}) => {

  const [isDragging, setIsDragging] = useState(false);

  const minGap = 5;

  const slideMin = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= sliderMinValue && maxVal - value >= minGap) {
          setMinVal(value);
        }
      };
    
      const slideMax = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value <= sliderMaxValue && value - minVal >= minGap) {
          setMaxVal(value);
        }
      };
      const setSliderTrack = () => {
        const range = document.querySelector(".slider-track");
    
        if (range) {
          const minPercent =
            ((minVal - sliderMinValue) / (sliderMaxValue - sliderMinValue)) * 100;
          const maxPercent =
            ((maxVal - sliderMinValue) / (sliderMaxValue - sliderMinValue)) * 100;
    
          range.style.left = `${minPercent}%`;
          range.style.right = `${100 - maxPercent}%`;
        }
      };
    
      useEffect(() => {
        setSliderTrack();
      }, [minVal, maxVal,sliderMinValue,sliderMaxValue]);

      const handleMinInput = (e) => {
        const value =
          e.target.value === "" ? sliderMinValue : parseInt(e.target.value, 10);
        if (value >= sliderMinValue && value < maxVal - minGap) {
          setMinInput(value);
          setMinVal(value);
        }
      };
    
      const handleMaxInput = (e) => {
        const value =
          e.target.value === "" ? sliderMaxValue : parseInt(e.target.value, 10);
        if (value <= sliderMaxValue && value > minVal + minGap) {
          setMaxInput(value);
          setMaxVal(value);
        }
      };
    
      const handleInputKeyDown = (e, type) => {
        if (e.key === "Enter") {
          const value = parseInt(e.target.value, 10);
          if (
            type === "min" &&
            value >= sliderMinValue &&
            value < maxVal - minGap
          ) {
            setMinVal(value);
          } else if (
            type === "max" &&
            value <= sliderMaxValue &&
            value > minVal + minGap
          ) {
            setMaxVal(value);
          }
        }
      };

      const startDrag = () => {
        setIsDragging(true);
      };
    
      const stopDrag = () => {
        setIsDragging(false);
      };

      return (
        <div className="double-slider-box">
    
          <div className="range-slider">
            <div className="slider-track"></div>
            <input
              type="range"
              min={sliderMinValue}
              max={sliderMaxValue}
              value={minVal}
              onChange={slideMin}
              onMouseDown={startDrag}
              onMouseUp={stopDrag}
              onTouchStart={startDrag}
              onTouchEnd={stopDrag}
              className="min-val"
            />
            <input
              type="range"
              min={sliderMinValue}
              max={sliderMaxValue}
              value={maxVal}
              onChange={slideMax}
              onMouseDown={startDrag}
              onMouseUp={stopDrag}
              onTouchStart={startDrag}
              onTouchEnd={stopDrag}
              className="max-val"
            />

            {isDragging && <div className="min-tooltip">{minVal}</div>}
            {isDragging && <div className="max-tooltip">{maxVal}</div>}

            
          </div>
          <div className="input-box">
            <div className="min-box">
              <div
                className="min-input"
              >{minVal}</div>
            </div>
            <div className="max-box">
              <div
                className="max-input"
              >{maxVal}</div>
            </div>
          </div>
        </div>
      );
    };
    
    export default CatlogPriceFilter;