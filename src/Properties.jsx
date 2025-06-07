import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) {
        console.error('Error fetching properties:', error);
        setError(error);
      } else {
        console.log('Fetched properties:', data);
        setProperties(data);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error fetching properties: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property.id}>{property.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Properties;