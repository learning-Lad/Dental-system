import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency, backendUrl } = useContext(AppContext)

  const [prescriptionText, setPrescriptionText] = useState('')
  const [editPrescriptionId, setEditPrescriptionId] = useState(null)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  // Function to save prescription
  const handlePrescriptionSubmit = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/prescription',
        { appointmentId, prescription: prescriptionText },
        { headers: { dToken } }
      )
      if (data.success) {
        toast.success(data.message)
        setEditPrescriptionId(null) // Close the box
        getAppointments() // Refresh data to show updated prescription
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        
        {/* Table Header */}
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => (
          // WRAPPER DIV: Handles the border and grouping the row + prescription box
          <div className='border-b hover:bg-gray-50' key={index}>
            
            {/* Existing Appointment Row */}
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6'>
              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
              </div>
              <div>
                <p className='text-xs inline border border-primary px-2 rounded-full'>
                  {item.payment ? 'Online' : 'CASH'}
                </p>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <p>{currency}{item.amount}</p>
              
              {/* ACTION COLUMN */}
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <div className='flex items-center gap-2'>
                      {/* Cancel Button */}
                      <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} title="Cancel Appointment" alt="" />
                      
                      {/* Complete Button */}
                      <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} title="Mark Completed" alt="" />
                      
                    </div>
              }

               {/* Prescription Icon/Button - Visible for Active & Completed appointments */}
               {!item.cancelled && (
                 <button 
                  onClick={() => {
                    if (editPrescriptionId === item._id) {
                      setEditPrescriptionId(null) // Toggle close
                    } else {
                      setEditPrescriptionId(item._id) // Open
                      setPrescriptionText(item.prescription || '') // Load existing text
                    }
                  }}
                  className='text-primary text-xs border border-primary px-2 py-1 rounded hover:bg-primary hover:text-white transition-all ml-2'
                 >
                   Rx
                 </button>
               )}
            </div>

            {/* PRESCRIPTION BOX - Only visible if 'Rx' is clicked */}
            {editPrescriptionId === item._id && (
              <div className='px-6 py-4 bg-gray-50 border-t border-gray-100'>
                <p className='text-xs font-medium text-gray-700 mb-2'>Prescription for {item.userData.name}:</p>
                <textarea 
                  className='w-full border border-gray-300 rounded p-2 text-sm focus:outline-primary' 
                  rows={3} 
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  placeholder="Write prescription here..."
                />
                <div className='flex gap-2 mt-2 justify-end'>
                  <button onClick={() => setEditPrescriptionId(null)} className='px-3 py-1 border rounded text-xs text-gray-500'>Cancel</button>
                  <button onClick={() => handlePrescriptionSubmit(item._id)} className='px-3 py-1 bg-primary text-white rounded text-xs'>Save Prescription</button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  )
}

export default DoctorAppointments