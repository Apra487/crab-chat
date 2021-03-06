# Crab Chat

A realtime peer to peer fullstack chat app with real time presence detection system.

## Note

The front-end has been developed as a desktop prototype, and it is meant to be viewd using a desktop view. It was not optimized for mobile . This application is a proof of concept and is not ready for production.

## Tech stack used

- React.js
- Firebase

## Screenshots
<img width="1792" alt="Screenshot 2021-12-22 at 10 05 17 PM" src="https://user-images.githubusercontent.com/54775196/147125341-e51912b8-fd36-4f9a-abf4-1a779ab386f5.png">

<img width="1792" alt="Screenshot 2021-12-23 at 8 19 25 PM" src="https://user-images.githubusercontent.com/54775196/147256995-3a662db7-bc83-4e59-80a2-7348181f65e2.png">

## Development Setup
- Clone the repository and run `npm install` to install the necessary dependencies.
- Get the firebase credtials from the firebase console.
- Create .env file at root level of project and add `REACT_APP_API_KEY`, `REACT_APP_AUTH_DOMAIN`, `REACT_APP_DATABASE_URL`, `REACT_APP_PROJECT_ID`, `REACT_APP_STORAGE_BUCKET`, `REACT_APP_MESSAGING_SENDER_ID`, `REACT_APP_APP_ID`
- Run `npm start` to start the development environment.

## Features
- Google auth for sign in.
- Realtime User Presence System. (🟢 - Online, 🟡 - Away/Idle)
- Realtime message delivery status. 
- ✔️- message was send and present in the server.
- ✔️✔️- messagae was sucessfully delivered to the recipient.
- ✅ -message was read by the recipient.

## Live Demo

Fell free to check it out [here](https://p2p-chat-app-8d25b.web.app/)










