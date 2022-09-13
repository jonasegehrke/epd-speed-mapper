import apiClient from '../api/ApiClient'
import type UploadFileResponse from "../types/UploadFileResponseType"



class FileService {

    private fileType: Array<string>;

    constructor(fileType: string | Array<string>) {
        if (typeof fileType === "string") {
            this.fileType = [fileType]
        } else {
            this.fileType = fileType;
        }
    }

    //public async downloadFile(file: string): Promise<File>

    public async uploadFile(files: Array<File>, endpointPath: string): Promise<UploadFileResponse | undefined> {
        let formData = new FormData();

        const result = this.checkExtenionFiles(files);

        if (!result) {
            return {
                status: false,
                message: `Upload must be of type ${this.fileType}`
            }
        } else {
            files.forEach((f, i) => {
                formData.append('files', f);
            })
            const response = await apiClient.post(endpointPath, formData
                //, {headers: {'Content-Type': 'multipart/form-data'},}
            )
            if (response.status === 200) {
                return {
                    status: true,
                    message: response.statusText,
                    data: response.data
                    
                };
            } else {
                return {
                    status: false,
                    message: response.statusText
                }
            }
        }
    }

    public printFileName(file: File): void {
        console.log(file);
        this._checkExtensionFile(file);
    }

    public printFiles(files: Array<File>): void {
        files.forEach((f) => {
            console.log(f.name);
        })
    }

    public checkExtenionFiles(files: Array<File>): boolean {
        for (let file in files) {
            if (!this._checkExtensionFile(files[file])) {
                return false;
            }
        }
        return true;
    }

    private _checkExtensionFile(file: File): boolean {
        let ext: string | undefined = file.name.split('.').pop();
        if (ext != null) {
            let _idx: number = this.fileType.indexOf(ext);
            console.log(_idx);
            console.log(_idx > -1);
            return _idx > -1;
        } else {
            return false;
        }
    }
}

export default FileService;