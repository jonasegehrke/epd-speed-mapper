interface UploadFileResponse {
    status: boolean,
    message: string,
    data?: {
        fileIds: string[]
    }
}

export default UploadFileResponse;