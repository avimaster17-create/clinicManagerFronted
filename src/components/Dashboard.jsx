import { useState, useEffect } from 'react';
import AddPatientModal from './AddPatientModal';
import LogVisitModal from './LogVisitModal'; 
import PatientHistoryModal from './PatientHistoryModal';

export default function Dashboard() {
  const [stats, setStats] = useState({ total_patients: 0, total_revenue: 0 });
  const [patients, setPatients] = useState([]);
  
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [visitModalState, setVisitModalState] = useState({ isOpen: false, patient: null });
  const [historyPatientId, setHistoryPatientId] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); 

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch('http://localhost:5001/api/dashboard/today');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      const patientsRes = await fetch('http://localhost:5001/api/patients');
      if (patientsRes.ok) {
        const patientsData = await patientsRes.json();
        setPatients(patientsData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredPatients = patients.filter(patient => 
    patient.child_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.parent_phone.includes(searchTerm)
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Clinic Command Center</h1>
        <button 
          onClick={() => setIsAddPatientOpen(true)}
          className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm">
          + Quick Add Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Today's Visits</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total_patients || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Expected Revenue</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">₹{stats.total_revenue || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Patient Database</h3>
          <input 
            type="text" 
            placeholder="Search name or phone..." 
            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-3">Child Name</th>
                <th className="px-6 py-3">Parent Phone</th>
                <th className="px-6 py-3">DOB</th>
                <th className="px-6 py-3">Entry Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No patients found.</td></tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-blue-600 cursor-pointer hover:underline"
                        onClick={() => setHistoryPatientId(patient.id)}>
                      {patient.child_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{patient.parent_phone}</td>
                    <td className="px-6 py-4 text-gray-500">{patient.dob ? new Date(patient.dob).toLocaleDateString() : ''}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setVisitModalState({ isOpen: true, patient: patient })}
                        className="text-sm font-medium text-green-600 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded border border-green-200 transition">
                        Log Visit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddPatientModal 
        isOpen={isAddPatientOpen} 
        onClose={() => setIsAddPatientOpen(false)} 
        onPatientAdded={fetchDashboardData} 
      />
      
      <LogVisitModal 
        isOpen={visitModalState.isOpen} 
        patient={visitModalState.patient}
        onClose={() => setVisitModalState({ isOpen: false, patient: null })} 
        onVisitLogged={fetchDashboardData} 
      />

      <PatientHistoryModal 
        isOpen={!!historyPatientId}
        patientId={historyPatientId}
        onClose={() => setHistoryPatientId(null)}
      />
    </div>
  );
}