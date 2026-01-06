export const downloadBlob = (blob: Blob, filename: string): void => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
};
  
export const downloadFromResponse = async (
    response: Response, 
    filename: string
): Promise<void> => {
    const blob = await response.blob();
    downloadBlob(blob, filename);
};