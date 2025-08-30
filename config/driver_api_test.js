
// http://api.shreeswamisamarthevents.com/api/driver-register
{
    "driver_document_id":"3",
      "driver_full_name": "Michael Smith", 
      "driver_availability":"1",
      "driver_email": "michael.smith@example.com", 
      "driver_mobile": "+1987654321",
      "driver_address": "123 Main St",
      "driver_district_id": "26",
      "driver_state_id": "14",
      "driver_village": "Hadapsar",
      "driver_country_id": "76",
      "driver_aadhar_number": "AADHAR1234567890",
      "driver_vehicle_number": "CA-1234-XYZ",
      "driver_vehicle_name": "Toyota Prius",
      "driver_vehicle_model": "2023",
      "driver_vehicle_fuel_type": "Hybrid",
      "driver_language": "en",
      "driver_vehicle_color": "Blue",
      "driver_vehicle_licence": "sam.png",
      "driver_vehicle_insurance": "ss",
      "driver_vehicle_rc": "ss",
      "driver_vehicle_photo": "ss",
      "driver_photo": "ss",
      "driver_device_id": "device_002",
      "driver_device_token":"driver_device_token_123", 
      "driver_password": "jeeyoride@2025",
      "created_at": "2025-05-20T08:30:00Z",
      "driver_active_status": true,
      "driver_vehicle_id": "1",
      "updated_at": "2025-05-21T09:00:00Z",
      "driver_latitude": 37.7800,
      "driver_longitude": -122.4200
}

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


http://api.shreeswamisamarthevents.com/api/driver-login-send-otp

{
     "phone": "9876543210",
     "driver_device_id":"asklkasjdkjaslkdaklsdjnaskndjojlmdlaksdlkmlasmdlklmlmaldknmlad",
     "latitude": "28.6139",
     "longitude": "77.2090"
}

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


// http://api.shreeswamisamarthevents.com/api/driver-verify-otp

{
  "phone": "7507500931",
  "otp": 3546
}


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

http://localhost:5000/api/driver_on_duty_off_duty
{
  "driverid": "7",
  "availability": 1
}
