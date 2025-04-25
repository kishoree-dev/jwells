import React from 'react';

function ShippingDetails() {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Shipping, Return, Refund & Cancellation Policy</h1>
      <p><strong>Effective Date:</strong> [Insert Date]</p>
      <p className="mt-4">At Hridayam, we strive to offer a seamless and transparent shopping experience. Please review the following policies to understand how we manage shipping, returns, refunds, and cancellations.</p>

      <h2 className="text-xl font-semibold mt-6">Shipping Policy</h2>
      <ul className="list-disc list-inside">
        <li>Orders are typically processed within 1–3 business days.</li>
        <li>Domestic delivery (India): 4–7 business days</li>
        <li>International delivery: 10–15 business days (availability may vary)</li>
        <li>Free shipping on orders above ₹[insert amount] (within India)</li>
        <li>International shipping charges are shown at checkout</li>
        <li>Tracking link is shared via email/SMS once dispatched</li>
      </ul>
      <p className="mt-2 text-sm text-gray-600">Note: Delivery timelines may vary during festive seasons, public holidays, or unforeseen circumstances.</p>

      <h2 className="text-xl font-semibold mt-6">Return & Exchange Policy</h2>
      <ul className="list-disc list-inside">
        <li>Return request must be made within 7 days of delivery</li>
        <li>Items must be unused, unworn, and in original packaging</li>
        <li>Not eligible: Customized items, earrings (for hygiene), sale items (unless defective)</li>
        <li>Size exchange (apparel) or replacement (damaged items) is allowed, subject to availability</li>
        <li>Email us at [insert email] with your order number and reason to initiate return/exchange</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Refund Policy</h2>
      <ul className="list-disc list-inside">
        <li>Refunds are processed after we receive and inspect the returned item</li>
        <li>Refunds are issued to your original payment method within 5–7 business days</li>
        <li>For COD orders, refund is via bank transfer or store credit</li>
        <li>Shipping charges are non-refundable unless return is due to a wrong or defective item</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Order Cancellation Policy</h2>
      <ul className="list-disc list-inside">
        <li>Orders can be cancelled within 12 hours of placement or before shipment</li>
        <li>To cancel, email us at [insert email] with your order number</li>
        <li>Once shipped, cancellation is not possible—you may return it after delivery if eligible</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Need Help?</h2>
      <p>Email: [insert email]</p>
      <p>Phone: [insert phone number]</p>
      <p>Instagram: [insert handle]</p>
      <p>Business Hours: Mon–Sat, 10 AM to 6 PM IST</p>
    </div>
  );
}

export default ShippingDetails;