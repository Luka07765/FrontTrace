import React, { useRef } from 'react';

const ColorChangeBox = () => {
  // Create a ref for the box
  const boxRef = useRef(null);

  // Function to change the box color on hover
  const changeColorOnHover = () => {
    if (boxRef.current) {
      // Change background color to blue when hovering over the button
      boxRef.current.style.backgroundColor = 'rgb(37, 99, 235)';
    }
  };

  // Function to revert the box color when the mouse leaves the button
  const revertColorOnLeave = () => {
    if (boxRef.current) {
      // Revert background color to gray when mouse leaves the button
      boxRef.current.style.backgroundColor = 'rgb(209, 213, 219)';
    }
  };

  return (
    <div className="space-y-4">
      {/* Box with initial gray background */}
      <div
        ref={boxRef}
        className="w-24 h-24 bg-gray-300 transition duration-300"
      ></div>

      {/* Button triggers color change on hover */}
      <button
        onMouseEnter={changeColorOnHover} // Change color when mouse enters
        onMouseLeave={revertColorOnLeave} // Revert color when mouse leaves
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Hover over me to change box color
      </button>
    </div>
  );
};

export default ColorChangeBox;
