import { IMAIL } from "../types/IEmail.interfaces";

export default class EmailServices{
    send_mail(obj:IMAIL, template_Id:string){
        return obj.sendMail(template_Id);
    }
    
}