
export class Message {
    id: string;
    sender: object;
    recipients: Array<object>;
    subject: string;
    content: string;
    createDate: string;

    constructor(id?, sender?, recipient?, subject?, content?, createDate?, object?) {
        this.id = object ? object.id : null;
        this.sender = object ? object.sender : {};
        this.recipients = object ? object.recipients : [];
        this.subject = object ? object.subject : "";
        this.content = object ? object.content : "";
        this.createDate = object ? object.createDate : "";
    }

    // constructor(object: any) {
    //     this.id = object['id'];
    //     this.sender = object.sender;
    //     this.recipients = object.recipients;
    //     this.subject = object['subject'];
    //     this.content = object.content;
    //     this.createDate = object.createDate;
    // }

    // constructor(id, sender, recipient, subject, content, createDate) {
    //     this.id = null;
    //     this.sender = {};
    //     this.recipients = [];
    //     this.subject = "";
    //     this.content = "";
    //     this.createDate = "";
    // }


}

