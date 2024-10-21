"use client";
import React, {
  useRef
} from "react";
import ReactQuill from "react-quill";
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


