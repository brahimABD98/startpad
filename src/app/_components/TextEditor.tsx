"use client";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useRef, useLayoutEffect ,useEffect} from "react";
import Quill from "quill";
const TextEditor = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ readOnly, defaultValue, onChange, onSelect }, ref) => {
  const containerRef = useRef(null);
  const defaultValueRef = useRef(defaultValue);
  const onTextChangeRef = useRef(onChange);
  const onSelectionChangeRef = useRef(onSelect);

  useLayoutEffect(() => {
    onTextChangeRef.current = onChange;
    onSelectionChangeRef.current = onSelect;
  });

  useEffect(() => {
    ref.current?.enable(!readOnly);
  }, [ref, readOnly]);

  useEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );
    const quill = new Quill(editorContainer, {
      theme: "snow",
    });

    ref.current = quill;

    if (defaultValueRef.current) {
      quill.setContents(defaultValueRef.current);
    }

    quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      onTextChangeRef.current?.(...args);
    });

    quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      onSelectionChangeRef.current?.(...args);
    });

    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref]);

  return <div ref={containerRef}></div>;
});

TextEditor.displayName = "Editor";

export default TextEditor;
