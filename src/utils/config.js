export const ACCEPT_CONFIG = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
  video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
  document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff'],
  compress: ['.zip', '.rar'],
  getAll(){
      return [...this.image, ...this.video, ...this.document, ...this.compress]
  },
};