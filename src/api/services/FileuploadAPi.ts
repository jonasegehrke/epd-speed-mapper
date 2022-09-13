import FileService from '../../services/FileService';
import type UploadFileResponse from '../../types/UploadFileResponseType';

const fileService: FileService = new FileService(['pdf', 'png']);
const fileUploadEndpointPath: string = "api/Material/upload"

export async function uploadFiles(filesToUpload: any): Promise<UploadFileResponse | undefined> {
    if (filesToUpload.value != null && filesToUpload.value.files != null) {
      const _files = filesToUpload.value.files;
      if (_files != null) {
        const fileArray = [..._files]
        const response = await fileService.uploadFile(fileArray, fileUploadEndpointPath);
        return response
      }
    } else {
      console.log("shit")
    }
  }