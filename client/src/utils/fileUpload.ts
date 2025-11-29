export const uploadFile = async (file: File): Promise<string> => {
  // In a real application, you would upload the file to your server here
  // This is a mock implementation that returns a data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Simulate network delay
      setTimeout(() => {
        resolve(reader.result as string);
      }, 1000);
    };
    reader.readAsDataURL(file);
  });
};

export const validateImage = (file: File): { valid: boolean; message?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: 'Only JPG, PNG, and GIF files are allowed.' 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      message: 'Image size should be less than 5MB.' 
    };
  }
  
  return { valid: true };
};
