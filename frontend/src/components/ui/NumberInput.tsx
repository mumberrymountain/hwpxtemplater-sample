import React from 'react'

type NumberInputProps = {
  numberInputRef : React.RefObject<HTMLInputElement | null>;
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

const NumberInput: React.FC<NumberInputProps> = ({numberInputRef, editMetaRef, applyEditAndClose}) => {

  const onKeyDownNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        e.preventDefault();
        applyEditAndClose();
    }

    if (e.key === "Escape") {
        e.preventDefault();
        numberInputRef.current!.style.display = "none";
        editMetaRef.current = null;
    }
  }

  const onBlurNumberInput = () => applyEditAndClose();

  return (
    <>
      <input
          ref={numberInputRef}
          type="number"
          className="hidden bg-[#252526] text-white border border-[#555] px-[6px] py-1 rounded z-[1000] w-[100px]"
          onKeyDown={onKeyDownNumberInput}
          onBlur={onBlurNumberInput}
      />
    </>
  )
}

export default NumberInput