import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="flex flex-col z-[10] bg-gray-800 text-black py-8">
      {/* Main Flex Container */}
      <div className="flex flex-wrap justify-start pb-10 items-start w-full">
  {/* Left Column */}
  <div className="w-full lg:w-1/2 flex justify-center lg:justify-center">
    <h1 className="text-5xl mt-10 font-light font-[cinzel]">HRIDHAYAM</h1>
  </div>

  {/* Right Column */}
  <div className="w-full lg:w-1/2 flex flex-column font-[lato] gap-8">
    {/* About Section */}
    <div className="flex-1 font-[lato] items-start text-left">
      <h3 className="text-lg font-medium mb-4">ABOUT</h3>
        <Link to='/privacy policy'><p >Privacy Policy</p></Link>
        <Link to='/terms of service'><p >Terms of Service</p></Link>
        <p><Link to='/shipping details'>Shipping, Returns, Refunds and Cancellation Policy</Link></p>
    </div>

    {/* Social Section */}
    <div className="flex-1 items-start text-left">
      <h3 className="text-lg font-medium mb-4">SOCIAL</h3>   
      <div>Facebook</div>
      <div>Instagram</div>  
    </div>

    {/* Contact Section */}
    <div className="flex-1 items-start text-left">
      <h3 className="text-lg font-medium mb-4">CONTACT</h3>
      <div className="space-y-2">
        <p className="text-sm">hridhayamjewels@gmail.com</p>
        <p className="text-sm">+91 9994227430</p>
      </div>
    </div>
  </div>
</div>


      {/* Footer Bottom Section */}
      <div className="border-t border-gray-700 pt-4 mt-4 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} HRIDHAYAM. Designed and Developed by LAUFREL.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
