import React from "react";
import contactImage from "../assets/section-4.png"; // Import your image

const Contact = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 lg:px-20 py-12 bg-gray-100">
      {/* Left Side: Contact Details */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">Contact Us</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full text-gray-700">
          <p className="text-xl font-medium mb-4">Name: <span className="font-normal">Kaviya mahesh</span></p>
          <p className="text-xl font-medium mb-4">Contact No: <span className="font-normal">+91 9994227430</span></p>
          <p className="text-xl font-medium">Email: <span className="font-normal">kaviyamaheshv@gmail.com</span></p>
        </div>
      </div>

      {/* Right Side: Image (Hidden on Mobile) */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={contactImage}
          alt="Contact"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default Contact;
