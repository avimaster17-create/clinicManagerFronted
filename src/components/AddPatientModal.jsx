import { useState } from 'react';

export default function AddPatientModal({ isOpen, onClose, onPatientAdded }) {
  const [formData, setFormData] = useState({
    parent_phone: '', child_name: '', dob: '', gender: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        onPatientAdded(); // Refresh the dashboard data
        onClose(); // Close the modal
        setFormData({ parent_phone: '', child_name: '', dob: '', gender: '' }); // Reset form
      } else {
        console.error("Failed to add patient");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Patient</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
            <input type="text" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.parent_phone} onChange={(e) => setFormData({...formData, parent_phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Child's Name</label>
            <input type="text" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.child_name} onChange={(e) => setFormData({...formData, child_name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} 
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 mt-4 transition disabled:bg-blue-400">
            {loading ? 'Saving...' : 'Save Patient Record'}
          </button>
        </form>
      </div>
    </div>
  );
}