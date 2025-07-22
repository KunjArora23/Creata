import React from "react";

const TransactionHistory = () => {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Transaction History</h1>
      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 text-gray-500" colSpan={4}>No transactions yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory; 