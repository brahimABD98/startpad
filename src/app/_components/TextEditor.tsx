"use client";
import React, {
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
type TextEditorProps = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

const TextEditor = ({ setContent, content }: TextEditorProps) => {
  const quillRef: React.LegacyRef<ReactQuill> = useRef(null);

  return (
    <>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        onChange={setContent}
        value={content}
      />
    </>
  );
};

export default TextEditor;

// This function needs to be implemented based on your backend
function uploadFileToServer(file: File) {
  // Implement your upload logic here (e.g., using fetch API or a library like Axios)
  // This function should return the uploaded image URL on success
  throw new Error("uploadFileToServer not implemented");
}
