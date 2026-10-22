import React from 'react';

export default function VehicleCard({ model, type, pricePerDay, available, onBook }) {
  const icon = type === 'SUV' ? '🚙' : type === 'Sedan' ? '🚘' : '🚗';
  return <article className="vehicle-card">
    <div className="car-visual" aria-hidden="true"><span>{icon}</span><span className="car-type">{type}</span></div>
    <div className="vehicle-info"><div><h3>{model}</h3><p className="muted">{type} · Unlimited kilometres</p></div>
      <div className="vehicle-bottom"><p className="price">₹{Number(pricePerDay).toLocaleString('en-IN')} <span>/ day</span></p>
        {available ? <button className="button button-primary" onClick={onBook}>Book now <span aria-hidden="true">→</span></button> : <span className="badge badge-muted">Not Available</span>}
      </div>
    </div>
  </article>;
}
