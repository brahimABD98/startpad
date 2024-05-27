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
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

const TextEditor = ({ setContent }: TextEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const [value, setValue] = useState("");
  useEffect(() => {
    const prevState = localStorage.getItem("textEditorData");
    if (prevState) setValue(prevState);
    setIsMounted(true);
  }, []); // Run only on mount to prevent infinite loop
  const quillRef: React.LegacyRef<ReactQuill> = useRef(null);

  const openCustomFilePicker = useCallback(() => {
    // Simulate a file input click event

    if (isMounted) {
      const fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      fileInput.setAttribute("accept", "image/*");
      fileInput.style.display = "none"; // Hide the input element
      document.body.appendChild(fileInput);
      fileInput.click();

      fileInput.onchange = async () => {
        if (!fileInput.files) {
          console.error("Error occurred while getting input");
          return;
        }

        const file = fileInput.files[0];
        if (!file) {
          console.error("Error while getting file");
          return;
        }

        // TODO: Upload file to server (implementation depends on your backend)
        // TODO:content moderation https://github.com/afoley587/hosting-yolo-fastapi
        const imageUrl = uploadFileToServer(file); // Replace with your upload function

        // if (!imageUrl) {
        //   console.error("Error uploading file");
        //   return;
        // }

        const quillEditor = quillRef.current?.getEditor();
        if (!quillEditor) return;

        const range = quillEditor.getSelection(true);
        //FIXME : fix image insert inside texteditor
        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");

        document.body.removeChild(fileInput); // Remove the temporary input element
      };
    }
  }, []);

  useEffect(() => {
    setContent(value);
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
          image: openCustomFilePicker,
        },
      },
    }),
    [openCustomFilePicker],
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

// This function needs to be implemented based on your backend
function uploadFileToServer(file: File) {
  // Implement your upload logic here (e.g., using fetch API or a library like Axios)
  // This function should return the uploaded image URL on success
  throw new Error("uploadFileToServer not implemented");
}
