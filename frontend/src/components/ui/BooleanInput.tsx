import React from 'react'

type BooleanInputProps = {
  booleanInputRef : React.RefObject<HTMLSelectElement | null>;
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

const BooleanInput: React.FC<BooleanInputProps> = ({booleanInputRef, editMetaRef, applyEditAndClose}) => {
  const onChangeBooleanInput = () => applyEditAndClose();

  const onKeyDownBooleanInput = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "Enter") {
        e.preventDefault();
        applyEditAndClose();
    }

    if (e.key === "Escape") {
        e.preventDefault();
        booleanInputRef.current!.style.display = "none";
        editMetaRef.current = null;
    }
  }

  const onBlurBooleanInput = () => applyEditAndClose();

  return (
    <>
      <select
        ref={booleanInputRef}
        className="hidden bg-[#252526] text-white border border-[#555] px-[6px] py-1 rounded z-[1000]"
        onChange={onChangeBooleanInput}
        onKeyDown={onKeyDownBooleanInput}
        onBlur={onBlurBooleanInput}
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </>
  )
}

export default BooleanInput