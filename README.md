# parkview

The parkview project was developed as part of the coursework for the **SC2006 (Software Engineering)** module at Nanyang Technological University (NTU), Singapore. 

<p align="center">
   <img src="https://github.com/yijisuk/parkview.frontend/assets/63234184/2feef444-63d1-4d49-a018-71f8f377e830" alt="logo" width="300"/>
</p>

**The mobile application is designed to enhance the parking experience by guiding users to the optimal parking location based on their destination and personal preferences. Users can input their intended destination, and parkview will suggest the most suitable parking spot, taking into consideration factors such as proximity and availability.**

This is the frontend repository. The backend repository is accessible [here](https://github.com/yijisuk/parkview.backend).

## Tech Stack

**Frontend**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)

**Backend**: [Node.js](https://nodejs.org/en/) & [Supabase](https://supabase.com/)

## Get the app running

1. Ensure essential libraries and frameworks for the tech stack mentioned above are properly installed on the machine.

2. Install the essential packages from npm:

   ```npm install```

5. Create a ```.env``` file on the root directory to store environment variables - mainly credentials and api keys.

- Using Mac/Linux: ```touch .env```

- Using Windows: ```echo. > .env```

  Details to be included on ```.env``` are:
  ```MARKDOWN
  PARKVIEW_ANNON_KEY=[ANNON KEY for the Supabase DB]
  PARKVIEW_SERVICE_ROLE_KEY=[SERVICE ROLE KEY for the Supabase DB]
  PARKVIEW_STORAGE_BUCKET=[STORAGE BUCKET NAME to store files on Supabase DB]
  
  BACKEND_ADDRESS=[ADDRESS of the server running the backend code]
  
  GOOGLE_API_KEY=[Google Cloud API Key]
  ```

  Visit the following websites:

  - [Supabase](https://supabase.com/) to create a new database project, and get the respective details for ANNON_KEY, SERVICE_ROLE_KEY, and STORAGE_BUCKET

  - [Google Cloud Platform](https://cloud.google.com) to get the API key to access Google Cloud API services

4. Run the backend server; refer to the README on the [backend repository](https://github.com/yijisuk/parkview.backend).
  
   - If the backend server is running on a local machine, get the ip address of the local machine and replace the ```BACKEND_ADDRESS``` on ```.env``` accordingly: ```{BACKEND_ADDRESS}/{PORT_NUMBER}```
     
     - Using Mac/Linux: ```ifconfig```, then search for the ipv4 address associated with either ```en0``` or ```en1```
     - Using Windows: ```ipconfig```, then search for the ipv4 address

7. Run expo on the frontend to emulate the app on either the local machine simulator or a mobile device.

   ```npx expo start```

## Acknowledgement
This repository is publicly available for the purpose of reference. We discourage direct duplication of this code base. In keeping with the open source community ethos, users should give appropriate credit and abide by the terms set forth in the project license when using this project as a reference.
