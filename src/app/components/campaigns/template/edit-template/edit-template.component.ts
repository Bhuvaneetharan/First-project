import { Component, OnInit } from '@angular/core';
// SERVICES
import { NavService } from '../../../../services'
import { CampaignsService } from '../../campaigns.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// SHARES
import { SnackBar } from '../../../../common/shared';
import Swal from 'sweetalert2'

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss']
})
export class EditTemplateComponent implements OnInit {

  createTemplate: FormGroup;
  templates:any;
  templateId:string;
  ckeditorConfig:any;
  ckeditordata:any;

  orderIs:any = ["Ordered", "Shipped"];
  chooseDays:any = ['+1','+2','+3','+4','+5','+6','+7','+8','+9','+10','+11','+12','+13','+14','+15','+16','+17','+18','+19','+20','+21','+22','+23','+24','+25','+26','+27','+28','+29','+30']
  times:any = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  timeset:any = ["AM","PM"]

  constructor(public campaginService: CampaignsService, public snackbars:SnackBar, public router: Router,public route: ActivatedRoute,  private navService:NavService, private campaignService: CampaignsService, private location:Location) {
    // NAV PANEL HIDE
    this.navService.show();
    this.templateId = this.route.snapshot.paramMap.get('id')
   }

  ngOnInit() {
    
    this.createTemplate = new FormGroup({
      'name': new FormControl('', Validators.required),
      'subject': new FormControl('', Validators.required),
      'orderis': new FormControl('', Validators.required),
      'days': new FormControl('', Validators.required),
      'times': new FormControl('', Validators.required),
      'timeSet': new FormControl('', Validators.required),
      'purposeof': new FormControl(''),
      'chooseTemplate': new FormControl(''),
      'campaign': new FormControl(''),
    });
    this.setValues();
    
    this.ckeditorConfig = {
      height: 300,
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
    this.ckeditorConfig.removePlugins = 'resize';
  }

  goBack(){
    this.location.back();
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

  // orderStatus(){
  //   if(this.createTemplate["value"]["orderis"] == "Shipped"){
  //     this.chooseDays = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']
  //   }else{
  //     this.chooseDays = ['+1','+2','+3','+4','+5','+6','+7','+8','+9','+10','+11','+12','+13','+14','+15','+16','+17','+18','+19','+20','+21','+22','+23','+24','+25','+26','+27','+28','+29','+30']
  //   }

  // }
  updateTemplatebutton(){

    

    let datas = {
      'id': this.templateId,
      'template_name': this.createTemplate["value"]["name"], 
      'template_purpose': this.createTemplate["value"]["purposeof"], 
      'template_subject': this.createTemplate["value"]["subject"], 
      'template_content': this.ckeditordata, 
      'trigger': this.createTemplate["value"]["orderis"], 
      'trigger_days': this.createTemplate["value"]["days"],
      'time': this.createTemplate["value"]["times"],
      'time_set': this.createTemplate["value"]["timeSet"],
      'camp_value': this.createTemplate["value"]["campaign"]
    }

    if(this.createTemplate["status"] == "VALID" && this.ckeditordata.length >= 450){
      this.campaignService.updateTemplate(datas).subscribe(res => {
        if(res["key"] == true){
          this.router.navigate(['/campaigns/template/templatelist'])
        }
      })
    }else{
      this.snackbars.snackbars("error","Please enter the mandatory fields");
    }
  }
  
  setValues(){

    this.campaignService.showEditTemplate(this.templateId).subscribe(res =>{

      if(res["mail_trigger_on"] == "Shipped"){
        this.chooseDays = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']
        let time = res["mail_trigger_time"].slice(0, 2);
        let timesets = res["mail_trigger_time"].slice(2, 4);
        let days = res["mail_trigger_days"].toString();
        this.createTemplate.setValue({
          'name': res["template_name"],
          'subject': res["template_subject"],
          'orderis': res["mail_trigger_on"],
          'days': days,
          'times': time,
          'timeSet': timesets,
          'purposeof': res["template_purpose"],
          'chooseTemplate': res["choose_template"],
          'campaign': res["campaign_purpose"]
        });
        if(res["template_purpose"] == 'Custom'){
          this.orderIs = ["Ordered", "Shipped", "Return"];
        }else{
          this.orderIs = ["Shipped"];
        }
        this.ckeditordata = res["template_content"];
        this.campaignService.chooseTemplate(res["template_purpose"]).subscribe(res => {
          this.templates = res
        })
      }else{
        this.chooseDays = ['+1','+2','+3','+4','+5','+6','+7','+8','+9','+10','+11','+12','+13','+14','+15','+16','+17','+18','+19','+20','+21','+22','+23','+24','+25','+26','+27','+28','+29','+30']
        let time = res["mail_trigger_time"].slice(0, 2);
      let timesets = res["mail_trigger_time"].slice(2, 4);
      let days = '+' + res["mail_trigger_days"];
      this.createTemplate.setValue({
        'name': res["template_name"],
        'subject': res["template_subject"],
        'orderis': res["mail_trigger_on"],
        'days': days,
        'times': time,
        'timeSet': timesets,
        'purposeof': res["template_purpose"],
        'chooseTemplate': res["choose_template"],
        'campaign': res["campaign_purpose"]
      });
      if(res["template_purpose"] == 'Custom'){
        this.orderIs = ["Ordered", "Shipped", "Return"];
      }else{
        this.orderIs = ["Shipped"];
      }
      this.ckeditordata = res["template_content"];
      this.campaignService.chooseTemplate(res["template_purpose"]).subscribe(res => {
        this.templates = res
      })
      }
      
    })
  }

  testmail(){
    if(this.createTemplate["value"]["subject"].length != 0){
      if(this.ckeditordata.length >= 450){
        let data={'subject':this.createTemplate["value"]["subject"], 'content': this.ckeditordata}
        this.campaignService.testMail(data).subscribe();
      }else{
        this.snackbars.snackbars("info", "Template cannot be empty")
      }
    }else{
      this.snackbars.snackbars("info", "Subject cannot be empty")
    }
  }
  
   ngOnDestroy() {
  }
}
