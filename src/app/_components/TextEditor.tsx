"use client";
import React, { useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploder from "quill-image-uploader";
export default function TextEditor() {
  const [value, setValue] = useState("");
  Quill.register('modules/imageUploader',ImageUploder)
  useEffect(() => {
    const prevState = localStorage.getItem("textEditorData");
    if (prevState) setValue(prevState);
  }, []); // Run only on mount to prevent infinite loop

  useEffect(() => {
    localStorage.setItem("textEditorData", value);
  }, [value]); // Save value to localStorage whenever it changes

  const toolbar_option = [
    [{ color: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["link", "image", "video", "formula"],
  ];

  return (
    <>
      <ReactQuill
        modules={{ toolbar: toolbar_option }}
        theme="snow"
        onChange={setValue}
        value={value}
      />
    </>
  );
}
