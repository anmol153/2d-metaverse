class ApiResponse {
    constructor(statsusCode = 200, data = null,message = "Success") {
        this.statusCode = statsusCode;
        this.message = message;
        this.data = data;
        this.success = true;
    }
}
export default ApiResponse;