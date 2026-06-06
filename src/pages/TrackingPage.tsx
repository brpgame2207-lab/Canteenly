import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, Package, Utensils, CheckCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

export const TrackingPage = () => {
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const statuses = [
    { label: 'Order Confirmed', description: 'Canteen is verifying your order', icon: CheckCircle2 },
    { label: 'Preparing', description: 'Chef is preparing your delicious meal', icon: Utensils },
    { label: 'Ready for Pickup', description: 'Order ready at Counter 4', icon: Package },
    { label: 'Completed', description: 'Enjoy your meal!', icon: CheckCheck },
  ];

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Preparing':
        return 1;
      case 'Ready':
        return 2;
      case 'Delivered':
      case 'Completed':
        return 3;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const fetchLatestOrder = async () => {
      const token = localStorage.getItem('canteenly_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await res.json();
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          setLatestOrder(resData.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch latest order:', err);
      }
      setIsLoading(false);
    };

    fetchLatestOrder();
    const interval = setInterval(fetchLatestOrder, 3000);
    return () => clearInterval(interval);
  }, []);

  const statusIndex = latestOrder ? getStatusIndex(latestOrder.status) : 0;

  const getItemPrepTime = (itemId: string) => {
    const idHash = String(itemId).charCodeAt(0) || 0;
    return 10 + (idHash % 25);
  };

  const maxPrepTime = latestOrder?.items
    ? latestOrder.items.reduce((max: number, item: any) => {
        const itemPrep = getItemPrepTime(item.menuItemId?._id || item.menuItemId || '1');
        return itemPrep > max ? itemPrep : max;
      }, 0)
    : 15;

  const downloadReceipt = () => {
    if (!latestOrder) return;
    
    const doc = new jsPDF();
    const token = `CN-${latestOrder.tokenNumber || 'N/A'}`;
    const dateStr = new Date(latestOrder.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeStr = new Date(latestOrder.createdAt).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Add receipt header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 107, 0); // Brand Orange
    doc.text('CANTEENLY', 105, 20, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Smart Canteen Management System', 105, 26, { align: 'center' });

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 32, 190, 32);

    // Order Info block
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text('Order Details:', 20, 42);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Token Number: ${token}`, 20, 48);
    doc.text(`Date: ${dateStr}`, 20, 54);
    doc.text(`Time: ${timeStr}`, 20, 60);
    doc.text(`Status: ${latestOrder.status}`, 20, 66);

    // Items table header
    doc.setFont('Helvetica', 'bold');
    doc.text('Item Name', 20, 80);
    doc.text('Qty', 120, 80, { align: 'center' });
    doc.text('Price', 150, 80, { align: 'right' });
    doc.text('Total', 190, 80, { align: 'right' });

    doc.line(20, 83, 190, 83);

    // Items rows
    doc.setFont('Helvetica', 'normal');
    let y = 90;
    latestOrder.items.forEach((item: any) => {
      const name = item.menuItemId?.name || 'Delicious Meal';
      const qty = item.quantity;
      const price = item.price;
      const total = price * qty;

      doc.text(name, 20, y);
      doc.text(String(qty), 120, y, { align: 'center' });
      doc.text(`Rs. ${price}`, 150, y, { align: 'right' });
      doc.text(`Rs. ${total}`, 190, y, { align: 'right' });
      y += 8;
    });

    doc.line(20, y - 4, 190, y - 4);

    // Calculations block
    const subtotal = latestOrder.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const taxes = Math.round(subtotal * 0.05);

    doc.setFont('Helvetica', 'normal');
    doc.text('Subtotal:', 150, y + 4, { align: 'right' });
    doc.text(`Rs. ${subtotal}`, 190, y + 4, { align: 'right' });

    doc.text('GST (5%):', 150, y + 10, { align: 'right' });
    doc.text(`Rs. ${taxes}`, 190, y + 10, { align: 'right' });

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total Paid:', 150, y + 18, { align: 'right' });
    doc.text(`Rs. ${latestOrder.totalAmount}`, 190, y + 18, { align: 'right' });

    // Footer divider
    doc.line(20, y + 24, 190, y + 24);

    // Footer note
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Please display this token number at the pickup counter.', 105, y + 32, { align: 'center' });
    doc.text('Thank you for ordering with Canteenly!', 105, y + 38, { align: 'center' });

    // Save PDF
    doc.save(`canteenly_receipt_${token}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-brand font-bold">
        Loading tracking details...
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto text-center">
      <div className="relative mb-12">
         {/* Animated Ring */}
         <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="h-40 w-40 rounded-full border border-brand/50 bg-brand/5"
            />
         </div>
         <div className="relative mx-auto h-32 w-32 rounded-full premium-gradient flex items-center justify-center shadow-2xl shadow-brand/40">
             <motion.div
               key={statusIndex}
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-white"
             >
                {React.createElement(statuses[statusIndex].icon, { size: 48 })}
             </motion.div>
         </div>
      </div>

      <div className="mb-12">
         <h1 className="text-3xl font-bold text-white mb-2">{statuses[statusIndex].label}</h1>
         <p className="text-neutral-400">{statuses[statusIndex].description}</p>
      </div>

      <div className="glass-card p-6 rounded-3xl mb-12">
         <div className="flex justify-between items-center mb-8">
            <div className="text-left">
               <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Token Number</p>
               <h2 className="text-2xl font-bold text-brand">CN-{latestOrder?.tokenNumber || '842'}</h2>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Estimated Wait</p>
               <div className="flex items-center gap-2 text-white font-bold">
                  <Clock size={16} className="text-brand" />
                  <span>{statusIndex === 3 ? 'Ready!' : `${maxPrepTime} mins`}</span>
               </div>
            </div>
         </div>

         {/* Steps Visual */}
         <div className="relative flex justify-between">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 -z-10" />
            <motion.div 
               className="absolute top-1/2 left-0 h-0.5 bg-brand -translate-y-1/2 -z-10"
               initial={{ width: '0%' }}
               animate={{ width: `${(statusIndex / (statuses.length - 1)) * 100}%` }}
               transition={{ duration: 1 }}
            />
            
            {statuses.map((_, i) => (
               <div 
                  key={i}
                  className={cn(
                    "h-4 w-4 rounded-full border-4 transition-colors duration-500",
                    i <= statusIndex ? "bg-brand border-black" : "bg-neutral-800 border-black"
                  )}
               />
            ))}
         </div>
      </div>

      <div className="flex flex-col gap-4 max-w-xs mx-auto">
         <Button variant="secondary" className="rounded-2xl h-12 text-sm font-bold shadow-lg" onClick={downloadReceipt}>
           Download Receipt
         </Button>
         <Link to="/menu" className="text-sm font-medium text-brand hover:underline">
           Back to Menu
         </Link>
      </div>
    </div>
  );
};
