import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// SERVICES
import { NavService } from '../../../../services'
import { CampaignsService } from '../../campaigns.service'
import { Router,ActivatedRoute } from '@angular/router';
// SHARES
import { SnackBar } from '../../../../common/shared';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2'

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import {Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit {

  createTemplate: FormGroup;
  templates:any;
  templateName:any;
  ckeConfig:any;
  ckeditordata:any;
  camValue:any = "Future";
  templateId:any;
  constructor(public dialog: MatDialog, public campaginService: CampaignsService, public snackbars:SnackBar, public router: Router, private navService:NavService, private campaignService: CampaignsService, private location: Location,public route: ActivatedRoute, public translate: TranslateService) {
    // NAV PANEL HIDE
    this.navService.show();
    this.templateId = this.route.snapshot.queryParamMap.get('id')
   }

  ngOnInit() {
    this.createTemplate = new FormGroup({
      'name': new FormControl('', Validators.required),
      'campaignFor': new FormControl('', Validators.required),
      'purposeOf': new FormControl('', Validators.required),
      'chooseTemplate': new FormControl('', Validators.required),
      'subject': new FormControl('', Validators.required),
    });
    
    this.ckeConfig = {
      height: 300,
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
        { name: "styles", items: ["Styles", "Format", "FontSize", "-", "TextColor", "BGColor", "Font"] },
      ], 
      extraPlugins: 'justify,font,colorbutton,panelbutton,link',
    };
    this.ckeConfig.removePlugins = 'resize';
   this.setValues()
   this.createTemplate.patchValue({
    campaignFor: this.camValue
  });
  }
  setValues(){
    if(this.templateId!=null){
        this.campaignService.showEditTemplate(this.templateId).subscribe(res =>{
          console.log(res)
            this.createTemplate.setValue({
              'name': res["template_name"],
              'subject': res["template_subject"],
              'purposeOf': res["template_purpose"],
              'chooseTemplate': res["choose_template"],
              'campaignFor': res["campaign_purpose"]
            });
            this.ckeditordata = res["template_content"];
            this.campaignService.chooseTemplate(res["template_purpose"]).subscribe(res => {
              this.templates = res
            })
        })
      }
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

  campaign(event){
    this.ckeditordata = "";
    this.createTemplate.patchValue({
      campaignFor: event["value"]
    });
  }

  purposeOf(event){
    this.ckeditordata = "";
    this.createTemplate.patchValue({
      purposeOf: event["value"]
    });
    this.campaignService.chooseTemplate(event["value"]).subscribe(res => {
      this.templates = res
    })
  }

  templateNames(event){
    this.templateName = event;
    if(this.templateName != "none"){
    this.campaignService.subjectContent(event).subscribe(res =>{
      this.ckeditordata = res["template_content"];
      this.createTemplate.patchValue({
        subject: res["template_subject"]
      });
    })
  }else{
    this.ckeditordata = "";
    this.createTemplate.patchValue({
      subject: ""
    });
  }  
  }

  templateUniq(event) {
    this.campaignService.templateUnique(event["target"]["value"]).subscribe(res => {
      if (res["key"] == false) {
        this.createTemplate.controls['name'].reset();
      }
    })
  }

  createTemplatebutton(){
    if(this.templateId==null){
    let sendTempData = {
      'template_name': this.createTemplate["value"]["name"],
      'template_purpose': this.createTemplate["value"]["purposeOf"],
      'template_subject': this.createTemplate["value"]["subject"],
      'template_content': this.ckeditordata,
      'choose_template': this.templateName,
      'camp_value': this.createTemplate["value"]["campaignFor"] 
    }
     if(this.createTemplate["status"] == "VALID" && this.ckeditordata.length != 0){
       this.campaignService.sendTemplateData(sendTempData).subscribe(res => {
         if(res["key"]==true){
          this.router.navigate(['/campaigns/template/templatelist'])
         }
       })
     }else{
      this.snackbars.snackbars("error","Please enter the mandatory fields");
     }
    }else{
      let data = {
        'id': this.templateId,
        'template_name': this.createTemplate["value"]["name"], 
        'template_purpose': this.createTemplate["value"]["purposeOf"], 
        'template_subject': this.createTemplate["value"]["subject"], 
        'template_content': this.ckeditordata, 
        'camp_value': this.createTemplate["value"]["campaignFor"]
      }
      if(this.createTemplate["status"] == "VALID" && this.ckeditordata.length >= 450){
        this.campaignService.updateTemplate(data).subscribe(res => {
          if(res["key"] == true){
            this.router.navigate(['/campaigns/template/templatelist'])
          }
        })
      }else{
        this.snackbars.snackbars("error","Please enter the mandatory fields");
      }
    }
  }
  
  testmail(){
    if(this.createTemplate["value"]["subject"].length != 0){
      if(this.ckeditordata.length != 0){
        let data={'subject':this.createTemplate["value"]["subject"], 'content': this.ckeditordata}
        this.campaignService.testMail(data).subscribe();
      }else{
        this.snackbars.snackbars("error", "Template cannot be empty")
      }
    }else{
      this.snackbars.snackbars("error", "Subject cannot be empty")
    }
  }
  ngOnDestroy() {
  }
}

