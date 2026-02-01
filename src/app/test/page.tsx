'use client';

import { useForm } from "react-hook-form";
import { useZwitchPayment } from "@/hooks/useZwitchPayment";
import { User, CheckCircle } from "lucide-react";

export default function MasterclassPage() {
  const { register, handleSubmit } = useForm();
  const { initiateZwitch, isLoading } = useZwitchPayment();

  const onPay = async (data: any) => {
    // Add logic for finalPrice calculation (GST + Base - Discount)
    const finalData = { ...data, amount: 1499 }; 
    await initiateZwitch(finalData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        
        {/* Form Side */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="text-blue-600" /> Personal Details
          </h2>
          <form className="space-y-4">
            <input {...register("firstName")} placeholder="First Name" className="w-full p-4 border rounded-xl" />
            <input {...register("email")} placeholder="Email Address" className="w-full p-4 border rounded-xl" />
            <input {...register("phone")} placeholder="Phone Number" className="w-full p-4 border rounded-xl" />
            
            <button 
              type="button"
              onClick={handleSubmit(onPay)}
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
            >
              {isLoading ? "Redirecting..." : "Proceed to Pay"}
            </button>
          </form>
        </div>

        {/* Pricing Side */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-600">
          <h3 className="font-bold text-gray-500 uppercase text-xs">Order Summary</h3>
          <h1 className="text-xl font-bold mt-2">React & Node.js Masterclass</h1>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between"><span>Base Price</span><span>₹1270.34</span></div>
            <div className="flex justify-between"><span>GST (18%)</span><span>₹228.66</span></div>
            <div className="flex justify-between border-t pt-3 font-bold text-lg text-blue-700">
              <span>Total</span><span>₹1499.00</span>
            </div>
          </div>
          <div className="mt-6 bg-green-50 p-4 rounded-lg flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle size={16} /> 100% Money Back Guarantee
          </div>
        </div>

      </div>
    </div>
  );
}