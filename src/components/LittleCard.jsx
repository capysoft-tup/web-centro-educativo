import React from "react";
import "../styles/LittleCard.css";

const LittleCard = ({
    title,
    location,
    date,
    color
}) => {
    // Dividir la fecha en día y mes (ej. "15 JUL" -> ["15", "JUL"])
    const [day, month] = date ? date.split(' ') : ['', ''];

    return (
        <div
            className="little-card"
            style={{
                background: `linear-gradient(to right, #f4f6f9 40%, ${color}1A 100%)`
            }}
        >
            <div className="little-card-date" style={{ backgroundColor: color }}>
                <span className="date-day">{day}</span>
                <span className="date-month">{month}</span>
            </div>
            <div className="little-card-content">
                {title && <h3 className="little-card-title">{title}</h3>}

                {location && (
                    <div className="little-card-subtitle">
                        {location}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LittleCard;