"use client";
import React from "react";
import ReactQuill from "react-quill";

export function DisplayPostContent({ content }: Readonly<{ content: string }>) {
  return (
    <ReactQuill value={content} readOnly={true} theme="bubble" />
  );
}
