import React from 'react';
import { useNavigate, useParams } from "react-router-dom";

export default function Room() {
    const { roomid } = useParams();
    return (
        <div>{roomid}</div>
    )
}
