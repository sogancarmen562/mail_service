import { attachmentsType } from "src/presentation/dto/sendMail.dto";

interface ISendMail {
    sendMail(mailParameter: MailParameter): Promise<void>;
}

export interface MailParameter {
    to: string
    subject: string
    text?: string
    html?: string
    cc?: string[]
    bcc?: string[]
    attachments?: attachmentsType[]
}

export default ISendMail;