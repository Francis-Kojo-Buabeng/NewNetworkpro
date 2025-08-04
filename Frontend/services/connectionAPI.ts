// connectionAPI.ts

import { CONNECTION_API_BASE_URL } from '../constants/Config';

export interface ConnectionRequest {
  requesterId: number;
  receiverId: number;
  connectionId?: number; // Used for accept/reject operations
}

export interface ConnectionResponse {
  id: number;
  requesterId: number;
  receiverId: number;
  status: string; // PENDING, ACCEPTED, REJECTED
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  status: string;
}

// Send a connection request
export async function sendConnectionRequest(request: ConnectionRequest): Promise<ConnectionResponse> {
  console.log('connectionAPI - Sending connection request:', request);
  
  const response = await fetch(`${CONNECTION_API_BASE_URL}/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  console.log('connectionAPI - Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('connectionAPI - Send request failed:', errorData);
    throw new Error(errorData.message || 'Failed to send connection request');
  }
  
  const data: ApiResponse<ConnectionResponse> = await response.json();
  console.log('connectionAPI - Connection request sent successfully:', data.data);
  return data.data;
}

// Accept a connection request
export async function acceptConnectionRequest(request: ConnectionRequest): Promise<ConnectionResponse> {
  console.log('connectionAPI - Accepting connection request:', request);
  
  const response = await fetch(`${CONNECTION_API_BASE_URL}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  console.log('connectionAPI - Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('connectionAPI - Accept request failed:', errorData);
    throw new Error(errorData.message || 'Failed to accept connection request');
  }
  
  const data: ApiResponse<ConnectionResponse> = await response.json();
  console.log('connectionAPI - Connection request accepted successfully:', data.data);
  return data.data;
}

// Reject a connection request
export async function rejectConnectionRequest(request: ConnectionRequest): Promise<ConnectionResponse> {
  console.log('connectionAPI - Rejecting connection request:', request);
  
  const response = await fetch(`${CONNECTION_API_BASE_URL}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  console.log('connectionAPI - Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('connectionAPI - Reject request failed:', errorData);
    throw new Error(errorData.message || 'Failed to reject connection request');
  }
  
  const data: ApiResponse<ConnectionResponse> = await response.json();
  console.log('connectionAPI - Connection request rejected successfully:', data.data);
  return data.data;
}

// Get all connections for a user
export async function getUserConnections(userId: number): Promise<ConnectionResponse[]> {
  console.log('connectionAPI - Getting connections for user:', userId);
  
  const response = await fetch(`${CONNECTION_API_BASE_URL}?userId=${userId}`);
  console.log('connectionAPI - Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('connectionAPI - Get connections failed:', errorData);
    throw new Error(errorData.message || 'Failed to get user connections');
  }
  
  const data: ApiResponse<ConnectionResponse[]> = await response.json();
  console.log('connectionAPI - Connections retrieved successfully:', data.data.length);
  return data.data;
}

// Remove a connection
export async function removeConnection(connectionId: number): Promise<void> {
  console.log('connectionAPI - Removing connection:', connectionId);
  
  const response = await fetch(`${CONNECTION_API_BASE_URL}/${connectionId}`, {
    method: 'DELETE',
  });
  
  console.log('connectionAPI - Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('connectionAPI - Remove connection failed:', errorData);
    throw new Error(errorData.message || 'Failed to remove connection');
  }
  
  console.log('connectionAPI - Connection removed successfully');
}

// Get connection status between two users
export async function getConnectionStatus(requesterId: number, receiverId: number): Promise<string> {
  console.log('connectionAPI - Getting connection status:', { requesterId, receiverId });
  
  const response = await fetch(`${CONNECTION_API_BASE_URL}/status?requesterId=${requesterId}&receiverId=${receiverId}`);
  console.log('connectionAPI - Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('connectionAPI - Get connection status failed:', errorData);
    throw new Error(errorData.message || 'Failed to get connection status');
  }
  
  const data: ApiResponse<string> = await response.json();
  console.log('connectionAPI - Connection status retrieved:', data.data);
  return data.data;
} 