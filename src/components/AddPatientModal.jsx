import { useState } from 'react';

export default function AddPatientModal({ isOpen, onClose, onPatientAdded }) {
  const [childName, setChildName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setItemsGender] = useState('Male');
  const [entryDate, setEntryDate] = useState('');
  const [loading, setLoading] = useState(false);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          child_name: childName, 
          parent_phone: parentPhone, 
          dob, 
          gender,
          created_at: entryDate || undefined 
        }),
      });

      if (response.ok) {
        setChildName('');
        setParentPhone('');
        setDob('');
        setEntryDate('');
        onPatientAdded();
        onClose();
      } else {
        alert('Failed to add patient');
      }
    } catch (err) {
      console.error('Error adding patient:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">Add New Patient</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="10-digit phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child's Name</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input 
                type="date" 
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                value={gender}
                onChange={(e) => setItemsGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Historical Entry Date <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">Leave blank to use today's date automatically.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm">
              {loading ? 'Saving...' : 'Save Patient Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}