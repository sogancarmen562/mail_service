export class Result {
  success: boolean;
  message: string;
  data: any;
  constructor(sucess: boolean, message: string, data: any) {
    this.success = sucess;
    this.message = message;
    this.data = data;
  }
}