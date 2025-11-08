export const fileToBase64 = (file: File): Promise<{ data: string, dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const data = dataUrl.split(',')[1];
      resolve({ data, dataUrl });
    };
    reader.onerror = (error) => reject(error);
  });
};
