import { useState, useEffect } from 'react';

export default function PatientHistoryModal({ isOpen, onClose, patientId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && patientId) {
      setLoading(true);
      fetch(`http://localhost:5001/api/patients/${patientId}/history`)
        .then(res => res.json())
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load history", err);
          setLoading(false);
        });
    }
  }, [isOpen, patientId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">
            {loading ? 'Loading...' : `${data?.patient?.child_name || 'Patient'}'s Medical History`}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        {loading ? (
          <p className="text-center py-8 text-gray-500">Fetching records from cloud...</p>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 grid grid-cols-2 gap-2">
              <div><span className="font-semibold">Parent Phone:</span> {data?.patient?.parent_phone}</div>
              <div><span className="font-semibold">DOB:</span> {data?.patient?.dob ? new Date(data.patient.dob).toLocaleDateString() : ''}</div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Past Visits & Encounters</h3>
              {data?.visits?.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No visits logged for this profile yet.</p>
              ) : (
                <div className="space-y-3">
                  {data?.visits?.map((visit) => (
                    <div key={visit.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded">
                          Visit Date: {new Date(visit.created_at).toLocaleDateString()} at {new Date(visit.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="font-bold text-green-600 text-sm">₹{visit.fee_collected}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 mt-2"><span className="text-gray-500">Complaint:</span> {visit.chief_complaint}</p>
                      {visit.diagnosis && (
                        <p className="text-sm text-gray-600 mt-1"><span className="text-gray-500">Diagnosis:</span> {visit.diagnosis}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}