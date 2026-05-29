import { useEffect } from "react";

export default function PhoneCall({ phone, onClose }) {
  useEffect(() => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
    onClose();
  }, [phone, onClose]);

  return null;
}
