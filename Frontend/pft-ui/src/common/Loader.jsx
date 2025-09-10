import React from 'react';

export default function Loader({ message = 'Loading...' }) {
  return (
    <p className="text-gray-500 text-center py-4">{message}</p>
  );
}