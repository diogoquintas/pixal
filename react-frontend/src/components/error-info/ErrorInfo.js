import styled from "@emotion/styled";
import { useState } from "react";
import hideScrollbar from "../../styles/hideScrollbar";

export const ErrorPre = styled.pre`
  margin-top: 1rem;
  white-space: pre-wrap;
  max-width: 25rem;
  overflow: auto;

  ${hideScrollbar}
`;

export const Button = styled.button`
  background: none;
  padding: 0;
  border: 0;
  text-decoration: underline;
  color: white;
  text-align: left;
  cursor: pointer;
`;

export default function ErrorInfo({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(!open)}>
        {open ? "hide details" : "show detailed info"}
      </Button>
      {open && <ErrorPre>{children}</ErrorPre>}
    </>
  );
}
