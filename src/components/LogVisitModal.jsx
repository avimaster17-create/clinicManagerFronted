import { useState } from 'react';

export default function LogVisitModal({ isOpen, onClose, patient, onVisitLogged }) {
  const [formData, setFormData] = useState({
    chief_complaint: '', diagnosis: '', fee_collected: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !patient) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patient.id,
          ...formData
        })
      });
      
      if (response.ok) {
        onVisitLogged(); // Refresh dashboard numbers
        onClose(); 
        setFormData({ chief_complaint: '', diagnosis: '', fee_collected: '' }); 
      }
    } catch (error) {
      console.error("Error logging visit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Log Visit for {patient.child_name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Chief Complaint (Symptoms)</label>
            <input type="text" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={formData.chief_complaint} onChange={(e) => setFormData({...formData, chief_complaint: e.target.value})} 
              placeholder="e.g., Fever and cough for 2 days" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
            <input type="text" className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={formData.diagnosis} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} 
              placeholder="e.g., Viral infection" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fee Collected (₹)</label>
            <input type="number" required min="0" className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={formData.fee_collected} onChange={(e) => setFormData({...formData, fee_collected: e.target.value})} />
          </div>
          
          <button type="submit" disabled={loading} 
            className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 mt-4 transition disabled:bg-green-400">
            {loading ? 'Saving...' : 'Complete Visit'}
          </button>
        </form>
      </div>
    </div>
  );
}