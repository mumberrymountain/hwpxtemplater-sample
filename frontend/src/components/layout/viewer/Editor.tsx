import { useRef, useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import type { Dispatch, SetStateAction } from "react";
import type { OnMount } from "@monaco-editor/react";
import _ from 'lodash';
import beautify from 'js-beautify';
import type { CardDataItem, TableData } from "../../../types/CardDataItem";
import TextInput from "../../ui/TextInput";
import NumberInput from "../../ui/NumberInput";
import BooleanInput from "../../ui/BooleanInput";

type EditorProps = {
  cardData: CardDataItem[];
  setCardData: Dispatch<SetStateAction<CardDataItem[]>>;
  selectedCardIndex: number;
};

// 🔹 재귀적으로 모든 primitive 값 추출
type TemplateParamValue = string | boolean | number | Array<{title: string, description: string | boolean | number}> | TableData;
type TemplateParam = Record<string, TemplateParamValue>;

const Editor: React.FC<EditorProps> = ({cardData, setCardData, selectedCardIndex}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);
  const booleanInputRef = useRef<HTMLSelectElement>(null);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    templateParamRef.current = cardData[selectedCardIndex]?.templateParam;
  }, [cardData, selectedCardIndex]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const getAllPrimitiveValues = (obj: TemplateParam | TemplateParamValue): (string | boolean | number)[] => {
    const values: (string | boolean | number)[] = [];
    
    const extract = (item: TemplateParam | TemplateParamValue): void => {
      if (_.isArray(item)) {
        item.forEach(extract);
      } else if (_.isPlainObject(item)) {
        _.values(item).forEach(extract);
      } else if (typeof item === 'string' || typeof item === 'boolean' || typeof item === 'number') {
        values.push(item);
      }
    };
    
    extract(obj);
    return values;
  };

  // 🔹 값으로 키 경로 찾기 (재귀적)
  const findKeyPath = (obj: TemplateParam | TemplateParamValue, targetValue: string | boolean | number, currentPath: string = ''): string | null => {
    if (obj === targetValue) {
      return currentPath;
    }

    if (_.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const newPath = currentPath ? `${currentPath}[${i}]` : `[${i}]`;
        const result = findKeyPath(obj[i], targetValue, newPath);
        if (result) return result;
      }
    } else if (_.isPlainObject(obj)) {
      for (const [key, value] of Object.entries(obj)) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        const result = findKeyPath(value as TemplateParam | TemplateParamValue, targetValue, newPath);
        if (result) return result;
      }
    }

    return null;
  };

  const initCode = (params: TemplateParam) => {
    let arrayDeclarations = "";
    let tableDeclarations = "";
    const getValueExpression = (key: string, value: TemplateParamValue): string => {
      // 테이블 데이터 처리 (columns + rows 구조)
      if (
        typeof value === 'object' && 
        value !== null && 
        !Array.isArray(value) &&
        'columns' in value && 
        'rows' in value
      ) {
        const tableVar = `${key}`;
        const tableData = value as TableData;
        const columns = tableData.columns;
        const rows = tableData.rows;
        const columnKeys = Object.keys(columns);
        
        // 컬럼 정의 (한글명 사용)
        const colDefs = columnKeys.map(colKey => 
          `new Col("${colKey}").width(150).align(Align.Center)`
        ).join(",\n                                    ");
        
        // 헤더 행 (key는 영문, value는 한글)
        const headerPuts = columnKeys.map(colKey => 
          `put("${colKey}", "${columns[colKey]}");`
        ).join("\n                        ");
        
        // 데이터 행들
        const dataRows = rows.map((row: Record<string, string | boolean | number>) => {
          const rowPuts = columnKeys.map(colKey => {
            const val = row[colKey];
            if (typeof val === 'number') {
              return `put("${colKey}", ${val});`;
            } else if (typeof val === 'string') {
              return `put("${colKey}", "${val}");`;
            }
            return `put("${colKey}", "${val}");`;
          }).join("\n");
          
          return `.rowWithStyle(new HashMap<String, Object>() {{
                          ${rowPuts}
                      }}).height(55).apply()`;
        }).join("\n");
        
        tableDeclarations += `
              Table ${tableVar} = Table.builder()
                      .cols(
                              Arrays.asList(
                                      ${colDefs}
                              )
                      )
                      .rowWithStyle(new HashMap<String, Object>() {{
                          ${headerPuts}
                      }}).height(40).backgroundColor("#f5f5f5").apply()
                      ${dataRows}
                      .create();
        `;
        
        return tableVar;
      }

      if (Array.isArray(value)) {
        const listVar = `${key}List`;
        const items = value
          .map(item => `
            add(new HashMap<String, Object>() {{
            put("title", "${item.title}");
            put("description", "${item.description}");
            }});`).join("");
                
            arrayDeclarations += `
            ArrayList<HashMap<String, Object>> ${listVar} = new ArrayList<HashMap<String, Object>>() {{
              ${items}
            }};
          `;
        return listVar;
      }
      
      if (_.isString(value) && value.endsWith(".png")) {
        return `new Image(getServletContext().getRealPath("${value}")).width(130).height(130)`;
      }
      
      if (typeof value !== 'string') {
        return value.toString();
      }
      
      return `"${value}"`;
    };
    
    const puts = Object.entries(params)
      .map(([key, value]) => {
        return `put("${key}", ${getValueExpression(key, value)});`;
      })
      .join("\n");
    
    const rawCode = `
      import javax.servlet.http.HttpServletResponse;
      import io.github.mumberrymountain.HWPXTemplater;
      import java.util.*;

      ${tableDeclarations ? tableDeclarations : arrayDeclarations ? arrayDeclarations: ""}

      HWPXTemplater hwpxTemplater = HWPXTemplater.builder()
      .parse("./template.hwpx")
      .render(new HashMap<String, Object>() {{
      ${puts}
      }})
      .write(response.getOutputStream());
      `;
    
    return beautify(rawCode, {
      indent_size: 4,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      brace_style: 'collapse',
    });
  };
  const code = initCode(cardData[selectedCardIndex]?.templateParam);

  const editMetaRef = useRef<{
                        range: {
                            startLineNumber: number;
                            startColumn: number;
                            endLineNumber: number;
                            endColumn: number;
                        };
                        original: string | boolean | number;
                      } | null>(null);
  const templateParamRef = useRef(cardData[selectedCardIndex]?.templateParam);

  const hideInputRef = () => {
    inputRef.current!.style.display = "none";
    inputRef.current!.value = "";
    numberInputRef.current!.style.display = "none";
    numberInputRef.current!.value = "";
    booleanInputRef.current!.style.display = "none";
    booleanInputRef.current!.value = "";
  } 

  const showInputRef = (inputRef: React.RefObject<HTMLInputElement | HTMLSelectElement | null>, coords: { left: number, top: number }, value: string) => {
    if (!inputRef.current) return;
    inputRef.current.value = value;
    inputRef.current.style.display = "block";
    inputRef.current.style.position = "absolute";
    inputRef.current.style.left = `${coords.left}px`;
    inputRef.current.style.top = `${coords.top - 32}px`;
    inputRef.current.focus();
  }

  const getEditValue = (original: string | boolean | number, select: HTMLSelectElement | null, numberInput: HTMLInputElement | null, input: HTMLInputElement | null) => {
    if (typeof original === 'boolean') return select?.value === 'true';
    else if (typeof original === 'number') return numberInput?.value ? Number(numberInput.value) : original;
    return input?.value || '';
  }

  const getRenderingValue = (original: string | boolean | number, newValue: string | boolean | number) => {
    if (typeof original === 'boolean' || typeof original === 'number') return newValue.toString();
    return `"${newValue}"`;
  }

  const refreshEditor = (model: NonNullable<ReturnType<Parameters<OnMount>[0]['getModel']>>, newValue: string | boolean | number) => {
    if (!editMetaRef.current || newValue === editMetaRef.current.original) return;
    model.applyEdits([ { range: editMetaRef.current.range, text: getRenderingValue(editMetaRef.current.original, newValue), forceMoveMarkers: true  }, ]);
  }

  const updateCardData = (newValue: string | boolean | number) => {
    const keyPath = findKeyPath(templateParamRef.current, editMetaRef.current!.original);
    if (!keyPath) return;
    
    const updatedParam = _.cloneDeep(templateParamRef.current);
    _.set(updatedParam, keyPath, newValue);
    setCardData(prev => {
      const updated = [...prev];
      updated[selectedCardIndex] = {
        ...updated[selectedCardIndex],
        templateParam: updatedParam
      };
      return updated;
    });
  }
  
  const applyEditAndClose = () => {
    if (!editorRef.current) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    // 🔹 타입에 따라 적절한 input에서 값 가져오기
    const newValue = getEditValue(editMetaRef.current!.original, booleanInputRef.current, numberInputRef.current, inputRef.current);
    refreshEditor(model, newValue);
    updateCardData(newValue);
    hideInputRef()
    editMetaRef.current = null;
  };  

  const parseValue = (str: string): string | boolean | number => {
    if (str === 'true') return true;
    if (str === 'false') return false;
    if (/^\d+$/.test(str)) return parseInt(str, 10);
    if (/^\d+\.\d+$/.test(str)) return parseFloat(str);
    
    return str.replace(/^["']|["']$/g, '');
  };

  return (
    <div
      ref={containerRef}
      className="h-full relative min-h-[400px] sm:min-h-[500px] lg:min-h-0"
    >
      <MonacoEditor
        height={isMobile ? "400px" : "100%"}
        language="java"
        theme="vs-dark"
        value={code}
        onMount={(editor, monaco) => {
          editorRef.current = editor;

          monaco.languages.setMonarchTokensProvider('java', {
            tokenizer: {
              root: [
                [/"([^"\\]|\\.)*"/, 'string'],
                [/'([^'\\]|\\.)*'/, 'string'],
                [/\b\d+(\.\d+)?\b/, 'number'],
                [/\b(true|false)\b/, 'keyword.boolean'],
                [/\b(put|new|HashMap|String|Object|render|add|ArrayList)\b/, 'keyword'],
                [/[a-zA-Z_]\w*/, 'identifier'],
                [/[{}()[\]\\]/, '@brackets'],
                [/[<>]/, 'delimiter.angle'],
                [/[,;.]/, 'delimiter'],
              ]
            }
          });

          monaco.languages.setLanguageConfiguration('java', {
            wordPattern: /"[^"]*"|'[^']*'|\b[\w-]+\b|[a-zA-Z_]\w*/g
          });

          editor.updateOptions({ readOnly: true });
          editor.onDidChangeCursorPosition((e) => {
            const model = editor.getModel();
            if (!model || !containerRef.current || !inputRef.current || !numberInputRef.current || !booleanInputRef.current) return;

            const word = model.getWordAtPosition(e.position);
            if (!word?.word) return;
          
            const wordAtPos = parseValue(word.word);
            const allValues = getAllPrimitiveValues(templateParamRef.current);
            
            if (!allValues.includes(wordAtPos)) return;
            if (editMetaRef.current) return;

            editMetaRef.current = {
                original: wordAtPos,
                range: {
                    startLineNumber: e.position.lineNumber,
                    startColumn: word.startColumn,
                    endLineNumber: e.position.lineNumber,
                    endColumn: word.endColumn,
                },
            };

            const coords = editor.getScrolledVisiblePosition({
              lineNumber: e.position.lineNumber,
              column: word.startColumn,
            });

            if (!coords) return;

            // 🔹 타입에 따라 적절한 input 표시
            // 모든 input 먼저 숨김
            hideInputRef();
            switch (typeof wordAtPos) {
              case 'boolean':
                showInputRef(booleanInputRef, coords, wordAtPos.toString());
                break;
              case 'number':
                showInputRef(numberInputRef, coords, wordAtPos.toString());
                break;
              default:
                showInputRef(inputRef, coords, wordAtPos.toString());
                break;
            }
          });
        }}
        options={{
          readOnly: true,
          fontSize: 14,
          minimap: { enabled: false },
        }}
      />

      <TextInput inputRef={inputRef} editMetaRef={editMetaRef} applyEditAndClose={applyEditAndClose}/>
      <NumberInput numberInputRef={numberInputRef} editMetaRef={editMetaRef} applyEditAndClose={applyEditAndClose}/>
      <BooleanInput booleanInputRef={booleanInputRef} editMetaRef={editMetaRef} applyEditAndClose={applyEditAndClose}/>
    </div>
  );
};

export default Editor;