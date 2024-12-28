import { useEffect, useState } from "react";
import axios from "axios";

type Ticket = {
  ticket: string;
  count: number;
};

type OrderItem = {
  id: string;
  retailerID: string;
  lotteryName: string;
  drawDate: string;
  type?: string;
  price: number;
  tickets: Ticket[];
};

type OrderHistoryItem = {
  orders: OrderItem[];
  orderDate: string;
  totalAmount: number;
};

type Retailer = {
  phone: string;
  name: string;
  email: string;
  address: string;
  rating: string;
  about?: string;
  orderHistory: OrderHistoryItem[];
};

const AdminPortal = () => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/retailersData`);
        if (!response) {
          throw new Error("Failed to fetch retailers");
        }
        setRetailers(response.data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRetailers();
  }, []);

  const calculateRetailerStats = (retailer: Retailer) => {
    let totalAmount = 0;
    let totalTicketsSold = 0;
    const ticketCategoryCount: { [key: string]: number } = {};

    retailer.orderHistory.forEach((orderHistoryItem) => {
      totalAmount += orderHistoryItem.totalAmount;

      orderHistoryItem.orders.forEach((order) => {
        order.tickets.forEach((ticket) => {
          totalTicketsSold += ticket.count;

          if (ticket.count in ticketCategoryCount) {
            ticketCategoryCount[ticket.count] += 1;
          } else {
            ticketCategoryCount[ticket.count] = 1;
          }
        });
      });
    });

    const commission = totalAmount * 0.1;
    return { totalAmount, commission, totalTicketsSold, ticketCategoryCount };
  };

  if (loading) return (<div className="h-screen flex items-center justify-center bg-black text-white">
  <div className="loader bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-lg">
    <h1 className="text-2xl font-bold mb-4">Loading...</h1>
    <p className="text-sm">Please wait while we load the data.</p>
  </div>
</div>);
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">FullToss Admin Portal</h1>
      <div className="space-y-6 max-w-4xl mx-auto">
        {retailers.map((retailer, index) => {
          const {
            totalAmount,
            commission,
            totalTicketsSold,
            ticketCategoryCount,
          } = calculateRetailerStats(retailer);

          return (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-300"
            >
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
                {retailer.name}
            </h2>
            <div className="space-y-4">
                <div>
                <label className="block font-medium text-gray-600">Phone:</label>
                <p className="text-gray-800">{retailer.phone}</p>
                </div>
                <div>
                <label className="block font-medium text-gray-600">Email:</label>
                <p
                    className="text-gray-800 truncate"
                    title={retailer.email} // Tooltip in case email is long
                >
                    {retailer.email}
                </p>
                </div>
                <div>
                <label className="block font-medium text-gray-600">Address:</label>
                <p className="text-gray-800">{retailer.address}</p>
                </div>
                <div className="flex items-center">
                <label className="font-medium text-gray-600">Rating:</label>
                <p className="text-green-600 ml-2 flex items-center text-xl">
                    {retailer.rating} <span className="ml-1 text-yellow-500">⭐</span>
                </p>
                </div>
            </div>

              {/* Retailer Statistics */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-indigo-600">Retailer Statistics</h3>
                <div className="space-y-4 mt-4">
                    <div className="bg-indigo-50 p-4 rounded-lg shadow-md text-center">
                    <p className="text-gray-600 font-medium">Total Tickets Sold</p>
                    <p className="text-indigo-700 text-2xl font-semibold">{totalTicketsSold}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg shadow-md text-center">
                    <p className="text-gray-600 font-medium">Total Amount (₹)</p>
                    <p className="text-green-600 text-2xl font-semibold">{totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg shadow-md text-center">
                    <p className="text-gray-600 font-medium">Commission (₹)</p>
                    <p className="text-yellow-600 text-2xl font-semibold">{commission.toFixed(2)}</p>
                    </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-600">Ticket Categories:</h4>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {Object.entries(ticketCategoryCount).map(([category, count]) => (
                      <li
                        key={category}
                        className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                      >
                        <span>{category} tickets sold</span>
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                          {count}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPortal;
