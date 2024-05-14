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
interface TextEditorProps {
  onImageInsert: (imageUrl: string) => void;
}
const TextEditor: React.FC<TextEditorProps> = ({ onImageInsert }) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    const prevState = localStorage.getItem("textEditorData");
    if (prevState) setValue(prevState);
  }, []); // Run only on mount to prevent infinite loop
  const quillRef: React.LegacyRef<ReactQuill> = useRef(null);

  const fileHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = () => {
      if (!input.files) {
        console.error("error occured wile getting input");
        return;
      }

      const file = input.files[0];
      if (!file) {
        console.error("error while getting file");
        return;
      }
      const reader = new FileReader();

      // Read the selected file as a data URL
      reader.onload = () => {
        const imageUrl = reader.result;
        if (!quillRef?.current) return;

        const quillEditor = quillRef.current.getEditor();
        console.warn("file", file, "url", imageUrl);

        // Get the current selection range and insert the image at that index
        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      };
      reader.readAsDataURL(file);
    };
  }, []);
  useEffect(() => {
    localStorage.setItem("textEditorData", value);
  }, [value]); // Save value to localStorage whenever it changes
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ color: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["link", "image", "video", "formula"],
        ],
        handlers: {
          image: fileHandler,
        },
      },
    }),
    [fileHandler],
  );
  return (
    <>
      <ReactQuill
        ref={quillRef}
        modules={modules}
        theme="snow"
        onChange={setValue}
        value={value}
      />
    </>
  );
};

export default TextEditor;