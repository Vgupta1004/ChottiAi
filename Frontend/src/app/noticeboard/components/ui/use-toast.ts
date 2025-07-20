import { useState } from "react";

export function useToast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const show = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };
  const hide = () => setOpen(false);
  return { open, message, show, hide };
}
