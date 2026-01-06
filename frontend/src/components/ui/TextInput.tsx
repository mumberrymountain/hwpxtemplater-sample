import React from 'react'

type TextInputProps = {
  inputRef : React.RefObject<HTMLInputElement | null>;
  editMetaRef : React.RefObject<{
    range: {
        startLineNumber: number;
        startColumn: number;
        endLineNumber: number;
        endColumn: number;
    };
    original: string | boolean | number;
  } | null>;
  applyEditAndClose: () => void;
};

const TextInput: React.FC<TextInputProps> = ({inputRef, editMetaRef, applyEditAndClose}) => {

  const onKeyDownTextInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const forbiddenKeys = ['"', "'", '\\', '\n', '\r', '\t'];
    
    if (forbiddenKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
        e.preventDefault();
        applyEditAndClose();
    }

    if (e.key === "Escape") {
        e.preventDefault();
        inputRef.current!.style.display = "none";
        editMetaRef.current = null;
    }
  }

  const onPasteTextInput = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  }

  const onBlurTextInput = () => applyEditAndClose();

  return (
    <>
      <input
        ref={inputRef}
        placeholder="값 입력"
        className="hidden bg-[#252526] text-white border border-[#555] px-[6px] py-1 rounded z-[1000]"
        onKeyDown={onKeyDownTextInput}
        onPaste={onPasteTextInput}
        onBlur={onBlurTextInput}
      />
    </>
  )
}

export default TextInput