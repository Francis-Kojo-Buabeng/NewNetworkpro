// Config.ts - Centralized configuration for API endpoints

// Base IP address - Change this to update all API endpoints
export const API_BASE_IP = '10.118.92.22';

// Service ports
export const AUTH_SERVICE_PORT = '8090';
export const USER_SERVICE_PORT = '8092';
export const CONNECTION_SERVICE_PORT = '8093';
export const JOB_SERVICE_PORT = '8094';
export const MESSAGE_SERVICE_PORT = '8095';
export const NOTIFICATION_SERVICE_PORT = '8096';
export const POST_SERVICE_PORT = '8097';

// API Base URLs
export const AUTH_API_BASE_URL = `http://${API_BASE_IP}:${AUTH_SERVICE_PORT}/api/v1/authentication`;
export const USER_API_BASE_URL = `http://${API_BASE_IP}:${USER_SERVICE_PORT}/api/v1/users`;
export const CONNECTION_API_BASE_URL = `http://${API_BASE_IP}:${CONNECTION_SERVICE_PORT}/api/v1/connections`;
export const JOB_API_BASE_URL = `http://${API_BASE_IP}:${JOB_SERVICE_PORT}/api/v1/jobs`;
export const MESSAGE_API_BASE_URL = `http://${API_BASE_IP}:${MESSAGE_SERVICE_PORT}/api/v1/messages`;
export const NOTIFICATION_API_BASE_URL = `http://${API_BASE_IP}:${NOTIFICATION_SERVICE_PORT}/api/v1/notifications`;
export const POST_API_BASE_URL = `http://${API_BASE_IP}:${POST_SERVICE_PORT}/api/v1/posts`;

// User service specific URLs
export const USER_SERVICE_BASE_URL = `http://${API_BASE_IP}:${USER_SERVICE_PORT}`;
export const PROFILE_PICTURES_URL = `${USER_SERVICE_BASE_URL}/profile-pictures`;
export const BANNER_IMAGES_URL = `${USER_SERVICE_BASE_URL}/banner-images`;

// Configuration object for easy access
export const API_CONFIG = {
  baseIP: API_BASE_IP,
  auth: {
    baseUrl: AUTH_API_BASE_URL,
    port: AUTH_SERVICE_PORT
  },
  user: {
    baseUrl: USER_API_BASE_URL,
    port: USER_SERVICE_PORT,
    profilePictures: PROFILE_PICTURES_URL,
    bannerImages: BANNER_IMAGES_URL
  },
  connection: {
    baseUrl: CONNECTION_API_BASE_URL,
    port: CONNECTION_SERVICE_PORT
  },
  job: {
    baseUrl: JOB_API_BASE_URL,
    port: JOB_SERVICE_PORT
  },
  message: {
    baseUrl: MESSAGE_API_BASE_URL,
    port: MESSAGE_SERVICE_PORT
  },
  notification: {
    baseUrl: NOTIFICATION_API_BASE_URL,
    port: NOTIFICATION_SERVICE_PORT
  },
  post: {
    baseUrl: POST_API_BASE_URL,
    port: POST_SERVICE_PORT
  }
}; 