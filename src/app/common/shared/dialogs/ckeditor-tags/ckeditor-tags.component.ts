import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserInformationService } from '../../../../services';
import Swal from 'sweetalert2'
// SHARES
import { SnackBar } from '../../snackBar';


@Component({
  selector: 'app-ckeditor-tags',
  templateUrl: './ckeditor-tags.component.html',
  styleUrls: ['./ckeditor-tags.component.scss']
})
export class CkeditorTagsComponent implements OnInit {
  ckeConfig:any;
  htmlContent:any = null;
  constructor(public snackbars: SnackBar, public dialogRef: MatDialogRef<CkeditorTagsComponent>, private userService: UserInformationService,  @Inject(MAT_DIALOG_DATA) public data ) { }
  subjectName:any;
  ngOnInit() {

    this.ckeConfig = {
      height: 200,
      // width : 600,
      uiColor: "#ebebeb",
      language: "en",
      allowedContent: true,
      fullPage: true,
     
      toolbar: [
        { name: "documenthandling", items: ["imageExplorer"] },
        { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source', '-', '-'] },
        { name: "insert", items: ["Image"] },
        { name: "basicstyles", items: ["Bold", "Italic", "Underline", "Strike"] },
        { name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Undo', 'Redo'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'links', items: [ 'Link', 'Unlink' ] },
        // { name: 'tools', items: [ 'Maximize'] },
        { name: "styles", items: ["Styles", "Format", "FontSize", "-", "TextColor", "BGColor", "Font"] },
      ],
      
      extraPlugins: 'justify,font,colorbutton,panelbutton,link',
    };
    this.ckeConfig.removePlugins = 'resize';
  }

  emailSent(){
    if(this.subjectName){
      if(this.htmlContent.length >= 65){
        let data = {"order_id": this.data["order"], "template":this.htmlContent, "Subject":this.subjectName}
        this.userService.negativeFeedbackMail(data).subscribe(res =>{
           if(res["key"]==true){
             this.dialogRef.close();
           }
        })   
      }else{
        this.snackbars.snackbars("error","Editor should not be left blank. Please enter some text");
      }
    }else{
      this.snackbars.snackbars("error","Subject should not be blank");
    }
  }

  close(){
    this.dialogRef.close();
  }
  
  insert(event) {
    Swal.fire({
      title: 'List of Tags',
      input: 'select',
      inputOptions: {
        '{{Buyer Name}}': '{{Buyer Name}}',
        '{{Order Id}}': '{{Order Id}}',
        '{{Product Title}}': '{{Product Title}}',
        '{{Product Link}}': '{{Product Link}}',
        '{{ASIN}}': '{{ASIN}}'
      },
      inputPlaceholder: 'Choose a Tag',
      showCancelButton: true,
      inputValidator: function (value) {
        return new Promise(function (resolve, reject) {
          if (value !== '') {
            resolve();
          } else {
            reject('You need to select a Tag');
          }
        });
      }
    }).then(function (result) {
      let data = JSON.stringify(result.value);
      event.insertText(data);
    });

  }

}
